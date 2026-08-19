# Clock Solitaire

A browser implementation of the classic single-player card game **Clock Solitaire** (also known as Clock Patience or Four of a Kind), built with plain HTML, CSS, and JavaScript, deployed via GitHub Pages.

Rules reference: [The Spruce Crafts — Clock Solitaire Rules](https://www.thesprucecrafts.com/clock-solitaire-rules-412468)

## Game Rules

### Setup
- Use a standard 52-card deck (no jokers).
- Shuffle thoroughly and deal all 52 cards face down into 13 piles of 4 cards each.
- 12 of the piles are arranged in a circle like the numbers on a clock face (1 o'clock through 12 o'clock). The 13th pile is placed in the center.
- Each pile position corresponds to a rank:
  - 1 o'clock = Ace, 2 o'clock = 2, 3 o'clock = 3, ... 10 o'clock = 10
  - 11 o'clock = Jack, 12 o'clock = Queen
  - Center pile = King

### Play
1. Turn face up the top card of the center (King) pile. This is the first card drawn.
2. Slide that card face up under the pile matching its rank (e.g., a drawn 7 goes to the 7 o'clock pile).
3. Turn face up the top (still face-down) card of the pile you just placed a card under.
4. Repeat: each newly turned card is moved to its rank's pile, then the top card of *that* pile is turned up next, continuing the chain.
5. There are no player decisions — the outcome is fully determined by the shuffle. The only "choice" the player makes in this implementation is pacing (advancing one step at a time by clicking).

### Ending the Game
- The chain always ends when the 4th King is turned face up — mathematically, this is the only pile that can ever run out of cards to draw, since it receives one extra "visit" (the initial forced draw at the start) beyond its 4 original dealt cards.
- **Win:** all 12 clock piles have been fully completed (each holds all 4 of its matching rank) by the time the 4th King turns up, i.e. every card in the deck has been placed correctly.
- **Lose:** the 4th King turns up while any clock pile still has face-down cards remaining. This is the far more common outcome — Clock Solitaire is a game of chance with a low win rate, not skill.
- There is no redeal within a round; the player may start a new shuffled game.

## Interaction Model

- The player clicks the currently "active" pile to flip its top card and advance the chain by one step (per user preference — no auto-play).
- Highlight the active pile so it's clear where the next click should go.
- Disable/ignore clicks on any pile that isn't the currently active one.
- Animate each card moving from its origin pile to its destination pile so the player can follow the chain visually.
- Show a clear win/lose state at the end of the chain, and a "New Game" control to reshuffle and redeal.

## Tech Stack & Constraints

- **Plain HTML, CSS, and JavaScript only** — no frameworks, no build step, no bundler, no npm dependencies.
- Must run entirely client-side as static files, deployable directly to **GitHub Pages**.
- Target modern evergreen browsers; no need for legacy browser support.
- Keep the JS modular but simple (plain `<script>` files or ES modules) — this is a small game, avoid over-engineering.

## Suggested File Structure

```
/
├── index.html
├── style.css
├── script.js
└── assets/          (optional: card images/SVGs, if not rendering cards with CSS)
```

## Deployment

- Deploy via GitHub Pages from the `main` branch (root, or `/docs` if preferred).
- Since this is a static site with no build step, no CI/build pipeline is required — GitHub Pages can serve the repo directly.

## Development Conventions

- No comments in code unless explaining genuinely non-obvious logic (e.g., the "why the game always ends on the 4th King" invariant, if implemented cleverly).
- Prefer clear, small functions over cleverness — this is a small enough project that readability matters more than abstraction.
- Test the actual game in a browser after changes (deal, click through a full game to both a win and a loss) rather than relying on assumptions.
