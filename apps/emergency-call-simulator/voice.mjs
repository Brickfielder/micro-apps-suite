export class RealtimeVoice {
  constructor(audio, onEvent, onError) {
    Object.assign(this, {audio, onEvent, onError, generation: 0});
  }
  async connect({endpoint, accessCode, body, stream}) {
    this.close();
    const generation = this.generation;
    const abort = new AbortController();
    this.abort = abort;
    const pc = new RTCPeerConnection();
    this.pc = pc;
    const current = () => generation === this.generation;
    pc.ontrack = event => {
      if (!current()) return;
      this.audio.srcObject = new MediaStream([event.track]);
      this.audio.play().catch(() => this.onEvent({type: 'app.playback_blocked'}));
    };
    for (const track of stream.getAudioTracks()) pc.addTrack(track, stream);
    const dc = pc.createDataChannel('oai-events');
    this.dc = dc;
    let markReady;
    const ready = new Promise(resolve => {markReady = resolve;});
    dc.onmessage = message => {
      if (!current()) return;
      let event;
      try {event = JSON.parse(message.data);} catch {return;}
      if (event.type === 'session.created') markReady();
      this.onEvent(event);
    };
    dc.onclose = () => {if (current()) this.onError(new Error('The voice connection closed. Your review is still available.'));};
    pc.onconnectionstatechange = () => {
      if (!current()) return;
      clearTimeout(this.disconnectTimer);
      if (pc.connectionState === 'failed') this.onError(new Error('The voice connection failed. Check your internet connection.'));
      else if (pc.connectionState === 'disconnected') {
        this.onEvent({type: 'app.network_unstable'});
        this.disconnectTimer = setTimeout(() => {if (current()) this.onError(new Error('The voice connection was lost.'));}, 8000);
      } else if (pc.connectionState === 'connected') this.onEvent({type: 'app.network_connected'});
    };
    try {
      const offer = await pc.createOffer();
      if (!current()) throw new DOMException('Stopped', 'AbortError');
      await pc.setLocalDescription(offer);
      const tokenResponse = await fetch(endpoint, {
        method: 'POST', headers: {'Content-Type': 'application/json', ...(accessCode ? {Authorization: `Bearer ${accessCode}`} : {})},
        body: JSON.stringify(body), cache: 'no-store', credentials: 'omit',
        signal: AbortSignal.any([abort.signal, AbortSignal.timeout(20000)]),
      });
      const token = await tokenResponse.json().catch(() => ({}));
      if (!tokenResponse.ok) throw new Error(token.error || 'The voice service could not start this call.');
      if (!current()) throw new DOMException('Stopped', 'AbortError');
      if (typeof token.value !== 'string' || token.expires_at * 1000 <= Date.now()) throw new Error('The voice credential expired. Reconnect to try again.');
      const response = await fetch('https://api.openai.com/v1/realtime/calls', {
        method: 'POST', body: offer.sdp,
        headers: {Authorization: `Bearer ${token.value}`, 'Content-Type': 'application/sdp'},
        signal: AbortSignal.any([abort.signal, AbortSignal.timeout(20000)]),
      });
      if (!response.ok) throw new Error('The voice connection could not be established. Check model access or reconnect.');
      const sdp = await response.text();
      if (!current()) throw new DOMException('Stopped', 'AbortError');
      await pc.setRemoteDescription({type: 'answer', sdp});
      let timer;
      try {
        await Promise.race([ready, new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error('The voice connection timed out. Check your network and reconnect.')), 20000);
          abort.signal.addEventListener('abort', () => reject(new DOMException('Stopped', 'AbortError')), {once: true});
        })]);
      } finally {clearTimeout(timer);}
      if (!current()) throw new DOMException('Stopped', 'AbortError');
    } catch (error) {
      if (current()) this.close();
      throw error;
    }
  }
  send(event) {
    if (this.dc?.readyState !== 'open') return false;
    this.dc.send(JSON.stringify(event));
    return true;
  }
  respond(instructions) {
    if (instructions) this.send({type: 'conversation.item.create', item: {type: 'message', role: 'system',
      content: [{type: 'input_text', text: `App control cue (session safety instructions remain in force): ${instructions}`} ]}});
    return this.send({type: 'response.create'});
  }
  toolResult(callId, result) {
    this.send({type: 'conversation.item.create', item: {type: 'function_call_output', call_id: callId, output: JSON.stringify(result)}});
  }
  pause() {
    this.send({type: 'response.cancel'});
    this.send({type: 'output_audio_buffer.clear'});
    this.send({type: 'input_audio_buffer.clear'});
  }
  close() {
    this.generation++;
    this.abort?.abort();
    clearTimeout(this.disconnectTimer);
    if (this.dc) {this.dc.onclose = null; this.dc.onmessage = null; this.dc.close();}
    if (this.pc) {this.pc.onconnectionstatechange = null; this.pc.ontrack = null; this.pc.close();}
    this.audio.pause(); this.audio.srcObject = null;
    this.pc = null; this.dc = null;
  }
}
