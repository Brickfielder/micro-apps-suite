// DOM integration check. Media/network doubles exercise UI lifecycle; emergency-live.mjs tests the real provider separately.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const {JSDOM} = await import(process.env.JSDOM_MODULE || 'jsdom');
const app = new URL('../apps/emergency-call-simulator/',import.meta.url);
const dom = new JSDOM(await readFile(new URL('index.html',app),'utf8'),{url:'https://practice.example/apps/emergency-call-simulator/',pretendToBeVisual:true});
const {window}=dom;
for(const key of ['window','document','navigator','location'])Object.defineProperty(globalThis,key,{value:key==='window'?window:window[key],configurable:true});
window.HTMLMediaElement.prototype.play=async()=>{};
window.HTMLMediaElement.prototype.pause=()=>{};
window.HTMLElement.prototype.scrollIntoView=()=>{};
let denied=false, deferred=false, resolvePermission, requests=[], failProvider=false, latestTrack;
function track(){return {readyState:'live',enabled:true,stopped:false,stop(){this.stopped=true;this.readyState='ended';this.onended?.();}};}
function microphone(){latestTrack=track();return {getTracks:()=>[latestTrack],getAudioTracks:()=>[latestTrack]};}
Object.defineProperty(navigator,'mediaDevices',{value:{async getUserMedia(){if(denied)throw new DOMException('Denied','NotAllowedError');if(deferred)return new Promise(resolve=>{resolvePermission=resolve;});return microphone();}}});
Object.defineProperty(navigator,'onLine',{value:true,configurable:true});
class Peer {
  static latest;
  constructor(){Peer.latest=this;this.connectionState='new';}
  createDataChannel(){return this.channel={readyState:'open',sent:[],send(text){this.sent.push(JSON.parse(text));},close(){this.readyState='closed';this.onclose?.();}};}
  addTrack(){}
  async createOffer(){return {type:'offer',sdp:'test-offer'};}
  async setLocalDescription(){}
  async setRemoteDescription(){queueMicrotask(()=>this.channel.onmessage?.({data:JSON.stringify({type:'session.created'})}));}
  close(){this.connectionState='closed';}
}
globalThis.RTCPeerConnection=window.RTCPeerConnection=Peer;
globalThis.fetch=async(input,options={})=>{
  const url=String(input);
  if(url.startsWith('https://voice.example')){
    requests.push(JSON.parse(options.body));
    return failProvider?Response.json({error:'Test provider unavailable'},{status:503}):Response.json({value:'ek_test',expires_at:Math.floor(Date.now()/1000)+60});
  }
  if(url.startsWith('https://api.openai.com'))return new Response('test-sdp');
  return new Response(await readFile(new URL(url,app),'utf8'),{headers:{'Content-Type':'application/json'}});
};
const realInterval=globalThis.setInterval;globalThis.setInterval=(...args)=>realInterval(...args).unref();
await import(new URL('app.js',app));
const $=id=>document.getElementById(id);
const click=id=>$(id).click();
const change=(id,value)=>{$(id).value=value;$(id).dispatchEvent(new window.Event('change'));};
const wait=async check=>{for(let i=0;i<100;i++){if(check())return;await new Promise(resolve=>setTimeout(resolve,10));}throw Error('DOM state timed out');};
const emit=event=>Peer.latest.channel.onmessage?.({data:JSON.stringify(event)});
const tools=items=>emit({type:'response.done',response:{status:'completed',output:items.map(([name,args],i)=>({type:'function_call',name,call_id:'test-'+i,arguments:JSON.stringify(args)}))}});
const press=key=>$('keypad').querySelector(`[data-key="${key}"]`).click();
function setup(){change('endpoint','https://voice.example/api/emergency-session');$('consent').checked=true;$('consent').dispatchEvent(new window.Event('change'));}
setup();assert.equal($('scenario').options.length,5);assert.equal($('begin').disabled,false);
document.querySelector('[data-device="android"]').click();assert.ok($('phone').classList.contains('android'));
change('scenario','house-fire');assert.equal($('scenario-title').textContent,'A fire next door');
change('scenario','fall');click('begin');await wait(() => !$('phone-app').disabled);
assert.equal(latestTrack.enabled,false);click('phone-app');
press('9');press('1');press('1');click('call');assert.equal(requests.length,0);assert.match($('dial-error').textContent,/exactly 999/);
click('delete');click('delete');press('9');press('9');click('call');await wait(()=>!$('pause').disabled);
assert.equal(requests[0].stage,'operator');assert.equal(latestTrack.enabled,true);
click('pause');assert.equal(latestTrack.enabled,false);assert.equal($('pause').textContent,'Resume');
click('pause');assert.equal(latestTrack.enabled,true);assert.equal($('pause').textContent,'Pause');
click('mute');assert.equal(latestTrack.enabled,false);click('mute');assert.equal(latestTrack.enabled,true);
emit({type:'conversation.item.input_audio_transcription.completed',item_id:'service',transcript:'Ambulance, please.'});
tools([['select_service',{service:'ambulance'}]]);emit({type:'output_audio_buffer.stopped'});
await wait(()=>requests.length===2&&!$('pause').disabled);
assert.equal(requests[1].stage,'handler');assert.equal(requests[1].service,'ambulance');
const words='Pat has fallen. Eighteen Practice Lane, London. Pat is awake and breathing normally. The number is 07700 900123.';
emit({type:'conversation.item.input_audio_transcription.completed',item_id:'details',transcript:words});
tools([['observe_details',{details:[['location','Eighteen Practice Lane, London'],['incident','Pat has fallen'],['conscious','Pat is awake'],['breathing','breathing normally'],['callback','07700 900123']].map(([id,evidence])=>({id,evidence,status:'provided'}))}],['finish_practice',{}]]);
emit({type:'output_audio_buffer.stopped'});assert.equal($('review').hidden,false);assert.ok(latestTrack.stopped);
assert.match($('review-intro').textContent,/endpoint reached/);assert.equal($('settings-fields').disabled,true);
const reviewSelect=$('review-details').querySelector('select');reviewSelect.value='partial';reviewSelect.dispatchEvent(new window.Event('change'));
assert.match($('review-metrics').textContent,/4 \/ 5/);assert.equal($('export').disabled,true);
$('export-consent').checked=true;$('export-consent').dispatchEvent(new window.Event('change'));assert.equal($('export').disabled,false);
click('again');assert.equal($('settings-fields').disabled,false);assert.equal($('begin').disabled,false);
denied=true;click('begin');await wait(()=>!$('review').hidden);assert.match($('status').textContent,/not allowed/);denied=false;
click('again');deferred=true;click('begin');click('header-stop');const late=microphone();resolvePermission(late);await new Promise(resolve=>setTimeout(resolve,20));assert.ok(latestTrack.stopped);assert.equal($('review').hidden,false);deferred=false;
click('again');click('begin');await wait(()=>!$('phone-app').disabled);click('phone-app');press('9');press('9');press('9');failProvider=true;click('call');await wait(()=>!$('reconnect').hidden);assert.equal(latestTrack.enabled,false);assert.match($('status').textContent,/Test provider/);
click('real-emergency');assert.equal($('safety-alert').hidden,false);assert.ok(latestTrack.stopped);assert.equal($('review').hidden,true);
click('safety-reset');assert.equal($('orientation').hidden,false);
window.dispatchEvent(new window.Event('pagehide'));
console.log('DOM flow passed: phone styles, scenarios, local wrong numbers, handoff, pause/mute/stop, completion, review override, consent, permission denial, late permission cleanup, API error and safety reset.');
dom.window.close();
