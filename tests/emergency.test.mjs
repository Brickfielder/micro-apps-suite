import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {newSession, transition, dial, recordDetails, completionReady, summary, criteriaFor} from '../apps/emergency-call-simulator/core.mjs';
import {handleSession, sessionConfig, loadScenario, validateInput, rateLimit} from '../api/emergency-session.mjs';

const settings = {difficulty:'easy',assistance:'guided',allowance:60,duration:600,repetition:true};
const body = {scenarioId:'fall',stage:'operator',settings};
const origin = 'http://localhost:8080';
const env = {LOCAL_DEVELOPMENT:'true',OPENAI_API_KEY:'test-secret'};
const request = (data=body,headers={},method='POST') => new Request(`${origin}/api/emergency-session`,{method,headers:{Origin:origin,'Content-Type':'application/json',...headers},...(method==='POST'?{body:JSON.stringify(data)}:{})});

test('only exact 999 advances the dialler; every invalid number stays local',async()=>{
  const scenario=await loadScenario('fall'); const s=newSession(scenario,settings,0);
  transition(s,'home');transition(s,'dialler');
  for(const value of ['','112','911','9999','+999','0999','999 ','*999#']) {assert.equal(dial(s,value,1000),false);assert.equal(s.phase,'dialler');}
  assert.equal(dial(s,'999',2000),true);assert.equal(s.phase,'connecting');assert.equal(s.startedAt,2000);
  assert.throws(()=>transition(s,'concluding'),/Invalid transition/);
});

test('completion needs correct service and grounded caller evidence; overrides do not manufacture completion',async()=>{
  const scenario=await loadScenario('fall');const s=newSession(scenario,settings,0);
  s.transcript.push({role:'handler',text:'18 Practice Lane'},{role:'caller',text:'London'});
  assert.equal(recordDetails(s,scenario,[{id:'location',status:'provided',evidence:'18 Practice Lane'}]),0);
  assert.equal(recordDetails(s,scenario,[{id:'location',status:'partial',evidence:'London'}]),1);
  assert.equal(completionReady(s,scenario),false);
  for(const c of criteriaFor(scenario,'easy')) {
    const evidence=`Caller supplied ${c.id}`;s.transcript.push({role:'caller',text:evidence});
    assert.equal(recordDetails(s,scenario,[{id:c.id,status:'provided',evidence}]),1);
  }
  s.serviceChoices=['police'];assert.equal(completionReady(s,scenario),false);
  s.serviceChoices.push('ambulance');assert.equal(completionReady(s,scenario),true);
  s.overrides.location='partial';const result=summary(s,scenario);
  assert.equal(result.details.find(d=>d.id==='location').source,'Clinician override');
  assert.equal(result.completeness.provided,result.completeness.total-1);
});

test('all five scenarios have caller information, explicit review status, unique criteria and deterministic changes',async()=>{
  const ids=JSON.parse(await readFile(new URL('../apps/emergency-call-simulator/scenarios/index.json',import.meta.url)));
  assert.equal(ids.length,5);
  for(const id of ids) {
    const s=await loadScenario(id);assert.ok(s.fictional);assert.ok(s.initiallyKnown.length>=5);
    assert.equal(new Set(s.criteria.map(c=>c.id)).size,s.criteria.length);
    assert.deepEqual(s.responderProtocol.approvedFirstAid,[]);
    assert.equal(s.responderProtocol.clinicalReviewStatus,'Awaiting clinician review');
    for(const c of s.changes) assert.ok(Number.isInteger(c.afterCallerTurns)&&c.afterCallerTurns>0);
  }
  await assert.rejects(loadScenario('../../.env.local'));
});

