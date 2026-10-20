# Emergency Call Simulator — 999 Practice

A vanilla HTML/CSS/JavaScript communication-practice application for Micro Apps Suite. Two phone styles, a real OpenAI Realtime speech connection, separate operator/service voices, five fictional JSON scenarios, clinician settings, and editable descriptive observations.

**Development version: clinician review and organisational information-governance review are outstanding.** This is not an emergency service, medical advice tool, validated assessment, or substitute for practical first-aid teaching. No first-aid protocol is enabled, and no scenario is claimed to be clinician-approved. No telephone links, external dialler, SIP or telephony integration exists. Only exact `999` starts a voice session.

## Run locally

Use Node.js 22.6 or newer. No npm dependencies or build step are required.

1. Put `OPENAI_API_KEY` in the ignored repository-root `.env.local`. Use the secure OpenAI Developers setup flow; never put a standard API key into the clinician panel or a browser file.
2. From the repository root run:

   ```sh
   node scripts/emergency-dev-server.mjs
   ```

3. Open `http://localhost:8080/apps/emergency-call-simulator/`.
4. Select a phone, read the fictional scenario, accept the practice/audio notice, and choose **Begin practice**. Open Phone, enter 999 and press the green call button.

The development server binds to loopback, rejects unexpected Host headers and blocks hidden files, private backend source and path escapes. Do not serve the repository using a generic static server while `.env.local` is present: some static servers expose dotfiles. Microphone access requires HTTPS or localhost. Microphone permission is requested only after Begin practice. Its track remains disabled until the voice connection is established.

## Hosting: GitHub Pages + Vercel

The frontend retains relative paths and is registered in `apps/apps.json`. GitHub Pages hosts the frontend, not the secret-bearing function. Add a Vercel project with this repository root, framework **Other**, no build/install command, Node.js 22 or newer. `vercel.json` includes the server function and scenario JSON files. Standard Web Handler export is used; no framework is required.

Configure these server-side Vercel environment variables for the intended environment:

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Dedicated project API key; keep out of Git and frontend files. |
| `OPENAI_REALTIME_MODEL` | Optional; defaults to the documented `gpt-realtime-2.1`. |
| `SESSION_ACCESS_CODE` | Required for hosting; a long random clinician session code, distinct from the API key. |
| `ALLOWED_ORIGINS` | Comma-separated exact origins, e.g. `https://brickfielder.github.io`; no path or wildcard. Add a specific preview origin when testing. |
| `UPSTASH_REDIS_REST_URL` | Shared Redis REST endpoint for atomic request limits. |
| `UPSTASH_REDIS_REST_TOKEN` | Redis credential, server-side only. |

Hosted session creation fails closed without the access code or shared limiter. `LOCAL_DEVELOPMENT=true` is for the loopback development server only; Vercel ignores the local bypass. Do not add it to hosted configuration.

Set `apps/emergency-call-simulator/config.json` → `sessionEndpoint` to the hosted `https://…/api/emergency-session` URL. Alternatively enter it in clinician settings for that visit. On localhost the same-origin development endpoint is automatic. The access code stays in memory. CORS origins restrict browser use; the access code authenticates session creation. A shared clinician code is a small supervised-pilot access mechanism; an organisation should replace it with its maintained identity system for broad rollout.

Keep deployment protection enabled during development. A protected frontend preview needs a signed-in Vercel session. A separate session endpoint used cross-origin by GitHub Pages must be accessible to the frontend and protected by its access code and rate limits. Do not disable project protection merely to bypass a preview test failure; configure the production API route deliberately at release.

The endpoint mints a 60-second client secret via `POST /v1/realtime/client_secrets`. The browser uses it to establish a WebRTC call at `POST /v1/realtime/calls`. The standard key never reaches the browser. No beta header is used. A new peer connection and session changes `marin` (operator) to `cedar` (handler), because an existing session cannot change voice after speaking. Only caller-provided context crosses the handoff, not the scenario answer card.

### Rate limits and cost controls

Atomic Redis counters allow 12 session-creation requests per caller IP hash per hour and 100 globally per day, including failed attempts. Each handoff/reconnect is another request. Redis keys expire; raw IP addresses are not stored by this application. Local development uses process-memory limits only. Provider/network errors do not trigger automatic paid retries.

