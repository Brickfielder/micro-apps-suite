# Café Rush — Bar Mode

Clinical arcade barista practice: read the ticket, build the drink in sequence, and serve accurately before patience or time runs out.

## Run locally

```bash
python3 -m http.server
```

Open `http://localhost:8000/apps/cafe-rush/`.

## Gameplay notes
- Start your shift to spawn a four-order queue with customer patience.
- Select a cup first, then add ingredients in the exact recipe sequence.
- Serve accurate drinks to earn score from recipe difficulty, current accuracy, remaining patience/speed, and streak bonuses.
- Errors reduce score and lower the accuracy multiplier for later orders.
- Difficulty progresses from simple hot drinks to iced and syrup drinks.
- At the end of the shift, review score, accuracy, best streak, mistakes, badges, and a downloadable report.
