# Fresh Market

Fresh Market is a static browser-based supermarket planning task. It uses a small Three.js scene for navigation and DOM overlays for the shopping list, trolley, prompts, and checkout report.

## Run

From the suite root:

```bash
python3 -m http.server
```

Open `http://localhost:8000/apps/fresh-market/index.html`.

## Controls

- `W` / `ArrowUp`: move forward
- `S` / `ArrowDown`: move backward
- `A` / `ArrowLeft`: turn left
- `D` / `ArrowRight`: turn right
- `E`: inspect the nearest product
- `Enter`: add the inspected product to the trolley
- Click or tap a product to inspect it
- Use the on-screen arrow controls on tablets or touch devices

Checkout is enabled when the player reaches the checkout counter. The practice checkout button remains available for quick review and automated checks.

## Scenario Data

The scenario and products live near the top of `app-3d.js`. The small `app.js` file remains as a compatibility entry point for suite tooling.

Required-list entries define the shopping goals:

- `id`: requirement key used by scoring
- `label`: visible shopping-list text
- `hint`: plain-English guidance
- `requiredVolume`: optional quantity target for volume-based items such as milk

Products define both the 3D placement and scoring role:

- `id` and optional `legacyId`: stable product identifiers
- `name`, `category`, `price`, `detail`: UI text and report text
- `zone` and `position`: supermarket aisle and 3D map position
- `targetId`: exact match for a required item
- `acceptableSubstituteFor`: requirement ids this product can satisfy
- `attemptedSubstituteFor`: related but incorrect substitute choice
- `distractorType`: impulse or unnecessary item
- `inStock: false`: visible but cannot be added

## Known Limitations

- The supermarket uses simple geometric models rather than detailed 3D assets.
- Collision is intentionally simple and aisle-based.
- Only the Family Meal scenario is exposed in the UI, although the data model is ready for additional scenarios.
