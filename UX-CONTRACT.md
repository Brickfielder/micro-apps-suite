# Emergency call practice behaviour

Scope: the new emergency simulator; other suite apps retain their existing behaviour. Visual ownership is in `DESIGN.md`; `shared/theme.css` remains canonical.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
| --- | --- | --- | --- | --- |
| Select/Listbox | Native HTML select | `index.html` | OS-owned popup | Keyboard, labels, desktop and narrow preview |
| Form | Native labelled fields | `app.js` and `index.html` | Locked during an exercise | Unit checks, inline errors and browser review |
| Scrollbar | App stylesheet global baseline | `app.css` | Captions use a bounded log | Document reflow and caption overflow review |

| Capability | Canonical owner | Contract |
| --- | --- | --- |
| Configuration | Native labelled controls in `index.html` | English (UK); OS-owned selects; settings lock during practice; no persistence. |
| Disclosure | Native `details` | Clinician panel remains keyboard accessible; ordinary settings require no modal. |
| Feedback | `app.js` review section | Editable provisional observations with source evidence; no standardised score; export requires explicit consent. |
| Validation | Inline status + field focus | Missing connection settings and microphone/network failures are actionable; no browser alerts. |
| Lifecycle | `core.mjs` | Ready → home → dialler → connecting → selecting → transferring → questioning → concluding → ended. Pause temporarily suspends media; error recovery explicitly restarts the connection with prior caller context. |
| Async media | `voice.mjs` | One connection at a time; abort and generation guards prevent late connections after stop; microphone tracks and peer connection close on finish, error, navigation. |
| Privacy | Backend auth + in-memory session | No audio recordings, analytics or local/session storage; only explicit downloads persist results. Never include secrets in URLs. |
| Offline | Service worker + visible status | Cache only same-origin static files. No credentials/API responses cached. Voice needs the internet. |
| Safety | Persistent training label + real-emergency stop | No telephone links, dialler integrations or telephony APIs. Real-emergency indication closes media and displays instructions to use a real phone. |
| Scroll and navigation | Browser document | No fixed-height clinical panel; phone content fits its frame; skip link and review focus supplied. |

Native controls, shared theme and the sibling banking/inbox flows establish the baseline. Phone controls are the intentional simulation-specific variant. No reusable phone or voice primitive exists in the suite; the new modules own this single workflow. There are no date pickers, database CRUD, user accounts or uploads in this feature.
