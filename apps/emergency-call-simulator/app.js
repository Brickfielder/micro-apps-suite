import {newSession, transition, dial, recordDetails, completionReady, criteriaFor, summary, SERVICES} from './core.mjs';
import {RealtimeVoice} from './voice.mjs';
import {icon} from './icons.mjs';
import {registerServiceWorker} from '../../shared/shell/shell.js';

const $ = id => document.getElementById(id);
const audio = $('responder-audio');
let scenarios = [], scenario, session, stream, device = 'iphone', digits = '', endpoint = '', accessCode = '';
let presentedAt = performance.now(), run = 0, starting = false, pausedAt = null, muted = false;
let ticker, silenceTimer, finishTimer, nextAction, lastQuestionEnd = null, callerSpeaking = false, modelBusy = false;
let observationQueue = [], activeStage = 'operator', transcriptIds = new Set(), clarificationIds = new Set();
const voice = new RealtimeVoice(audio, handleEvent, voiceError);
const isRunning = () => session && !['ready', 'ended', 'safety'].includes(session.phase);
const livePhase = () => ['selecting', 'questioning', 'concluding'].includes(session?.phase);
const setStatus = (text, error = false) => {$('status').textContent = text; $('status').classList.toggle('error', error);};
const formatTime = seconds => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
function element(tag, text, className) {
  const el = document.createElement(tag); if (text !== undefined) el.textContent = text;
  if (className) el.className = className; return el;
}
function settings() {
  return {difficulty: $('difficulty').value, assistance: $('assistance').value,
    allowance: Number($('allowance').value), duration: Number($('duration').value),
    notes: $('notes').checked, repetition: $('repetition').checked, captions: $('captions').checked, device};
}
function phase(next) {
  transition(session, next);
  const calling = ['connecting', 'selecting', 'transferring', 'questioning', 'concluding'].includes(next);
  $('phone-home').hidden = next !== 'home' && !['ended', 'safety', 'error'].includes(next);
  $('phone-dialler').hidden = next !== 'dialler';
  $('phone-call').hidden = !calling;
  $('pause').disabled = !livePhase();
  $('repeat').disabled = next !== 'questioning' || !session.settings.repetition;
  $('hint').disabled = !['selecting', 'questioning'].includes(next) || session.settings.assistance === 'independent';
  $('call-stage').textContent = {connecting: 'Connecting…', selecting: 'Emergency operator', transferring: 'Transferring…', questioning: 'Connected', concluding: 'Finishing practice'}[next] || '';
  $('phone-app').disabled = next !== 'home' || !stream;
  $('header-stop').hidden = ['ready', 'ended', 'safety'].includes(next);
  $('reconnect').hidden = next !== 'error';
}
function lockSettings(locked) {
  $('settings-fields').disabled = locked;
  $('device-switch').querySelectorAll('button').forEach(button => {button.disabled = locked;});
}
function showScenario() {
  $('scenario-title').textContent = scenario.name;
  $('scenario-description').textContent = scenario.description;
  $('scenario-facts').replaceChildren();
  for (const [label, value] of scenario.initiallyKnown) $('scenario-facts').append(element('dt', label), element('dd', value));
  $('scenario-change').hidden = true;
  presentedAt = performance.now();
}
function phoneHome() {
  const apps = [['message', 'Messages'], ['calendar', 'Calendar'], ['photos', 'Photos'], ['camera', 'Camera'], ['maps', 'Maps'], ['clock', 'Clock'], ['mail', 'Mail'], ['settings', 'Settings']];
  for (const [name, label] of apps) {
    const button = element('button', undefined, `app-icon ${name}`); button.type = 'button'; button.disabled = true;
    button.setAttribute('aria-label', `${label}, unavailable in practice`);
    const art = element('span', undefined, 'icon-art'); art.innerHTML = icon(name);
    button.append(art, element('span', label)); $('app-grid').append(button);
  }
  document.querySelectorAll('[data-icon]').forEach(el => {el.innerHTML = icon(el.dataset.icon);});
  const letters = ['', '', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];
  for (const key of ['1','2','3','4','5','6','7','8','9','*','0','#']) {
    const button = element('button', key, 'key'); button.type = 'button'; button.dataset.key = key;
    button.setAttribute('aria-label', key === '*' ? 'Star' : key === '#' ? 'Hash' : key);
    button.append(element('small', key === '0' ? '+' : letters[Number(key)] || '')); $('keypad').append(button);
  }
}
function updateClock() {
  $('phone-clock').textContent = new Intl.DateTimeFormat('en-GB', {hour: 'numeric', minute: '2-digit'}).format(new Date());
  $('home-date').textContent = new Intl.DateTimeFormat('en-GB', {weekday: 'long', day: 'numeric', month: 'long'}).format(new Date());
}
function connectionEndpoint() {
  const value = $('endpoint').value.trim();
  const local = ['localhost', '127.0.0.1'].includes(location.hostname);
  if (!value && (local || location.hostname.endsWith('.vercel.app'))) return new URL('../../api/emergency-session', import.meta.url).href;
  if (!value) throw new Error('Open clinician settings → Voice connection and enter the hosted voice service endpoint.');
  const url = new URL(value);
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) || url.username || url.password || url.search || url.hash) throw new Error('Use a secure voice endpoint URL without credentials or query parameters.');
  return url.href;
}
async function begin() {
  if (starting || isRunning() || !$('consent').checked) return;
  if (!navigator.onLine) {setStatus('Voice practice needs an internet connection. Reconnect and begin again.', true); return;}
  try {endpoint = connectionEndpoint();} catch (error) {
    $('clinician-panel').open = true;
    document.querySelector('.connection-settings').open = true;
    setStatus(error.message, true); $('endpoint').focus(); return;
  }
  accessCode = $('access-code').value;
  if (!navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) {setStatus('This browser needs microphone and WebRTC support. Open the app in an up-to-date browser using HTTPS or localhost.', true); return;}
  starting = true; const generation = ++run;
  session = newSession(scenario, settings(), presentedAt);
  transcriptIds = new Set(); clarificationIds = new Set(); observationQueue = [];
  activeStage = 'operator'; muted = false; pausedAt = null; digits = ''; nextAction = null;
  lastQuestionEnd = null; callerSpeaking = false; modelBusy = false; $('pause').textContent = 'Pause';
  $('dialled').textContent = ''; $('dial-error').textContent = '';
  $('review').hidden = true; $('orientation').hidden = true; $('practice-controls').hidden = false;
  $('scenario-card').hidden = false; $('notes-hidden').hidden = true; $('safety-alert').hidden = true;
  $('caption-panel').hidden = !session.settings.captions; $('captions-output').replaceChildren();
  $('mute').setAttribute('aria-pressed', 'false'); $('speaker').setAttribute('aria-pressed', 'false');
  audio.volume = 0.65; audio.muted = false;
  lockSettings(true); $('clinician-panel').open = false; phase('home');
  setStatus('Allow microphone access to begin. Nothing is being sent to the voice service.');
  try {
    const acquired = await navigator.mediaDevices.getUserMedia({audio: {echoCancellation: true, noiseSuppression: true, autoGainControl: true}});
    if (generation !== run) {acquired.getTracks().forEach(track => track.stop()); return;}
    stream = acquired;
    for (const track of stream.getTracks()) {
      track.enabled = false;
      track.onended = () => {if (isRunning()) voiceError(new Error('The microphone stopped. Reconnect the microphone and begin a new exercise.'));};
    }
    $('phone-app').disabled = false; $('phone-app').focus();
    $('mic-status').textContent = 'Microphone ready · not transmitting';
    $('step-hint').textContent = 'Open the Phone app, enter 999, then press the green call button.';
    $('phone-guidance').textContent = 'Open Phone to make your practice call.';
    setStatus('Ready. Use the phone as you normally would.');
  } catch (error) {
    if (generation !== run) return;
    session.reason = 'microphone_error'; finish('Microphone unavailable', false);
    setStatus(error.name === 'NotAllowedError' ? 'Microphone access was not allowed. Enable it in your browser site settings, then choose Practise again.' : 'No working microphone was found. Check your device, then choose Practise again.', true);
  } finally {if (generation === run) starting = false;}
}
function addDigit(key) {
  if (session?.phase !== 'dialler' || !/^[0-9*#]$/.test(key) || digits.length >= 15) return;
  digits += key; $('dialled').textContent = digits; $('dial-error').textContent = ''; keypadSound(key);
}
let soundContext;
function keypadSound(key) {
  if (!$('sounds').checked) return;
  try {
    soundContext ||= new AudioContext(); soundContext.resume().catch(() => {});
    const keys = ['1','2','3','4','5','6','7','8','9','*','0','#']; const n = keys.indexOf(key);
    const gain = soundContext.createGain(); gain.gain.value = 0.025; gain.connect(soundContext.destination);
    for (const frequency of [[697,770,852,941][Math.floor(n/3)], [1209,1336,1477][n%3]]) {
      const oscillator = soundContext.createOscillator(); oscillator.frequency.value = frequency;
      oscillator.connect(gain); oscillator.start(); oscillator.stop(soundContext.currentTime + 0.07);
    }
  } catch { /* Sound effects are optional; call audio has its own error handling. */ }
}
async function call() {
  if (session?.phase !== 'dialler') return;
  if (!dial(session, digits)) {$('dial-error').textContent = 'For this practice, enter exactly 999. No call was made.'; return;}
  phaseViewAfterDial();
  if (!session.settings.notes) {$('scenario-card').hidden = true; $('notes-hidden').hidden = false;}
  $('call-duration').textContent = '00:00';
  ticker = setInterval(tick, 1000);
  await connectVoice();
}
function phaseViewAfterDial() {
  $('phone-dialler').hidden = true; $('phone-home').hidden = true; $('phone-call').hidden = false;
  $('call-stage').textContent = 'Connecting…'; $('call-name').textContent = 'Emergency services';
  $('step-hint').textContent = 'Wait for the emergency operator.';
}
function callerContext() {
  return JSON.stringify({
    established: session.details,
    callerConversation: session.transcript.map(t => ({role: t.role, text: t.text.slice(0, 600)})).slice(-30),
    serviceChoices: session.serviceChoices,
  }).slice(0,12000);
}
async function connectVoice() {
  const generation = run;
  setStatus(activeStage === 'operator' ? 'Connecting to the practice emergency operator…' : 'Connecting to the practice service handler…');
  $('mic-status').textContent = 'Connecting · microphone not transmitting';
  stream?.getTracks().forEach(track => {track.enabled = false;});
  try {
    if (!stream?.getAudioTracks().some(track => track.readyState === 'live')) throw new Error('The microphone is no longer available. Stop and begin a new exercise.');
    await voice.connect({endpoint, accessCode, stream, body: {scenarioId: scenario.id, stage: activeStage,
      ...(activeStage === 'handler' ? {service: session.serviceChoices.at(-1)} : {}), settings: session.settings, context: callerContext()}});
    if (generation !== run || !isRunning()) {voice.close(); return;}
    phase(activeStage === 'operator' ? 'selecting' : 'questioning');
    stream.getTracks().forEach(track => {track.enabled = !muted;});
    $('mic-status').textContent = muted ? 'Microphone muted' : 'Microphone on · connected to OpenAI';
    $('call-name').textContent = activeStage === 'operator' ? 'Emergency operator' : `${session.serviceChoices.at(-1)[0].toUpperCase()}${session.serviceChoices.at(-1).slice(1)} call handler`;
    $('step-hint').textContent = 'Listen and speak in your own words. Take the time you need.';
    $('phone-guidance').textContent = 'Speak naturally. You can ask the responder to repeat.';
    setStatus('Practice call connected.');
    voice.respond(activeStage === 'operator' ? 'Open with exactly: Emergency, which service? Then wait for the caller.' : 'You are now the service call handler. Introduce your service briefly and ask the first focused question, respecting caller history. Do not claim dispatch.');
  } catch (error) {if (generation === run && error.name !== 'AbortError') voiceError(error);}
}
function voiceError(error) {
  if (!isRunning() || session.phase === 'error') return;
  voice.close(); clearTimeout(silenceTimer); clearTimeout(finishTimer); nextAction = null;
  stream?.getTracks().forEach(track => {track.enabled = false;});
  if (pausedAt !== null) {session.pausedMs += performance.now() - pausedAt; pausedAt = null;}
  $('pause').textContent = 'Pause'; $('phone').classList.remove('paused');
  phase('error'); $('mic-status').textContent = 'Microphone not transmitting · voice disconnected';
  $('step-hint').textContent = 'Reconnect to continue, or stop to review what you practised.';
  setStatus(error.message || 'Voice connection interrupted. Reconnect or stop the exercise.', true);
  modelBusy = false; callerSpeaking = false; lastQuestionEnd = null;
}
function addTranscript(role, text, id) {
  if (!text?.trim() || transcriptIds.has(id)) return;
  transcriptIds.add(id); session.transcript.push({role, text: text.trim(), at: performance.now(), id});
  const line = element('p'); line.append(element('strong', role === 'caller' ? 'You · ' : 'Call handler · '), document.createTextNode(text));
  $('captions-output').append(line); $('captions-output').scrollTop = $('captions-output').scrollHeight;
  if (role === 'caller') {
    if (/\b(repeat|say (that|it) again|didn.t (hear|understand)|what do you mean|pardon)\b/i.test(text) && !clarificationIds.has(id)) {
      clarificationIds.add(id); session.clarifications.push({at: performance.now(), text, source: 'Transcript estimate'});
    }
    for (const queued of observationQueue) recordDetails(session, scenario, queued);
    observationQueue = [];
    const turns = session.transcript.filter(t => t.role === 'caller').length;
    for (const change of scenario.changes) {
      if (turns >= change.afterCallerTurns && !session.changes.some(c => c.id === change.id)) {
        session.changes.push({id: change.id, at: performance.now(), message: change.message});
        $('scenario-change').textContent = change.message; $('scenario-change').hidden = false;
        if (!session.settings.notes) {
          setStatus(change.message);
          // Changes are caller information: never send their content to the responder before the caller says it.
          $('scenario-card').hidden = false; $('scenario-facts').hidden = true; $('notes-hidden').hidden = true;
        }
      }
    }
  }
}
function handleEvent(event) {
  if (!isRunning()) return;
  switch (event.type) {
    case 'app.playback_blocked': $('enable-audio').hidden = false; setStatus('Press Play responder audio to hear the call.', true); break;
    case 'app.network_unstable': setStatus('The network is unstable. Waiting briefly for the voice connection…', true); break;
    case 'app.network_connected': if (livePhase()) setStatus('Practice call connected.'); break;
    case 'response.created': modelBusy = true; break;
    case 'input_audio_buffer.speech_started':
      callerSpeaking = true; clearTimeout(silenceTimer);
      if (lastQuestionEnd !== null && pausedAt === null) {
        session.latencies.push({seconds: Math.max(0, (performance.now() - lastQuestionEnd) / 1000), source: 'Estimated from audio event receipt timestamps'});
        lastQuestionEnd = null;
      }
      break;
    case 'input_audio_buffer.speech_stopped': callerSpeaking = false; break;
    case 'conversation.item.input_audio_transcription.completed':
      addTranscript('caller', event.transcript, event.item_id); break;
    case 'conversation.item.input_audio_transcription.failed':
      setStatus('Some speech could not be transcribed. Continue speaking; a clinician can review incomplete observations.', true); break;
    case 'response.output_audio_transcript.done':
      addTranscript('handler', event.transcript, `${event.item_id}-handler`); break;
    case 'output_audio_buffer.started': $('voice-bars').classList.add('speaking'); break;
    case 'output_audio_buffer.cleared': $('voice-bars').classList.remove('speaking'); lastQuestionEnd = null; break;
    case 'output_audio_buffer.stopped':
      $('voice-bars').classList.remove('speaking');
      if (nextAction) {const action = nextAction; nextAction = null; clearTimeout(finishTimer); action();}
      else if (livePhase() && pausedAt === null) {lastQuestionEnd = performance.now(); armSilenceTimer();}
      break;
    case 'response.done': {
      modelBusy = false;
      if (event.response?.status === 'failed') {voiceError(new Error('The responder could not complete its turn. Reconnect to continue.')); break;}
      const calls = (event.response?.output || []).filter(item => item.type === 'function_call');
      if (calls.length) handleTools(calls);
      break;
    }
    case 'error':
      if (['response_cancel_not_active', 'conversation_already_has_active_response'].includes(event.error?.code)) break;
      voiceError(new Error('The voice provider reported a session error. Reconnect to continue.')); break;
  }
}
function handleTools(calls) {
  let directive, transfer;
  for (const call of calls) {
    let args;
    try {args = JSON.parse(call.arguments || '{}');} catch {voice.toolResult(call.call_id, {accepted: false, reason: 'Invalid arguments'}); continue;}
    let result = {accepted: true};
    if (call.name === 'real_emergency') {safetyStop(); return;}
    else if (call.name === 'select_service') {
      if (!SERVICES.includes(args.service) || !['selecting','questioning'].includes(session.phase)) result = {accepted: false, reason: 'Transfer is unavailable in this stage'};
      else if (session.serviceChoices.length >= 5) {finish('Transfer limit reached; review with your clinician.', false); return;}
      else {session.serviceChoices.push(args.service); transfer = args.service;}
    } else if (call.name === 'observe_details') {
      const observations = Array.isArray(args.details) ? args.details.slice(0, 20) : [];
      const accepted = recordDetails(session, scenario, observations);
      if (accepted < observations.length) observationQueue.push(observations);
      result = {accepted, outstanding: criteriaFor(scenario, session.settings.difficulty).filter(c => session.details[c.id]?.status !== 'provided').map(c => c.id)};
    } else if (call.name === 'log_assistance') {
      if (['repeat','simplify','hint'].includes(args.kind)) session.prompts.push({at: performance.now(), kind: args.kind, description: String(args.description || '').slice(0,300), source: 'AI reported'});
      else result = {accepted: false};
    } else if (call.name === 'finish_practice') {
      if (session.phase !== 'questioning' || !completionReady(session, scenario)) {
        result = {accepted: false, outstanding: criteriaFor(scenario, session.settings.difficulty).filter(c => session.details[c.id]?.status !== 'provided').map(c => c.label), reason: 'Required information is not yet established, or the service needs correction.'};
      } else {
        phase('concluding'); session.completionObserved = true;
        directive = "Say only: Thank you. I have the information I need. We can finish the practice call here. Do not imply real dispatch.";
        nextAction = () => finish('Practice endpoint reached.', true);
        finishTimer = setTimeout(() => finish('Closing audio was not confirmed; review completion with your clinician.', false), 20000);
      }
    } else result = {accepted: false, reason: 'Unsupported tool'};
    voice.toolResult(call.call_id, result);
  }
  if (transfer) {
    phase('transferring'); clearTimeout(silenceTimer);
    directive = `Say only: Connecting you to ${transfer}. Do not ask another question.`;
    nextAction = async () => {
      if (!isRunning()) return;
      activeStage = 'handler'; voice.close(); await connectVoice();
    };
    finishTimer = setTimeout(() => voiceError(new Error('The transfer was interrupted. Reconnect to continue.')), 20000);
  }
  voice.respond(directive);
}
function armSilenceTimer() {
  clearTimeout(silenceTimer);
  silenceTimer = setTimeout(() => {
    if (!livePhase() || callerSpeaking || modelBusy || pausedAt !== null) return;
    if (session.settings.assistance === 'guided') {
      session.prompts.push({at: performance.now(), kind: 'silence', description: 'Gentle check-in after configured response allowance', source: 'App event'});
      voice.respond("The caller has been quiet for the configured allowance. Say only 'Take your time. Would you like me to repeat the question?' Do not penalise the caller or assume inability.");
    } else setStatus('Take your time. You can ask for repetition or pause the exercise.');
  }, session.settings.allowance * 1000);
}
function tick() {
  if (!isRunning() || session.startedAt === null) return;
  const elapsed = performance.now() - session.startedAt;
  $('call-duration').textContent = formatTime(Math.max(0,(elapsed - session.pausedMs - (pausedAt === null ? 0 : performance.now()-pausedAt))/1000));
  if (elapsed >= session.settings.duration * 1000) finish('The configured practice time has ended. You can review or practise again.', false);
}
function togglePause() {
  if (!livePhase()) return;
  if (pausedAt === null) {
    pausedAt = performance.now(); voice.pause(); audio.muted = true;
    stream?.getTracks().forEach(track => {track.enabled = false;});
    clearTimeout(silenceTimer); $('pause').textContent = 'Resume';
    $('mic-status').textContent = 'Paused · microphone not transmitting'; $('phone').classList.add('paused');
    $('repeat').disabled = true; $('hint').disabled = true; lastQuestionEnd = null;
    setStatus('Exercise paused. The maximum call duration still applies.');
  } else {
    session.pausedMs += performance.now() - pausedAt; pausedAt = null; audio.muted = false;
    stream?.getTracks().forEach(track => {track.enabled = !muted;});
    $('pause').textContent = 'Pause'; $('phone').classList.remove('paused');
    $('repeat').disabled = session.phase !== 'questioning' || !session.settings.repetition;
    $('hint').disabled = session.settings.assistance === 'independent';
    $('mic-status').textContent = muted ? 'Microphone muted' : 'Microphone on · connected to OpenAI';
    setStatus('Practice resumed.');
    if (session.phase === 'concluding') {finish('Exercise ended after pausing the closing statement.', false); return;}
    nextAction = null;
    voice.respond('The caller resumed after a pause. Briefly repeat the last unanswered question without adding new facts or dispatch claims.');
  }
}
function finish(reason, completed = false) {
  if (!session || ['ended', 'safety'].includes(session.phase)) return;
  ++run; starting = false; voice.close();
  clearInterval(ticker); clearTimeout(silenceTimer); clearTimeout(finishTimer); nextAction = null;
  if (pausedAt !== null) {session.pausedMs += performance.now() - pausedAt; pausedAt = null;}
  stream?.getTracks().forEach(track => {track.onended = null; track.stop();}); stream = null;
  session.endedAt = performance.now(); session.reason = reason; session.completed = completed;
  phase('ended'); lockSettings(true); $('practice-controls').hidden = true;
  $('scenario-card').hidden = false; $('scenario-facts').hidden = false; $('notes-hidden').hidden = true;
  $('phone').classList.remove('paused'); $('voice-bars').classList.remove('speaking'); $('enable-audio').hidden = true;
  $('phone-guidance').textContent = 'Practice call ended. Your review is below.';
  setStatus('Practice ended. No emergency services were contacted.');
  renderReview(); $('review').focus();
}
function safetyStop() {
  if (session && isRunning()) finish('Stopped for a possible real emergency.', false);
  if (!session && scenario) session = newSession(scenario, settings());
  if (session && session.phase !== 'safety') transition(session, 'safety');
  $('safety-alert').hidden = false; $('orientation').hidden = true; $('practice-controls').hidden = true;
  $('review').hidden = true; $('phone-app').disabled = true;
  setStatus('Exercise stopped. Use a real phone to call 999 for a real emergency.', true);
  $('safety-alert').scrollIntoView({block:'center'});
}
function renderReview() {
  const result = summary(session, scenario);
  $('review').hidden = false;
  $('review-intro').textContent = `${session.reason} ${session.completed ? 'You reached the intended practice endpoint.' : 'You can review what was communicated, even though the full endpoint was not reached.'}`;
  $('review-metrics').replaceChildren();
  const metrics = [
    [session.dialAttempts.length ? (result.dialling.firstAttemptCorrect ? '999 first time' : `${session.dialAttempts.length} attempts`) : 'Not attempted', 'Dialling'],
    [result.initiationSeconds === null ? 'Not started' : `${Math.round(result.initiationSeconds)}s`, 'Time from scenario to call'],
    [result.serviceChoices.length ? (result.correctService ? 'Appropriate' : 'Review choice') : 'Not selected', 'Emergency service'],
    [`${result.completeness.provided} / ${result.completeness.total}`, 'Details observed · provisional'],
  ];
  for (const [value,label] of metrics) {
    const el = element('div',undefined,'metric'); el.append(element('strong',value),element('span',label)); $('review-metrics').append(el);
  }
  $('review-details').replaceChildren();
  for (const detail of result.details) {
    const row = element('div',undefined,'observation');
    const text = element('div'); text.append(element('strong', detail.label), element('p', detail.evidence ? `“${detail.evidence}”` : 'No transcript evidence recorded.'), element('small', detail.source));
    const label = element('label', 'Clinician review'); const select = document.createElement('select'); select.setAttribute('aria-label', `Review ${detail.label}`);
    for (const [value,title] of [['provided','Communicated'],['partial','Partial / unclear'],['unknown','Unknown'],['not_observed','Not observed']]) {
      const option = element('option',title); option.value = value; option.selected = detail.status === value; select.append(option);
    }
    select.onchange = () => {session.overrides[detail.id] = select.value; updateReviewCounts(); text.querySelector('small').textContent = 'Clinician override';};
    label.append(select); row.append(text,label); $('review-details').append(row);
  }
  const mean = session.latencies.length ? (session.latencies.reduce((a,b)=>a+b.seconds,0)/session.latencies.length).toFixed(1) : null;
  $('review-next').textContent = `${session.clarifications.length} clarification request(s) identified from transcript; ${session.prompts.length} assistance event(s) recorded. ${mean ? `Estimated mean response latency ${mean}s, across ${session.latencies.length} turn(s).` : 'No response latency estimate available.'} Take the time you need; response speed is not graded. A useful next step is to practise communicating location and the main event in your own words.`;
  $('transcript-review').replaceChildren();
  for (const item of session.transcript) {
    const p = element('p'); p.append(element('strong', item.role === 'caller' ? 'You: ' : 'Call handler: '),document.createTextNode(item.text)); $('transcript-review').append(p);
  }
  if (!session.transcript.length) $('transcript-review').append(element('p','No transcript was received.'));
  $('prompt-review').replaceChildren(...session.prompts.map(p => element('li',`${p.kind}: ${p.description} (${p.source})`)));
  for (const item of session.clarifications) $('prompt-review').append(element('li', `Clarification at ${formatTime(Math.max(0,(item.at-session.startedAt)/1000))}: “${item.text}” (transcript estimate)`));
  $('communication-rating').value = session.ratings.communication; $('comprehension-rating').value = session.ratings.comprehension;
  $('export-consent').checked = false; $('export-transcript').checked = false; $('export').disabled = true;
}
function updateReviewCounts() {
  const r = summary(session,scenario);
  $('review-metrics').lastElementChild.querySelector('strong').textContent = `${r.completeness.provided} / ${r.completeness.total}`;
}
function reset() {
  ++run; starting = false; voice.close(); clearInterval(ticker); clearTimeout(silenceTimer); clearTimeout(finishTimer);
  stream?.getTracks().forEach(track=>track.stop()); stream = null; session = null;
  lockSettings(false); $('orientation').hidden = false; $('practice-controls').hidden = true; $('review').hidden = true;
  $('caption-panel').hidden = true; $('safety-alert').hidden = true; $('scenario-card').hidden = false; $('scenario-facts').hidden = false;
  $('phone-home').hidden = false; $('phone-dialler').hidden = true; $('phone-call').hidden = true; $('notes-hidden').hidden = true;
  $('phone-app').disabled = true; $('phone-guidance').textContent = 'Choose the phone you use. Begin when you are ready.';
  $('begin').disabled = !$('consent').checked; showScenario();
  setStatus('Ready when you are.'); $('begin').focus();
}

$('consent').onchange = () => {$('begin').disabled = !scenario || !$('consent').checked;};
$('begin').onclick = begin;
$('scenario').onchange = () => {scenario = scenarios.find(s => s.id === $('scenario').value); $('difficulty').value = scenario.difficulty; showScenario();};
$('device-switch').querySelectorAll('button').forEach(button => button.onclick = () => {
  if (isRunning()) return;
  device = button.dataset.device; $('phone').className = `phone ${device}`;
  $('device-switch').querySelectorAll('button').forEach(b => {b.classList.toggle('selected', b === button); b.setAttribute('aria-pressed', String(b === button));});
});
$('phone-app').onclick = () => {if (session?.phase === 'home' && stream) {phase('dialler'); $('keypad').querySelector('button').focus();}};
$('back-home').onclick = () => {if (session?.phase === 'dialler') phase('home');};
$('keypad').onclick = event => {const button = event.target.closest('[data-key]'); if (button) addDigit(button.dataset.key);};
$('delete').onclick = () => {if (session?.phase === 'dialler') {digits = digits.slice(0,-1); $('dialled').textContent = digits;}};
$('phone').onkeydown = event => {
  if (session?.phase !== 'dialler' || event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
  if (/^[0-9*#]$/.test(event.key)) {event.preventDefault();addDigit(event.key);}
  if (event.key === 'Backspace') {event.preventDefault(); $('delete').click();}
};
$('call').onclick = call; $('end-call').onclick = () => finish('You ended the call.', false);
$('stop').onclick = () => finish('You stopped the exercise.', false);
$('header-stop').onclick = () => finish('You stopped the exercise.', false);
$('pause').onclick = togglePause;
$('mute').onclick = () => {
  if (!livePhase() || pausedAt !== null) return;
  muted = !muted; $('mute').setAttribute('aria-pressed',String(muted));
  stream?.getTracks().forEach(track => {track.enabled = !muted;});
  $('mic-status').textContent = muted ? 'Microphone muted' : 'Microphone on · connected to OpenAI';
};
$('speaker').onclick = () => {const speaker = $('speaker').getAttribute('aria-pressed') !== 'true'; $('speaker').setAttribute('aria-pressed',String(speaker)); audio.volume = speaker ? 1 : 0.65; setStatus('Responder volume changed. Your browser controls the audio output device.');};
$('repeat').onclick = () => {
  if (session?.phase !== 'questioning' || !session.settings.repetition || pausedAt !== null || modelBusy) return;
  session.prompts.push({at:performance.now(),kind:'repeat',description:'Requested with the repeat button',source:'App event'});
  voice.respond('The caller has requested repetition. Repeat or simplify your last unanswered question. Do not introduce new facts.');
};
$('hint').onclick = () => {
  if (!livePhase() || session.settings.assistance === 'independent' || pausedAt !== null || modelBusy) return;
  session.prompts.push({at:performance.now(),kind:'hint',description:'Requested with the prompt button',source:'App event'});
  voice.respond('The caller requested one short helpful prompt about the current question. Help them understand what kind of information to give, without supplying hidden answers. No medical or physical instructions.');
};
$('reconnect').onclick = async () => {if (session?.phase === 'error') {phase('connecting'); await connectVoice();}};
$('enable-audio').onclick = async () => {try {await audio.play(); $('enable-audio').hidden = true; setStatus('Responder audio enabled.');} catch {setStatus('Audio playback is blocked. Check your browser audio settings.',true);}};
$('real-emergency').onclick = safetyStop;
$('safety-reset').onclick = reset;
$('communication-rating').onchange = () => {session.ratings.communication = $('communication-rating').value;};
$('comprehension-rating').onchange = () => {session.ratings.comprehension = $('comprehension-rating').value;};
$('export-consent').onchange = () => {$('export').disabled = !$('export-consent').checked;};
$('export').onclick = () => {
  if (!$('export-consent').checked || !session) return;
  const data = {...summary(session,scenario), exportedAt: new Date().toISOString()};
  if ($('export-transcript').checked) data.transcript = session.transcript;
  const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
  const link = element('a'); link.href = url; link.download = '999-practice-results.json'; document.body.append(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
};
$('again').onclick = reset;
window.addEventListener('pagehide', () => {++run;voice.close();stream?.getTracks().forEach(t=>t.stop());clearInterval(ticker);clearTimeout(silenceTimer);clearTimeout(finishTimer);});
window.addEventListener('offline', () => {if (isRunning()) voiceError(new Error('You are offline. Reconnect to the internet before resuming voice practice.'));});

phoneHome(); updateClock(); setInterval(updateClock,60000);
try {
  const indexResponse = await fetch('./scenarios/index.json'); if (!indexResponse.ok) throw new Error('Scenario list unavailable');
  const ids = await indexResponse.json();
  scenarios = await Promise.all(ids.map(async id => {const response = await fetch(`./scenarios/${id}.json`);if (!response.ok) throw new Error('Scenario unavailable');return response.json();}));
  for (const s of scenarios) {const option = element('option',s.name);option.value=s.id;$('scenario').append(option);}
  scenario = scenarios[0]; $('difficulty').value = scenario.difficulty; showScenario();
  const configResponse = await fetch('./config.json');
  if (configResponse.ok) {const config = await configResponse.json();$('endpoint').value = config.sessionEndpoint || '';}
  $('begin').disabled = !$('consent').checked;
  setStatus('Choose your phone and read the fictional scenario.');
  registerServiceWorker();
} catch {setStatus('The practice scenarios could not load. Check your internet connection and reload the page.',true);}
