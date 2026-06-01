# Park Scavenger Hunt

Park Scavenger Hunt is a self-contained 3D practice app designed to support and assess **visual scanning** for patients recovering from **visuo-spatial neglect** (most commonly left-sided neglect following an acquired brain injury). 

It uses a beautiful, serene procedural park scene built with Three.js (including soft sun shadows, trees, flowerbeds, and a flowing stone fountain) to engage the patient while strictly tracking visual attention metrics.

---

## Clinical & Therapeutic Features

1. **Left-Oriented Placements (75% Bias):** Out of 6 scavenger items hidden in the park, 5 of them are dynamically placed in the patient's left hemifield relative to their starting orientation. This heavily incentivizes patients to turn and scan their neglected side.
2. **⚓ Left-Anchor Guide:** Toggling this option adds a prominent, pulsing red visual bar on the extreme left edge of the screen to serve as a constant cue reminding the patient to scan leftward.
3. **🔊 Spatial Auditory Cues:** Utilizing the Web Audio API, clinicians or patients can trigger a soft chirp sound that is panned exclusively to the left audio channel, using localized auditory cues to orient attention leftward.
4. **Detailed Scanning Metrics:** In real-time, the app logs camera rotations and time spent looking left vs. right.
5. **Clinician Dashboard & CSV Export:** Displays turn ratios, find times, and neglect index severity, and offers a complete detailed CSV report containing diagnostic records of visual search behavior.

---

## How to Play

### Controls
*   `W` / `ArrowUp`: Move forward
*   `S` / `ArrowDown`: Move backward
*   `A` / `ArrowLeft`: Turn camera left (critical for scanning left!)
*   `D` / `ArrowRight`: Turn camera right
*   **Proximity Inspection:** Proximity alerts appear when the patient walks within 2.4 meters of a target.
*   `Enter` / **Collect Item Button:** Collects the nearby item.
*   **Touch Controls:** Tablet-friendly arrows are available on screen for patients with motor impairments.

---

## Technical Details

*   **Offline Support:** Caches 3D assets locally, relying on procedural meshes instead of massive GLTF files to keep bundle sizes negligible and load times lightning-fast.
*   **Responsive Layout:** Uses a professional, three-column clinical grid structure (`task-panel`, `scene-shell`, `stats-panel`) that collapses cleanly for tablets and small screens.
