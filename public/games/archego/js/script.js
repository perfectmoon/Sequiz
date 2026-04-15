const levels = [
  {
    id: 1,
    order: 1,
    title: "MAIL ROOM",
    sub: "Tutorial",
    desc: "Drag INBOX and OUTBOX item from instruction list, and put it in the program section, then click the run button when you are ready.",
    status: "unlocked",
    stars: 1,
    file: "game.html",
  },
  {
    id: 2,
    order: 2,
    title: "SCRAMBLER HANDLER",
    sub: "Sequence Manipulation",
    desc: "Grab the first two things from the inbox and drop them into the outbox in the reverse order. Repeat until the INBOX is empty.",
    status: "unlocked",
    stars: 2,
    file: "game.html",
  },
  {
    id: 3,
    order: 3,
    title: "RAINY SUMMER",
    sub: "Arithmetic",
    desc: "From each two things in the INBOX, add them together, and put the result in the OUTBOX.",
    status: "unlocked",
    stars: 1,
    file: "game.html",
  },
  {
    id: 4,
    order: 4,
    title: "TRIPLER ROOM",
    sub: "Arithmetic",
    desc: "For each thing in the INBOX, TRIPLE it. And OUTBOX the result.",
    status: "unlocked",
    stars: 2,
    file: "game.html",
  },
  {
    id: 5,
    order: 5,
    title: "ZERO EXTERMINATOR",
    sub: "Conditional Filtering",
    desc: "Send all things that are not zero to the outbox. Repeat until the INBOX is empty.",
    status: "unlocked",
    stars: 1,
    file: "game.html",
  },
  {
    id: 6,
    order: 6,
    title: "SUB HALLWAY",
    sub: "Arithmetic",
    desc: "From each two things in the INBOX, first subtract the 1st from the 2nd and put the result in the OUTBOX, AND THEN subtract the 2nd from the 1st and put the result in the OUTBOX. Repeat!",
    status: "unlocked",
    stars: 3,
    file: "game.html",
  },
  {
    id: 7,
    order: 7,
    title: "MAXIMIZATION ROOM",
    sub: "Comparison",
    desc: "Grab two things from the inbox, and put only the bigger of the two in outbox. If they are equal just pick either one. Repeat!",
    status: "unlocked",
    stars: 3,
    file: "game.html",
  },
  {
    id: 8,
    order: 8,
    title: "ABSOLUTE POSITIVITY",
    sub: "Conditional Transformation",
    desc: "Send each thing from inbox to the outbox, but if a number is negative first remove its negative sign.",
    status: "unlocked",
    stars: 4,
    file: "game.html",
  },
  {
    id: 9,
    order: 9,
    title: "MULTIPLICATION WORKSHOP",
    sub: "Iteration",
    desc: "For two things from inbox, multiply them and outbox the result.",
    status: "unlocked",
    stars: 5,
    file: "game.html",
  },
];

/* ── Render Stars ── */
function renderStars(n, total = 5) {
  return Array.from({ length: total }, (_, i) =>
    `<span class="star${i < n ? '' : ' empty'}">${i < n ? '★' : '☆'}</span>`
  ).join('');
}

/* ── Build Level Cards ── */
const completedLevels = JSON.parse(localStorage.getItem('archego_completed') || '[]');
const grid = document.getElementById('levelGrid');

const sortedLevels = [...levels].sort((a, b) => a.order - b.order);

sortedLevels.forEach((lvl) => {

  if (completedLevels.includes(lvl.id)) {
    lvl.status = 'completed';
  }

  const card = document.createElement('div');
  card.className = `level-card ${lvl.status}`;

  // Dynamic animation delay — works for any number of levels
  card.style.animationDelay = `${lvl.order * 0.05}s`;

  const isLocked    = lvl.status === 'locked';
  const isCompleted = lvl.status === 'completed';

  card.innerHTML = `
    <div class="card-stripe"></div>
    <div class="card-inner">
      <div class="level-number">${String(lvl.order).padStart(2, '0')}</div>
      <div class="card-divider"></div>
      <div class="card-info">
        <div class="card-title">${lvl.title}</div>
        <div class="card-sub">${lvl.sub}</div>
      </div>
      <div class="status-dot ${isCompleted ? 'done' : 'undone'}"></div>
    </div>
  `;

  if (!isLocked) {
    card.addEventListener('click', () => openModal(lvl));
  }

  grid.appendChild(card);
});

/* ── Modal Logic ── */
const overlay = document.getElementById('overlay');
const btnClose = document.getElementById('btnClose');
const btnPlay  = document.getElementById('btnPlay');

function openModal(lvl) {
  document.getElementById('modalNum').textContent   = String(lvl.order).padStart(2, '0');
  document.getElementById('modalTitle').textContent = lvl.title;
  document.getElementById('modalDesc').textContent  = lvl.desc;
  document.getElementById('modalStars').innerHTML   = renderStars(lvl.stars);

  const statusEl = document.getElementById('modalStatus');
  if (lvl.status === 'completed') {
    statusEl.textContent = 'DONE';
    statusEl.style.color = 'var(--green)';
  } else {
    statusEl.textContent = 'UNDONE';
    statusEl.style.color = 'var(--text2)';
  }

  btnPlay.onclick = () => {
    window.location.href = `game.html?level=${lvl.id}`;
  };

  overlay.classList.add('open');
}

function closeModal() {
  overlay.classList.remove('open');
}

btnClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });