# Emergency simulator validation — 20 October 2026

Scope: main ambulance flow plus essential safety, privacy and failure checks. The other scenarios received configuration/schema checks, not individual live-call acceptance tests, in line with the user's request to limit verification.

## Checks performed

- Eight core/backend tests passed: number gating and workflow; evidence-grounded observations/completion; scenario configuration; hidden-answer separation/two voices; origin/access/input rejection; distributed limits failing closed; ephemeral-only responses and generic upstream errors; no telephone links and online-only registration.
- DOM integration test passed using the actual application modules with explicit media/network doubles: both phone styles, scenario selection, invalid numbers without session requests, handoff, pause/mute/stop, completion, review overrides, consent, microphone denial, a late permission response after stop, provider failure and safety reset. This is an interaction test, not real browser audio validation. Temporary jsdom 26.1.0 was installed under `/tmp/emergency-qa`, with no production dependency added.
- The OpenAI project key successfully minted a real 60-second Realtime credential.
- Opt-in synthetic speech test passed with `gpt-realtime-2.1`: real opening, spoken request for ambulance, transfer between `marin` and `cedar`, spoken fictional information transcribed, five evidence-backed facts accepted, completion requested and generated audio received. The final run also checked that a credible actual-emergency statement produced `real_emergency`. About 1.06 MB of generated PCM was received in that final check; no audio file was stored. The test transport was WebSocket; the application transport is WebRTC. No human microphone audio was used.
- Manifest validator passed for all nine apps; existing app source files were unchanged. Script syntax, relative module/asset links, unique element IDs and referenced controls were checked.
- Local HTTP app route returned 200; `.env.local` and an encoded-dot variant returned 404. The API rejected a missing/foreign Origin. The key file is ignored by Git and was not included in the hosted review.
- Protected Vercel review built successfully. The connector labelled the first deployment production despite the preview request, so sign-in protection was strengthened to **all** URLs and the login requirement verified. It is a separate project from the existing GitHub Pages site. Hosted voice is intentionally unavailable until its server credentials, origin allowlist, session code and shared limiter are configured.
- Chrome review after the user signed in verified initial rendering, iPhone/Android switching, clinician controls, fire-scenario card switching (without making a call), the real-emergency screen and return-to-practice. The 390px layout reflowed without clipped settings. Browser automation blocked localhost, so the protected review was used for rendered inspection.

## Findings and fixes

- Corrected the local server's root-path normalisation; otherwise its traversal guard rejected valid files.
- Kept session safety instructions in force for app-controlled speech turns. Tightened the handler opening after the live test produced unnecessary introductory commentary. The final live run gave the required service introduction/question.
- Kept configuration locked through the review so changing scenario cannot alter the previous exercise's exported criteria.
- Reset pause/turn state at the next exercise and verified cleanup after late microphone permission.
- Made the training banner sticky and added a persistent stop action outside the phone after rendered review showed the original header could scroll out of view. Increased scenario/orientation text to 16px.
- The premium static auditor reported externally bound buttons as actionless because it does not trace this application's `$()` ID helper and separate `.onclick` assignments. Actual assignments were inspected and the DOM flow exercised them; inline dummy handlers were not added to silence the scanner. No unresolved canonical-owner findings were reported. Do not describe this static audit as a pass.

## Reproduce

```sh
node tests/emergency.test.mjs
node scripts/validate-manifest.js
JSDOM_MODULE=/tmp/emergency-qa/node_modules/jsdom/lib/api.js node tests/emergency-dom.mjs
node tests/emergency-live.mjs --run
```

The DOM command needs the optional temporary jsdom install. The final command incurs provider usage and sends synthetic speech only. The routine test command does not call OpenAI.

## Outstanding release checks

- Browser WebRTC with a real microphone and speakers, mobile hardware, acoustic noise, long pauses and interruption behaviour have not been validated end-to-end. DOM doubles and the live protocol test are distinct evidence and do not replace these checks.
- British-accent suitability has not been confirmed by listening review. The provider's built-in voice names are not an accent guarantee; an explicitly `en-GB` speech-provider alternative is documented in the app README.
- Existing apps have structural/manifest coverage and unchanged source; no full browser regression of every app was performed.
- The assessment is unvalidated and model-derived observations need clinician review. Scenario review, accessibility with communication aids, clinical safety/adversarial evaluation and organisational information governance are outstanding. No first-aid protocol is enabled.
- Hosted voice configuration and production release are not completed. Client duration limits are not an enforceable provider spending cap. Provider retention rules still apply despite no application-side persistence.