Model responses are limited to 700 output tokens; UI call duration is at most 15 minutes including pauses. The browser closes media when stopped, expired, failed or unloaded. **UI timers and token-mint limits are not a hard provider spending cap**: a modified client can reuse an unexpired credential/change allowed session settings. Use a dedicated project, provider rate limits and billing alerts, supervise pilots, and add trusted server-side session control before opening access to untrusted users. Confirm the current provider's enforceable spend controls rather than treating a budget alert as a hard cap. Audio generation already in flight can incur usage before disconnect.

Keys created with an expiry must be rotated before that date. The key provisioned for this implementation has a 30-day lifetime; its value is never included in source or this documentation.

## Scenarios and responder boundaries

`scenarios/index.json` selects five separate JSON files: fall, sudden chest pain, public collapse, burglary in progress, neighbouring house fire. Each includes fictional caller context, required service, communication criteria, explicit completion condition, review status and optional deterministic changes. The chest-pain scenario reveals arm pain after four caller turns; the update is shown to the caller only until they communicate it. No random deterioration occurs.

The phone is a simulation; only Phone opens, and any number other than exact `999` stays local. Police and fire use service-specific information categories. Coastguard is supported for service selection and appropriate transfer questioning, but there is no coastal scenario in this initial set. A wrong service selection is recorded and can be corrected through another simulated transfer.

The finite-state workflow in `core.mjs` supervises connection, selection, transfer, questioning, conclusion and ending. Conversation facts and transcript are separate from the scenario answer card. `observe_details` requires caller-transcript evidence and uses a scenario-specific whitelist. It does not automatically verify that an answer matches the fictional card; clinicians must review factual accuracy. Unknown details are accepted where the rubric permits them. Slowness and accents are not graded. Provider transcription is auxiliary and can differ from what was understood from audio.

Model instructions prohibit medical/first-aid, rescue, firefighting and tactical advice and real dispatch claims. No instructional clinical protocol or improvisation feature is implemented. This is a model instruction boundary, not a verified clinical-safety guarantee; adversarial and clinical evaluation remain necessary. The collapse scenario practises information gathering only and does not teach how to recognise or treat cardiac arrest. A real-emergency declaration or the persistent real-emergency stop button terminates practice and tells the user to use a real phone for 999.

### British voice suitability

`marin` and `cedar` are the documented recommended Realtime voices. The prompt requests British English, but the provider does not document a guaranteed fixed `en-GB` accent for these voices. Voice suitability requires listening review with UK users and clinicians. An alternative investigated is Azure Speech's explicitly labelled `en-GB` voices; substituting it would require a different speech pipeline or provider integration, which has not been implemented. Do not claim an accent guarantee or switch providers solely because a text transcript looks British.

## Clinician settings and observations

Select scenario, phone style, difficulty, notes visibility, assistance, extra repetition prompts, captions, response allowance (30/60/90 seconds) and maximum call duration (5/10/15 minutes). Easy uses core criteria; moderate/challenging include additional details, with supportive conversational instructions appropriate to difficulty. Necessary repetition/clarification remains possible even when the optional repeat button is disabled. Voice activity detection uses low-eagerness semantic VAD; response allowance controls a gentle silence check-in, not a speed penalty or automatic interruption. Pause cancels output and disables microphone transmission; the maximum call duration continues to bound the connection. Speaker changes playback volume, not the device's hardware audio route.

Review includes dial attempts, scenario-to-initiation time, service choices, evidence for required information, estimated response latencies, transcript-based clarification counts and assistance events. Completion means the app accepted required evidence and received the closing-audio-stopped event; early stops, faults and timeouts remain incomplete. Browser receipt timestamps estimate latency after audio playout stops; they are not calibrated device measurements. Interruptions and clock/network/audio buffering can affect them. Explicit app assistance events and model-reported assistance are labelled separately and can overlap. AI detail observations are provisional and editable. Overall communication and conversational comprehension are clinician-rated and default to Not assessed. No first-aid comprehension score or standardised composite score is presented.

## Privacy