test('responder configuration does not leak hidden answers and uses two actual voices',async()=>{
  const s=await loadScenario('fall');const initial=sessionConfig(s,body);
  const handler=sessionConfig(s,{...body,stage:'handler',service:'ambulance'});
  assert.equal(initial.model,'gpt-realtime-2.1');assert.notEqual(initial.audio.output.voice,handler.audio.output.voice);
  assert.equal(initial.audio.input.turn_detection.eagerness,'low');
  for(const answer of ['18 Practice Lane','07700 900123','Pat, aged 82']) assert.ok(!handler.instructions.includes(answer));
  assert.match(handler.instructions,/NEVER give medical/);assert.match(handler.instructions,/No dispatch claims/);
  assert.ok(handler.tools.some(t=>t.name==='finish_practice'));
  assert.throws(()=>validateInput({...body,settings:{...settings,duration:999999}}));
  assert.throws(()=>validateInput({...body,context:42}));
});

test('endpoint rejects foreign origins, unauthorized callers, malformed and oversized requests without calling OpenAI',async()=>{
  let calls=0;const fetcher=async()=>{calls++;throw Error('must not reach provider');};
  assert.equal((await handleSession(request(body,{Origin:'https://evil.example'}),env,fetcher)).status,403);
  assert.equal((await handleSession(request(body),{...env,SESSION_ACCESS_CODE:'private'},fetcher)).status,401);
  assert.equal((await handleSession(request({...body,scenarioId:'../secret'}),env,fetcher)).status,400);
  assert.equal((await handleSession(request({...body,context:'x'.repeat(20000)}),env,fetcher)).status,400);
  assert.equal((await handleSession(request(body,{},'GET'),env,fetcher)).status,405);
  assert.equal((await handleSession(request(body,{},'OPTIONS'),env,fetcher)).status,204);
  assert.equal(calls,0);
});

test('hosted limiter fails closed and shared hourly/daily counters are checked',async()=>{
  await assert.rejects(rateLimit({},'test'),/shared rate limiter/);
  const redisEnv={UPSTASH_REDIS_REST_URL:'https://redis.example',UPSTASH_REDIS_REST_TOKEN:'test'};
  assert.equal(await rateLimit(redisEnv,'test',async()=>Response.json({result:[12,100]})),true);
  assert.equal(await rateLimit(redisEnv,'test',async()=>Response.json({result:[13,20]})),false);
  assert.equal(await rateLimit(redisEnv,'test',async()=>Response.json({result:[2,101]})),false);
  await assert.rejects(rateLimit(redisEnv,'test',async()=>Response.json({error:'failed'})));
});

test('endpoint returns only ephemeral credential and keeps provider errors generic',async()=>{
  const credential=await handleSession(request(body,{'x-forwarded-for':'test-success'}),env,async(url,options)=>{
    assert.equal(url,'https://api.openai.com/v1/realtime/client_secrets');
    const config=JSON.parse(options.body);assert.equal(config.expires_after.seconds,60);
    return Response.json({value:'ek_test',expires_at:1234567890,session:{instructions:'private'}});
  });
  assert.equal(credential.status,200);assert.deepEqual(await credential.json(),{value:'ek_test',expires_at:1234567890});
  assert.match(credential.headers.get('cache-control'),/no-store/);
  const failure=await handleSession(request(body,{'x-forwarded-for':'test-failure'}),env,async()=>Response.json({error:'private upstream text'},{status:401}));
  assert.equal(failure.status,502);assert.ok(!(await failure.text()).includes('private upstream text'));
});

test('phone has no telephone links or platform telephony integration; voice is registered as online-only',async()=>{
  const html=await readFile(new URL('../apps/emergency-call-simulator/index.html',import.meta.url),'utf8');
  assert.doesNotMatch(html,/href\s*=\s*["'](?:tel|sms|callto):/i);
  const manifest=JSON.parse(await readFile(new URL('../apps/apps.json',import.meta.url),'utf8'));
  assert.equal(manifest.find(a=>a.slug==='emergency-call-simulator').offlineCapable,false);
  const sw=await readFile(new URL('../offline/sw.js',import.meta.url),'utf8');
  assert.match(sw,/url.origin !== self.location.origin/);assert.match(sw,/url.pathname.includes\('\/api\/'\)/);
});
