const SUITS = [
  { symbol: '♠', color: 'black' },
  { symbol: '♥', color: 'red' },
  { symbol: '♦', color: 'red' },
  { symbol: '♣', color: 'black' },
];

const POSITION_LABELS = {
  1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
  7: '7', 8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K',
};

const clockEl = document.getElementById('clock');
const newGameBtn = document.getElementById('new-game-btn');
const messageBanner = document.getElementById('message-banner');

let piles;
let activePosition;
let gameOver;

function createShuffledDeck() {
  const deck = [];
  for (let rank = 1; rank <= 13; rank++) {
    for (const suit of SUITS) {
      deck.push({ rank, suit: suit.symbol, color: suit.color });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function dealNewGame() {
  const deck = createShuffledDeck();
  piles = {};
  for (let p = 1; p <= 13; p++) {
    piles[p] = { faceDown: [], faceUp: [] };
  }
  for (let round = 0; round < 4; round++) {
    for (let p = 1; p <= 13; p++) {
      piles[p].faceDown.push(deck.pop());
    }
  }
  activePosition = 13;
  gameOver = false;
  hideMessage();
  render();
}

function rankLabel(rank) {
  return POSITION_LABELS[rank];
}

function pilePosition(p) {
  if (p === 13) return { left: 50, top: 50 };
  const angle = (p % 12) * 30 - 90;
  const rad = (angle * Math.PI) / 180;
  const radius = 42;
  return {
    left: 50 + radius * Math.cos(rad),
    top: 50 + radius * Math.sin(rad),
  };
}

function cardHTML(card) {
  return `
    <div class="card ${card.color}">
      <span class="card-rank">${rankLabel(card.rank)}</span>
      <span class="card-suit">${card.suit}</span>
    </div>
  `;
}

function render() {
  clockEl.innerHTML = '';
  for (let p = 1; p <= 13; p++) {
    const pile = piles[p];
    const pos = pilePosition(p);
    const pileEl = document.createElement('div');
    pileEl.className = 'pile';
    pileEl.dataset.position = p;
    pileEl.style.left = `${pos.left}%`;
    pileEl.style.top = `${pos.top}%`;

    const complete = pile.faceDown.length === 0 && pile.faceUp.length === 4;
    if (p === activePosition && !gameOver) pileEl.classList.add('active');
    if (complete) pileEl.classList.add('complete');

    const faceUpFan = pile.faceUp
      .map((card, i) => `<div class="faceup-card" style="top:${i * 18}px;left:${i * 18}px;z-index:${i}">${cardHTML(card)}</div>`)
      .join('');

    pileEl.innerHTML = `
      <div class="pile-label">${p === 13 ? 'K' : POSITION_LABELS[p]}</div>
      <div class="pile-stack">
        ${pile.faceDown.length > 0
          ? `<div class="card-back"><span>${pile.faceDown.length}</span></div>`
          : ''}
        <div class="faceup-fan">${faceUpFan}</div>
      </div>
    `;

    clockEl.appendChild(pileEl);
  }
}

function drawCard() {
  const pile = piles[activePosition];
  if (pile.faceDown.length === 0 || gameOver) return;

  const card = pile.faceDown.pop();
  const destination = card.rank;
  piles[destination].faceUp.push(card);
  activePosition = destination;

  if (piles[destination].faceDown.length === 0) {
    render();
    endGame();
    return;
  }

  render();
}

function endGame() {
  gameOver = true;
  const remaining = Object.values(piles).reduce((sum, p) => sum + p.faceDown.length, 0);
  const won = remaining === 0;
  showMessage(
    won ? 'You won! All 13 piles completed before the 4th King.' : 'Game over — the 4th King turned up too soon. Try again!',
    won
  );
}

function showMessage(text, won) {
  messageBanner.textContent = text;
  messageBanner.className = won ? 'win' : 'lose';
}

function hideMessage() {
  messageBanner.textContent = '';
  messageBanner.className = 'hidden';
}

clockEl.addEventListener('click', (e) => {
  const pileEl = e.target.closest('.pile');
  if (!pileEl) return;
  const position = Number(pileEl.dataset.position);
  if (position !== activePosition || gameOver) return;
  drawCard();
});

newGameBtn.addEventListener('click', dealNewGame);

dealNewGame();