No audio recorder, analytics, cookies, localStorage, sessionStorage or database is used. Audio is sent to OpenAI during the active call, along with instructions; auxiliary transcriptions and observations remain in browser memory and are erased on reset/reload. OpenAI's API retention/abuse-monitoring rules still apply; this application does not establish a zero-retention arrangement. Provider and hosting-platform operational logs are outside the application's control. API handler logs contain only generic failure messages/status codes, never request bodies, audio, transcripts, passcodes or credentials.

Nothing is downloaded unless the clinician explicitly consents and clicks Download results. The transcript is separately opt-in; evidence quotes are part of results even when the full transcript is omitted. Downloaded files persist on the device until deleted by the user and must follow organisational access/retention policy. Use fictional data only. Complete a DPIA/organisational information-governance review before involving actual patients. Clinical protocols, accessibility with communication aids, supported devices and distress management require human review.

## Offline and existing applications

`offlineCapable` is false. The new cache version precaches the interface/scenario files for orientation only; there is no offline voice fallback. The worker does not intercept API or cross-origin requests. Existing app source files are unchanged. Manifest validation checks all nine entries. Updating the worker intentionally replaces the prior suite cache; revisit online to refresh.

## Verification

Run from the repository root:

```sh
node tests/emergency.test.mjs
node scripts/validate-manifest.js
node --check apps/emergency-call-simulator/app.js
```

The unit checks cover exact-number gating, state transitions, grounded caller evidence, completion, all scenarios, hidden-answer isolation, distinct voices, access controls, invalid/oversized payloads, shared rate-limit failures, no-store credential responses, generic upstream failures and the online-only manifest.

An opt-in provider test uses synthetic speech, not a microphone or patient audio:

```sh
node tests/emergency-live.mjs --run
```

This incurs API usage. It checks a real opening, spoken service selection, two actual voices, spoken fictional information, evidence tools, completion, and received generated audio through the WebSocket protocol. Its report is written to `/tmp/emergency-live-check.json`. **It is not proof of browser WebRTC, acoustic microphone quality, device playback, accent suitability or clinical validity.** See `docs/EMERGENCY_VALIDATION.md` for this implementation's actual checks and outstanding release work.

Manual acceptance should include: both phones and keyboard use; exact 999 versus wrong numbers; a complete voice handoff; interrupted speech, uncertainty, town-only address, correction and repetition; slow speech/long silence/noise; pause, mute, volume, stop and real-emergency handling; permission denial, blocked playback, endpoint/key/model failure, expired credential and dropped network; notes/captions; review overrides/export consent; narrow view, 200% reflow, reduced motion and a communication aid. Existing apps need a browser smoke check before release.

## Sources checked 20 October 2026

The following describe common information needs and do not establish a universal call script:

- [GOV.UK: 999 and 112](https://www.gov.uk/guidance/999-and-112-the-uks-national-emergency-numbers)
- [London Ambulance Service: what happens when you call](https://www.londonambulance.nhs.uk/our-services/emergency-care/what-happens-when-you-call-999/)
- [Yorkshire Ambulance Service: initial questions](https://www.yas.nhs.uk/our-services/emergency-ambulance-service-999/what-happens-when-you-call-999/)
- [NHS: when to call 999](https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/)
- [Devon & Cornwall Police: phoning 999](https://youth.devon-cornwall.police.uk/junior-site/crime-and-the-law/phoning-999/)
- [London Fire Brigade: calling 999](https://www.london-fire.gov.uk/safety/calling-999/)
- [HM Coastguard: emergency contact](https://www.gov.uk/guidance/hm-coastguard-rescue-coordination-centre-contact-details)
- [Ofcom: fictional telephone numbers](https://www.ofcom.org.uk/phones-and-broadband/phone-numbers/numbers-for-drama) — the `07700 900123` example is within the reserved drama range.
- [OpenAI: Realtime](https://developers.openai.com/api/docs/guides/realtime), [WebRTC](https://developers.openai.com/api/docs/guides/voice-webrtc?api=realtime), [conversation events and voices](https://developers.openai.com/api/docs/guides/realtime-conversations)
- [Vercel: function handlers](https://vercel.com/docs/functions/functions-api-reference)
- [Azure Speech: language and voice support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=text-to-speech)
