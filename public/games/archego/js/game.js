// ── All Level Definitions ─────────────────────────────────────────────────────
const ALL_LEVELS = {
    1: {
    title: 'MAIL ROOM',
    description: 'Drag INBOX and OUTBOX item from instruction list, and put it in the program section, then click the run button when you are ready.',
    inbox: ['A', 'R','C','H','E','G','O','S'],
    expectedOutbox: ['A', 'R','C','H','E','G','O','S'],
    task: 'Filter out all zeros and send only non-zero values to OUTBOX.',
    memory: Array(10).fill(null),
  },
  2: {
    title: 'SCRAMBLER HANDLER',
    description: 'Grab the first two things from the inbox and drop them into the outbox in the reverse order. Repeat until the INBOX is empty.',
    inbox: [1, 5, 'B', 'E', 4, 8, -4, 2],
    expectedOutbox: [5, 1, 'E', 'B', 8, 4, 2, -4],
    task: 'Filter out all zeros and send only non-zero values to OUTBOX.',
    memory: Array(10).fill(null),
  },
  3: {
    title: 'RAINY SUMMER',
    description: 'From each two things in the INBOX, add them together, and put the result in the OUTBOX.',
    inbox: [4, 5, 8, 6, -3, 4, 0, -2],
    expectedOutbox: [9, 14, 1, -2],
    task: 'Add pairs from INBOX and send the sums to OUTBOX.',
    memory: Array(10).fill(null),
  },
  4: {
    title: 'TRIPLER ROOM',
    description: 'For each thing in the INBOX, TRIPLE it. And OUTBOX the result.',
    inbox: [6, -2, 8, 0, 2, 7, -1, 80],
    expectedOutbox: [18, -6, 24, 0, 6, 21, 240],
    task: 'Filter out all zeros and send only non-zero values to OUTBOX.',
    memory: Array(10).fill(null),
  },
  5: {
    title: 'ZERO EXTERMINATOR',
    description: 'Send all things that are not zero to the outbox. Repeat until the INBOX is empty.',
    inbox: [3, 0, 9, 'E', 0, 0, -4, 0],
    expectedOutbox: [3, 9, 'E', -4],
    task: 'Filter out all zeros and send only non-zero values to OUTBOX.',
    memory: Array(10).fill(null),
  },
  6: {
    title: 'SUB HALLWAY',
    description: 'For each two things in the INBOX, first subtract the 1st from the 2nd and put the result in the OUTBOX, AND THEN, subtract the 2nd from the first 1st and put the result in the OUTBOX. Repeat.',
    inbox: [3, 9, 8, 2, -6, -6, 4, -7],
    expectedOutbox: [6, -6, -6, 6, 0, 0, -11, 11],
    task: 'Filter out all zeros and send only non-zero values to OUTBOX.',
    memory: Array(10).fill(null),
  },
  7: {
    title: 'MAXIMIZATION ROOM',
    description: 'Grab two things from the INBOX, and put only the bigger of the two in the OUTBOX. If they are equal, just pick either one, then repeat.',
    inbox: [5, 4, -8, -3, 4, 4, 8, 6],
    expectedOutbox: [5, -3, 4, 8],
    task: 'From each pair, send only the larger value to OUTBOX (either if equal).',
    memory: Array(10).fill(null),
  },
  8: {
    title: 'ABSOLUTE POSITIVITY',
    description: 'Send each thing from the INBOX to the OUTBOX, but if a number is negative first remove its negative sign.',
    inbox: [1, -9, 3, 0, -2, -6, 9, 2],
    expectedOutbox: [1, 9, 3, 0, 2, 6, 9, 2],
    task: 'Output the absolute value of every item from INBOX.',
    memory: Array(10).fill(null),
  },
  9: {
    title: 'MULTIPLICATION WORKSHOP',
    description: 'For each two things from the INBOX, multiply them and OUTBOX the result.',
    inbox: [5, 4, 3, 2, 7, 0, 0, 5],
    expectedOutbox: [20, 6, 0, 0],
    task: 'Take pairs from INBOX, multiply, and send the products to OUTBOX.',
    memory: Array(10).fill(null),
  },
  
};

// ── Init level ────────────────────────────────────────────────────────────────
const params  = new URLSearchParams(window.location.search);
const levelId = parseInt(params.get('level')) || 1;
const levelData = ALL_LEVELS[levelId];
document.getElementById('navTitle').textContent = `Level ${levelId} — ${levelData.title}`;
document.title = `ARCHEGO — Level ${levelId}`;

const programDescEl = document.getElementById('programDesc');
if (programDescEl) {
  programDescEl.textContent = levelData.description || '';
}

// ── Palette ───────────────────────────────────────────────────────────────────
const palette = [
  { type: 'inbox',    label: 'INBOX',    icon: '', sub: '',              cls: 'pi-inbox'    },
  { type: 'outbox',   label: 'OUTBOX',   icon: '', sub: '',              cls: 'pi-outbox'   },
  { type: 'copyfrom', label: 'COPYFROM', icon: '', sub: '', cls: 'pi-copyfrom' },
  { type: 'copyto',   label: 'COPYTO',   icon: '', sub: '', cls: 'pi-copyto'   },
  { type: 'add', label: 'ADD', icon: '', sub: '', cls: 'pi-add'  },
  { type: 'sub', label: 'SUB', icon: '', sub: '', cls: 'pi-sub'  },
  { type: 'bumpp', label: 'BUMP +', icon: '', sub: '', cls: 'pi-bumpp'  },
  { type: 'bumpm', label: 'BUMP -', icon: '', sub: '', cls: 'pi-bumpm'  },
  { type: 'jump',     label: 'JUMP',     icon: '', sub: '',        cls: 'pi-jump'     },
  { type: 'jumpz',    label: 'JUMP',     icon: '', sub: 'if zero',       cls: 'pi-jumpz'    },
  { type: 'jumpn',    label: 'JUMP',     icon: '', sub: 'if negative',   cls: 'pi-jumpn'    },
];

const TYPE_COLOR = {
  inbox:      { bg: 'rgba(9, 253, 98, 0.11)',  border: 'rgba(74,222,128,0.35)',  icon: 'rgba(74,222,128,0.25)',  text: '#4ade80' },
  outbox:     { bg: 'rgba(9, 253, 98, 0.11)',  border: 'rgba(74,222,128,0.35)',  icon: 'rgba(74,222,128,0.25)',  text: '#4ade80' },
  copyfrom:   { bg: 'rgba(96,165,250,0.13)',  border: 'rgba(96,165,250,0.35)',  icon: 'rgba(96,165,250,0.25)',  text: '#60a5fa' },
  copyto:     { bg: 'rgba(96,165,250,0.13)',  border: 'rgba(96,165,250,0.35)',  icon: 'rgba(96,165,250,0.25)',  text: '#60a5fa' },
  add:     { bg: 'rgba(247,201,72,0.11)',  border: 'rgba(247,201,72,0.35)',  icon: 'rgba(247,201,72,0.25)',  text: '#f7c948' },
  sub:     { bg: 'rgba(247,201,72,0.11)',  border: 'rgba(247,201,72,0.35)',  icon: 'rgba(247,201,72,0.25)',  text: '#f7c948' },
  bumpp:     { bg: 'rgba(255,107,53,0.11)',  border: 'rgba(255,107,53,0.35)',  icon: 'rgba(255,107,53,0.25)',  text: '#ff6b35' },
  bumpm:     { bg: 'rgba(255,107,53,0.11)',  border: 'rgba(255,107,53,0.35)',  icon: 'rgba(255,107,53,0.25)',  text: '#ff6b35' },
  jump:       { bg: 'rgba(167,139,250,0.11)', border: 'rgba(167,139,250,0.35)', icon: 'rgba(167,139,250,0.25)', text: '#a78bfa' },
  jumpz:      { bg: 'rgba(167,139,250,0.11)', border: 'rgba(167,139,250,0.35)', icon: 'rgba(167,139,250,0.25)', text: '#a78bfa' },
  jumpn:      { bg: 'rgba(167,139,250,0.11)', border: 'rgba(167,139,250,0.35)', icon: 'rgba(167,139,250,0.25)', text: '#a78bfa' },
  jumptarget: { bg: 'rgba(167,139,250,0.06)', border: 'rgba(167,139,250,0.3)',  icon: 'rgba(167,139,250,0.2)',  text: '#a78bfa' },
};

const JUMP_COLORS = ['#c4b5fd', '#facc15', '#38bdf8', '#fb7185', '#4ade80'];

function isJumpType(type) { return ['jump','jumpz','jumpn'].includes(type); }

// Types that need a memory slot picker
function needsSlotPicker(type) {
  return ['copyfrom', 'copyto', 'add', 'sub', 'bumpp', 'bumpm'].includes(type);
}

// ── Program state ─────────────────────────────────────────────────────────────
let program   = [];
let jumpLinks = [];

// ── Runtime state (execution) ─────────────────────────────────────────────────
let runInbox   = [];
let runHand    = null;
let runMemory  = [];
let runOutbox  = [];
let isRunning  = false;
let stopRequested = false;

// ── Step mode state ───────────────────────────────────────────────────────────
let stepMode    = false;   // true when paused in step-by-step
let stepHistory = [];      // snapshots [{inbox,hand,memory,outbox,pc}] for back
let stepPc      = 0;       // current PC when in step mode
let stepResolve = null;    // resolves the async loop's per-step promise

// ── Drag state ────────────────────────────────────────────────────────────────
let drag = null;
let insertIndicator = null;

function ensureInsertIndicator() {
  if (!insertIndicator) {
    insertIndicator = document.createElement('div');
    insertIndicator.className = 'insert-indicator';
  }
}

function clearInsertIndicator() {
  if (!insertIndicator) return;
  insertIndicator.classList.remove('visible');
  if (insertIndicator.parentNode) {
    insertIndicator.parentNode.removeChild(insertIndicator);
  }
  const container = document.getElementById('programSlots');
  if (container) {
    const empty = container.querySelector('.program-empty');
    if (empty) empty.style.display = '';
  }
}

function updateInsertIndicator(insertIdx) {
  const container = document.getElementById('programSlots');
  if (!container || insertIdx < 0) {
    clearInsertIndicator();
    return;
  }

  ensureInsertIndicator();

  const empty = container.querySelector('.program-empty');
  if (empty) empty.style.display = 'none';

  const endZone = container.querySelector('.program-end-zone');
  const cards = [...container.querySelectorAll('.prog-card')];

  let referenceNode = null;

  if (cards.length === 0) {
    referenceNode = endZone || null;
  } else if (insertIdx >= cards.length) {
    referenceNode = endZone || null;
  } else {
    referenceNode = cards[insertIdx];
  }

  if (referenceNode) {
    if (insertIndicator.parentNode !== container || insertIndicator.nextSibling !== referenceNode) {
      container.insertBefore(insertIndicator, referenceNode);
    }
  } else if (insertIndicator.parentNode !== container) {
    container.appendChild(insertIndicator);
  }

  requestAnimationFrame(() => {
    insertIndicator.classList.add('visible');
  });
}

// ── Render Palette ────────────────────────────────────────────────────────────
function renderPalette() {
  const list = document.getElementById('paletteList');
  list.innerHTML = '';
  palette.forEach(p => {
    const el = document.createElement('div');
    el.className = `palette-item ${p.cls}`;
    el.innerHTML = `
      <div class="p-icon" style="color:${TYPE_COLOR[p.type]?.text}">${p.icon}</div>
      <div class="p-text">
        ${p.label}
        ${p.sub ? `<span class="p-sub">${p.sub}</span>` : ''}
      </div>`;
    el.addEventListener('mousedown', e => onPaletteMouseDown(e, p));
    list.appendChild(el);
  });
}

// ── Render Program ────────────────────────────────────────────────────────────
function renderProgram() {
  const container = document.getElementById('programSlots');
  container.innerHTML = '';

  if (program.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'program-empty';
    empty.textContent = 'Drag instructions here';
    container.appendChild(empty);
  }

  program.forEach((item, i) => {
    const card = buildCard(item, i);
    container.appendChild(card);
  });

  const endZone = document.createElement('div');
  endZone.className = 'program-end-zone';
  endZone.dataset.endZone = 'true';
  container.appendChild(endZone);

  renderArrows();
}

// ── Build a card element ──────────────────────────────────────────────────────
function buildCard(item, idx) {
  const c = TYPE_COLOR[item.type] || TYPE_COLOR.jump;
  const isTarget = item.type === 'jumptarget';
  const hasSlot = needsSlotPicker(item.type);
  const slotVal = hasSlot ? (item.slot != null ? item.slot : '?') : null;

  const card = document.createElement('div');
  card.className = 'prog-card';
  card.dataset.idx = idx;
  card.style.background  = c.bg;
  card.style.borderColor = c.border;
  if (isTarget) card.style.borderStyle = 'dashed';

  card.innerHTML = `
    <div class="prog-card-icon" style="background:${c.icon};color:${c.text}">${item.icon}</div>
    <div class="prog-card-text">
      <span class="prog-card-label" style="color:${c.text}">${item.label}</span>
      ${item.sub ? `<span class="prog-card-sub">${item.sub}</span>` : ''}
    </div>
    ${hasSlot ? `<div class="prog-card-slot" style="border-color:${c.border};color:${c.text}" data-slot>${slotVal}</div>` : ''}`;

  card.addEventListener('mousedown', e => onCardMouseDown(e, idx, card));

  if (hasSlot) {
    const slotEl = card.querySelector('.prog-card-slot');
    if (slotEl) {
      slotEl.addEventListener('mousedown', e => { e.stopPropagation(); });
      slotEl.addEventListener('click', e => {
        e.stopPropagation();
        openSlotPicker(idx, card, slotEl);
      });
    }
  }
  return card;
}

// ── Slot picker ───────────────────────────────────────────────────────────────
let slotPickerOpen = null;

function openSlotPicker(idx, card, slotEl) {
  if (slotPickerOpen) {
    slotPickerOpen.remove();
    slotPickerOpen = null;
  }

  const picker = document.createElement('div');
  picker.className = 'prog-slot-picker';
  picker.innerHTML = [0,1,2,3,4,5,6,7,8,9].map(n =>
    `<button type="button" class="prog-slot-btn" data-n="${n}">${n}</button>`
  ).join('');

  const rect = slotEl.getBoundingClientRect();
  picker.style.left = rect.left + 'px';
  picker.style.top = (rect.bottom + 4) + 'px';

  picker.querySelectorAll('.prog-slot-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const n = parseInt(btn.dataset.n, 10);
      program[idx].slot = n;
      renderProgram();
      picker.remove();
      slotPickerOpen = null;
      document.removeEventListener('click', close);
    });
  });

  const close = () => {
    if (picker.parentNode) picker.remove();
    slotPickerOpen = null;
    document.removeEventListener('click', close);
  };

  document.body.appendChild(picker);
  slotPickerOpen = picker;
  setTimeout(() => document.addEventListener('click', close), 0);
}

// ── Palette mousedown → start drag ───────────────────────────────────────────
function onPaletteMouseDown(e, palItem) {
  e.preventDefault();
  startDrag(e, { source: 'palette', data: { ...palItem } });
}

// ── Card mousedown → start drag from slot ────────────────────────────────────
function onCardMouseDown(e, idx, card) {
  if (e.target.closest('.prog-card-slot')) return;
  e.preventDefault();
  const item = program[idx];
  if (!item) return;

  let removed, pairedTargetIdx = null;
  let arrowColor = null;

  if (isJumpType(item.type)) {
    const linkIndex = jumpLinks.findIndex(l => l.fromIdx === idx);
    if (linkIndex !== -1) {
      arrowColor = jumpLinks[linkIndex].color || JUMP_COLORS[linkIndex % JUMP_COLORS.length];
    }

    removed = { ...item };
    const existingLink = jumpLinks.find(l => l.fromIdx === idx);
    const linkedToIdx  = existingLink ? existingLink.toIdx : null;

    program.splice(idx, 1);
    jumpLinks = jumpLinks
      .filter(l => l.fromIdx !== idx)
      .map(l => ({
        fromIdx: l.fromIdx > idx ? l.fromIdx - 1 : l.fromIdx,
        toIdx:   l.toIdx   > idx ? l.toIdx   - 1 : l.toIdx,
        color:   l.color,
      }));

    if (linkedToIdx !== null) {
      pairedTargetIdx = linkedToIdx > idx ? linkedToIdx - 1 : linkedToIdx;
    }
  } else if (item.type === 'jumptarget') {
    removed = { ...item };
    const ownerLink = jumpLinks.find(l => l.toIdx === idx);
    const ownerLinkIndex = jumpLinks.findIndex(l => l.toIdx === idx);
    if (ownerLinkIndex !== -1) {
      arrowColor = jumpLinks[ownerLinkIndex].color || JUMP_COLORS[ownerLinkIndex % JUMP_COLORS.length];
    }
    const ownerIdx  = ownerLink ? ownerLink.fromIdx : null;
    program.splice(idx, 1);
    jumpLinks = jumpLinks
      .filter(l => l.toIdx !== idx)
      .map(l => ({
        fromIdx: l.fromIdx > idx ? l.fromIdx - 1 : l.fromIdx,
        toIdx:   l.toIdx   > idx ? l.toIdx   - 1 : l.toIdx,
        color:   l.color,
      }));
    if (ownerIdx !== null) {
      pairedTargetIdx = ownerIdx > idx ? ownerIdx - 1 : ownerIdx;
    }
  } else {
    removed = { ...item };
    program.splice(idx, 1);
    jumpLinks = jumpLinks.map(l => ({
      fromIdx: l.fromIdx > idx ? l.fromIdx - 1 : l.fromIdx,
      toIdx:   l.toIdx   > idx ? l.toIdx   - 1 : l.toIdx,
      color:   l.color,
    }));
  }

  renderProgram();
  startDrag(e, { source: 'slot', data: removed, fromIdx: idx, pairedTargetIdx, arrowColor });
}

// ── Start drag ────────────────────────────────────────────────────────────────
function startDrag(e, info) {
  const c = TYPE_COLOR[info.data.type] || TYPE_COLOR.jump;

  const ghost = document.createElement('div');
  ghost.className = 'drag-ghost';
  ghost.style.background  = c.bg;
  ghost.style.borderColor = c.border;
  ghost.innerHTML = `
    <span style="font-size:15px;font-weight:900;color:${c.text}">${info.data.icon}</span>
    <span style="font-weight:700;color:${c.text};font-size:12px">${info.data.label}</span>`;
  ghost.style.left = e.clientX - 44 + 'px';
  ghost.style.top  = e.clientY - 18 + 'px';
  document.body.appendChild(ghost);

  drag = { ...info, ghost, insertIdx: -1 };

  document.addEventListener('mousemove', onDragMove);
  document.addEventListener('mouseup', onDragUp);
}

// ── Drag move ─────────────────────────────────────────────────────────────────
function onDragMove(e) {
  if (!drag) return;

  drag.ghost.style.left = e.clientX  - 45 + 'px';
  drag.ghost.style.top  = e.clientY - 18 + 'px';

  const container = document.getElementById('programSlots');
  const panelRect = document.querySelector('.panel-program').getBoundingClientRect();

  const outside = e.clientX > panelRect.right + 10 || e.clientX < panelRect.left;
  if (outside) {
    drag.insertIdx = -1;
    clearInsertIndicator();
    return;
  }

  const cards = [...container.querySelectorAll('.prog-card')];
  let insertIdx = program.length;

  for (let i = 0; i < cards.length; i++) {
    const midY = cards[i].getBoundingClientRect().top + cards[i].getBoundingClientRect().height / 2;
    if (e.clientY < midY) { insertIdx = i; break; }
  }

  if (drag.insertIdx !== insertIdx) {
    drag.insertIdx = insertIdx;
    updateInsertIndicator(insertIdx);
  }

  renderArrows();
}

// ── Drag up → drop ────────────────────────────────────────────────────────────
function onDragUp(e) {
  document.removeEventListener('mousemove', onDragMove);
  document.removeEventListener('mouseup', onDragUp);

  clearInsertIndicator();

  if (!drag) return;

  drag.ghost.remove();

  const panelRect = document.querySelector('.panel-program').getBoundingClientRect();
  const outside   = e.clientX > panelRect.right + 10 || e.clientX < panelRect.left;

  if (!outside && drag.insertIdx >= 0) {
    insertItem(drag.insertIdx, drag.data, drag.pairedTargetIdx, drag.source);
  } else if (!outside) {
    insertItem(program.length, drag.data, drag.pairedTargetIdx, drag.source);
  } else {
    if (
      (isJumpType(drag.data.type) || drag.data.type === 'jumptarget') &&
      drag.pairedTargetIdx !== null &&
      drag.pairedTargetIdx >= 0 &&
      drag.pairedTargetIdx < program.length
    ) {
      const removeIdx = drag.pairedTargetIdx;
      program.splice(removeIdx, 1);
      jumpLinks = jumpLinks
        .filter(l => l.fromIdx !== removeIdx && l.toIdx !== removeIdx)
        .map(l => ({
          fromIdx: l.fromIdx > removeIdx ? l.fromIdx - 1 : l.fromIdx,
          toIdx:   l.toIdx   > removeIdx ? l.toIdx   - 1 : l.toIdx,
          color:   l.color,
        }));
    }
  }

  drag = null;
  renderProgram();
}

// ── Insert item into program ──────────────────────────────────────────────────
function insertItem(insertIdx, item, pairedJumpIdx = null, fromSource = 'palette') {
  insertIdx = Math.max(0, Math.min(insertIdx, program.length));

  if (isJumpType(item.type)) {
    if (fromSource === 'palette') {
      const jumpCard   = { ...item };
      const targetCard = { type: 'jumptarget', label: '', icon: '', sub: '[target]', cls: 'pi-jump' };
      program.splice(insertIdx, 0, jumpCard, targetCard);
      jumpLinks = jumpLinks.map(l => ({
        fromIdx: l.fromIdx >= insertIdx ? l.fromIdx + 2 : l.fromIdx,
        toIdx:   l.toIdx   >= insertIdx ? l.toIdx   + 2 : l.toIdx,
        color:   l.color,
      }));
      const colorIndex = jumpLinks.length % JUMP_COLORS.length;
      jumpLinks.push({ fromIdx: insertIdx, toIdx: insertIdx + 1, color: JUMP_COLORS[colorIndex] });
    } else {
      program.splice(insertIdx, 0, { ...item });
      jumpLinks = jumpLinks.map(l => ({
        fromIdx: l.fromIdx >= insertIdx ? l.fromIdx + 1 : l.fromIdx,
        toIdx:   l.toIdx   >= insertIdx ? l.toIdx   + 1 : l.toIdx,
        color:   l.color,
      }));
      if (pairedJumpIdx !== null) {
        const adjustedTarget = pairedJumpIdx >= insertIdx ? pairedJumpIdx + 1 : pairedJumpIdx;
        jumpLinks = jumpLinks.filter(l => l.fromIdx !== insertIdx);
        jumpLinks.push({ fromIdx: insertIdx, toIdx: adjustedTarget, color: (drag && drag.arrowColor) || JUMP_COLORS[0] });
      }
    }

  } else if (item.type === 'jumptarget') {
    program.splice(insertIdx, 0, { ...item });

    jumpLinks = jumpLinks.map(l => ({
      fromIdx: l.fromIdx >= insertIdx ? l.fromIdx + 1 : l.fromIdx,
      toIdx:   l.toIdx   >= insertIdx ? l.toIdx   + 1 : l.toIdx,
      color:   l.color,
    }));

    if (pairedJumpIdx !== null) {
      const adjustedOwner = pairedJumpIdx >= insertIdx ? pairedJumpIdx + 1 : pairedJumpIdx;
      jumpLinks = jumpLinks.filter(l => l.fromIdx !== adjustedOwner);
      jumpLinks.push({ fromIdx: adjustedOwner, toIdx: insertIdx, color: (drag && drag.arrowColor) || JUMP_COLORS[0] });
    }

  } else {
    const newItem = { ...item };
    if (needsSlotPicker(item.type) && item.slot == null && fromSource === 'palette') {
      newItem.slot = null;
    }
    program.splice(insertIdx, 0, newItem);
    jumpLinks = jumpLinks.map(l => ({
      fromIdx: l.fromIdx >= insertIdx ? l.fromIdx + 1 : l.fromIdx,
      toIdx:   l.toIdx   >= insertIdx ? l.toIdx   + 1 : l.toIdx,
      color:   l.color,
    }));
  }
}

// ── Arrow rendering ───────────────────────────────────────────────────────────
function renderArrows() {
  const svg = document.getElementById('arrowSvg');
  if (!svg) return;
  svg.innerHTML = '';

  const slotsEl = document.getElementById('programSlots');
  if (!slotsEl) return;
  const slotsRect = slotsEl.getBoundingClientRect();

  const colors = JUMP_COLORS;

  function drawArrow(fr, tr, color) {
    if (!fr || !tr) return;

    const ox = slotsRect.left;
    const oy = slotsRect.top;
    const panelWidth = slotsRect.width;
    const margin = 16;
    const maxX = panelWidth - margin;
    const minX = margin;

    let x1 = fr.right - ox;
    const y1 = fr.top   - oy + fr.height / 2;
    let x2 = tr.right - ox + 10;
    const y2 = tr.top   - oy + tr.height / 2;

    x1 = Math.min(Math.max(x1, minX), maxX);
    x2 = Math.min(Math.max(x2, minX), maxX);

    const midX = (x1 + x2) / 2;
    const radius = Math.min(80, maxX - midX);
    const cx = midX + Math.max(radius, 0);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2 + 10} ${y2}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '3');
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.95');
    svg.appendChild(path);

    const size = 10;
    const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    arrow.setAttribute(
      'points',
      `${x2 - 1},${y2} ${x2 + size},${y2 - size / 2} ${x2 + size},${y2 + size / 2}`
    );
    arrow.setAttribute('fill', color);
    svg.appendChild(arrow);

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', x1);
    dot.setAttribute('cy', y1);
    dot.setAttribute('r', '4.5');
    dot.setAttribute('fill', color);
    svg.appendChild(dot);
  }

  jumpLinks.forEach((link, li) => {
    const fromCard = document.querySelector(`.prog-card[data-idx="${link.fromIdx}"]`);
    const toCard   = document.querySelector(`.prog-card[data-idx="${link.toIdx}"]`);
    if (!fromCard || !toCard) return;

    const fr = fromCard.getBoundingClientRect();
    const tr = toCard.getBoundingClientRect();
    const color = link.color || colors[li % colors.length];

    drawArrow(fr, tr, color);
  });

  if (
    drag &&
    drag.pairedTargetIdx !== null &&
    (isJumpType(drag.data.type) || drag.data.type === 'jumptarget')
  ) {
    const pairCard = document.querySelector(`.prog-card[data-idx="${drag.pairedTargetIdx}"]`);
    if (pairCard && drag.ghost) {
      const pairRect = pairCard.getBoundingClientRect();
      const ghostRect = drag.ghost.getBoundingClientRect();

      const isJumpCard = isJumpType(drag.data.type);
      const fromRect = isJumpCard ? ghostRect : pairRect;
      const toRect   = isJumpCard ? pairRect : ghostRect;

      drawArrow(fromRect, toRect, drag.arrowColor || '#c4b5fd');
    }
  }
}

// ── Runtime reset ──────────────────────────────────────────────────────────────
function resetRuntime() {
  runInbox  = [...levelData.inbox];
  runHand   = null;
  runMemory = levelData.memory.map(v => v);
  runOutbox = [];
}

// ── Render IO & Memory ────────────────────────────────────────────────────────
function renderInbox() {
  const tape = document.getElementById('inboxTape');
  tape.innerHTML = '';
  runInbox.forEach((v, i) => {
    const cell = document.createElement('div');
    cell.className = 'tape-cell' + (i === 0 ? ' active' : '');
    cell.textContent = v;
    tape.appendChild(cell);
  });
}

function renderHand() {
  const el = document.getElementById('memTopCell');
  if (!el) return;
  el.textContent = runHand !== null ? runHand : '';
  el.classList.toggle('active', runHand !== null);
}

function renderMemory() {
  const grid = document.getElementById('memGrid');
  grid.innerHTML = '';
  runMemory.forEach((v, i) => {
    const cell = document.createElement('div');
    cell.className = 'mem-cell';
    cell.innerHTML = `<span class="mem-idx">${i}</span>${v !== null ? v : ''}`;
    grid.appendChild(cell);
  });
}

function renderOutbox() {
  const tape = document.getElementById('outboxTape');
  tape.innerHTML = '';
  runOutbox.forEach(v => {
    const cell = document.createElement('div');
    cell.className = 'tape-cell outbox-cell';
    cell.textContent = v;
    tape.appendChild(cell);
  });
}

function renderAllRuntime() {
  renderInbox();
  renderHand();
  renderMemory();
  renderOutbox();
}

// ── Execution engine ───────────────────────────────────────────────────────────
function getJumpTarget(fromIdx) {
  const link = jumpLinks.find(l => l.fromIdx === fromIdx);
  return link ? link.toIdx : null;
}

function nextExecutablePc(pc) {
  while (pc < program.length && program[pc].type === 'jumptarget') pc++;
  return pc;
}

function executeInstruction(item, programIdx) {
  switch (item.type) {
    case 'inbox':
      if (runInbox.length === 0) 
        return { ok: true, finished: true };
        // return { ok: false, msg: 'Thats a wrong program, Ayo, pikirkan secara logika! Bisa gak si' };
      runHand = runInbox.shift();
      return { ok: true };

    case 'outbox':
      if (runHand === null) return { ok: false, msg: 'Hand is empty.' };
      runOutbox.push(runHand);
      runHand = null;
      return { ok: true };

    case 'copyfrom':
      if (item.slot == null) return { ok: false, msg: 'Dipilih dulu kakak, 1 sampai 9 nya kakak.<br><img src="../assets/anger.jpg" alt="" class="result-img">' };
      if (runMemory[item.slot] === null) return { ok: false, msg: `Memory box ${item.slot} is empty.` };
      runHand = runMemory[item.slot];
      return { ok: true };

    case 'copyto':
      if (item.slot == null) return { ok: false, msg: 'Click on the question mark, choose which number you like, then you can continue.<br><img src="../assets/understand.jpg" alt="" class="result-img">' };
      if (runHand === null) return { ok: false, msg: 'Hand is empty.' };
      runMemory[item.slot] = runHand;
      // NOTE: COPYTO in Human Resource Machine does NOT empty the hand
      return { ok: true };

    // ── ADD: hand = hand + memory[slot] ──────────────────────────────────────
    case 'add': {
      if (item.slot == null) return { ok: false, msg: 'You think i made question mark for decoration huh.<br><img src="../assets/loli.jpg" alt="" class="result-img">' };
      if (runHand === null) return { ok: false, msg: 'ADD: Hand is empty.' };
      if (runMemory[item.slot] === null) return { ok: false, msg: `ADD: Memory box ${item.slot} is empty.` };
      const handVal = typeof runHand === 'number' ? runHand : parseInt(runHand, 10);
      const memVal  = typeof runMemory[item.slot] === 'number' ? runMemory[item.slot] : parseInt(runMemory[item.slot], 10);
      if (isNaN(handVal) || isNaN(memVal)) return { ok: false, msg: 'ADD: Cannot add non-numeric values.' };
      runHand = handVal + memVal;
      return { ok: true };
    }

    // ── SUB: hand = hand - memory[slot] ──────────────────────────────────────
    case 'sub': {
      if (item.slot == null) return { ok: false, msg: 'If you still wanna continue... fill that number<br><img src="../assets/gun.jpg" alt="" class="result-img">' };
      if (runHand === null) return { ok: false, msg: 'SUB: Hand is empty.' };
      if (runMemory[item.slot] === null) return { ok: false, msg: `SUB: Memory box ${item.slot} is empty.` };
      const handValS = typeof runHand === 'number' ? runHand : parseInt(runHand, 10);
      const memValS  = typeof runMemory[item.slot] === 'number' ? runMemory[item.slot] : parseInt(runMemory[item.slot], 10);
      if (isNaN(handValS) || isNaN(memValS)) return { ok: false, msg: 'SUB: Cannot subtract non-numeric values.' };
      runHand = handValS - memValS;
      return { ok: true };
    }

    // ── BUMP+: memory[slot]++, hand = memory[slot] ───────────────────────────
    case 'bumpp': {
      if (item.slot == null) return { ok: false, msg: 'fill the number. the bump + <br><img src="../assets/anger2.jpg" alt="" class="result-img">' };
      if (runMemory[item.slot] === null) return { ok: false, msg: `BUMP+: Memory box ${item.slot} is empty.` };
      const bumpVal = typeof runMemory[item.slot] === 'number' ? runMemory[item.slot] : parseInt(runMemory[item.slot], 10);
      if (isNaN(bumpVal)) return { ok: false, msg: 'BUMP+: Memory box contains non-numeric value.' };
      runMemory[item.slot] = bumpVal + 1;
      runHand = runMemory[item.slot];
      return { ok: true };
    }

    // ── BUMP-: memory[slot]--, hand = memory[slot] ───────────────────────────
    case 'bumpm': {
      if (item.slot == null) return { ok: false, msg: 'your bump - number is still empty.<br><img src="../assets/idiot.jpg" alt="" class="result-img">' };
      if (runMemory[item.slot] === null) return { ok: false, msg: `BUMP-: Memory box ${item.slot} is empty.` };
      const bumpValM = typeof runMemory[item.slot] === 'number' ? runMemory[item.slot] : parseInt(runMemory[item.slot], 10);
      if (isNaN(bumpValM)) return { ok: false, msg: 'BUMP-: Memory box contains non-numeric value.' };
      runMemory[item.slot] = bumpValM - 1;
      runHand = runMemory[item.slot];
      return { ok: true };
    }

    case 'jump': {
      const targetIdx = getJumpTarget(programIdx);
      if (targetIdx == null) return { ok: false, msg: 'JUMP has no target.' };
      const nextPc = nextExecutablePc(targetIdx + 1);
      return { ok: true, jumpTo: nextPc };
    }

    case 'jumpz': {
      if (runHand === null) return { ok: false, msg: 'JUMP IF ZERO: Hand is empty.' };
      const isZero = runHand === 0 || runHand === '0';
      if (!isZero) return { ok: true };
      const targetIdxZ = getJumpTarget(programIdx);
      if (targetIdxZ == null) return { ok: false, msg: 'JUMP IF ZERO has no target.' };
      const nextPcZ = nextExecutablePc(targetIdxZ + 1);
      return { ok: true, jumpTo: nextPcZ };
    }

    case 'jumpn': {
      if (runHand === null) return { ok: false, msg: 'JUMP IF NEGATIVE: Hand is empty.' };
      const val = typeof runHand === 'number' ? runHand : parseInt(runHand, 10);
      const isNeg = !isNaN(val) && val < 0;
      if (!isNeg) return { ok: true };
      const targetIdxN = getJumpTarget(programIdx);
      if (targetIdxN == null) return { ok: false, msg: 'JUMP IF NEGATIVE has no target.' };
      const nextPcN = nextExecutablePc(targetIdxN + 1);
      return { ok: true, jumpTo: nextPcN };
    }

    default:
      return { ok: true };
  }
}

function setExecutingCard(idx) {
  document.querySelectorAll('.prog-card.executing').forEach(el => el.classList.remove('executing'));
  const card = document.querySelector(`.prog-card[data-idx="${idx}"]`);
  if (card) card.classList.add('executing');
}

function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (String(a[i]).trim() !== String(b[i]).trim()) return false;
  }
  return true;
} 

function showResultModal(title, titleClass, msg, buttons) {
  const modal = document.getElementById('resultModal');
  const titleEl = document.getElementById('resultModalTitle');
  const msgEl = document.getElementById('resultModalMsg');
  const actionsEl = document.getElementById('resultModalActions');

  titleEl.innerHTML = title;
  titleEl.className = 'result-modal-title ' + (titleClass || '');
  msgEl.innerHTML = msg || '';
  actionsEl.innerHTML = '';

  buttons.forEach(btn => {
    const b = document.createElement('button');
    b.className = 'result-modal-btn ' + (btn.class || '');
    b.textContent = btn.label;
    b.addEventListener('click', () => {
      modal.classList.remove('visible');
      if (btn.onClick) btn.onClick();
    });
    actionsEl.appendChild(b);
  });

  modal.classList.add('visible');
}

// ── Helpers for step UI state ─────────────────────────────────────────────────
function setStepButtonsEnabled(enabled) {
  document.getElementById('btnStepBack').disabled = !enabled;
  document.getElementById('btnStepFwd').disabled  = !enabled;
  if (enabled) {
    document.getElementById('btnStepBack').classList.add('active');
    document.getElementById('btnStepFwd').classList.add('active');
  } else {
    document.getElementById('btnStepBack').classList.remove('active');
    document.getElementById('btnStepFwd').classList.remove('active');
  }
}

function setPlayEnabled(enabled) {
  document.getElementById('btnPlay').disabled = !enabled;
}

function saveStepSnapshot(pc) {
  stepHistory.push({
    pc,
    inbox:  [...runInbox],
    hand:   runHand,
    memory: [...runMemory],
    outbox: [...runOutbox],
  });
}

function restoreStepSnapshot(snap) {
  stepPc     = snap.pc;
  runInbox   = [...snap.inbox];
  runHand    = snap.hand;
  runMemory  = [...snap.memory];
  runOutbox  = [...snap.outbox];
}

// ── Main execution ────────────────────────────────────────────────────────────
async function runProgram() {
  if (isRunning && !stepMode) return;

  const hasExecutable = program.some(p => p.type !== 'jumptarget');
  if (!hasExecutable) {
    showResultModal(
      'Maybe try to put some program?<br><img src="../assets/maybe.jpg" alt="" class="result-img">',
      'empty',
      '',
      [{ label: 'TRY AGAIN', class: 'try-again', onClick: () => {} }]
    );
    return;
  }

  // If step mode was active and user clicks RUN → resume auto-run from current position
  if (stepMode) {
    stepMode = false;
    setStepButtonsEnabled(true); // keep enabled since run is active
    setPlayEnabled(false);
    // resume the loop that's waiting
    if (stepResolve) { stepResolve('run'); stepResolve = null; }
    return;
  }

  // Fresh start
  isRunning = true;
  stepMode  = false;
  stopRequested = false;
  stepHistory = [];
  document.getElementById('btnClear').disabled = true;
  setPlayEnabled(false);
  setStepButtonsEnabled(false); // not yet enabled until run starts

  resetRuntime();
  renderAllRuntime();

  const STEP_MS = 400;
  let pc = nextExecutablePc(0);
  stepPc = pc;
  const MAX_STEPS = 10000;
  let failed = false;

  // Enable step buttons now that execution has started
  setStepButtonsEnabled(true);

  for (let steps = 0; steps < MAX_STEPS && pc < program.length; steps++) {
    if (stopRequested) break;

    const item = program[pc];
    setExecutingCard(pc);
    stepPc = pc;

    // In step mode: pause here and wait for user input
    if (stepMode) {
      const signal = await new Promise(resolve => { stepResolve = resolve; });
      if (stopRequested) break;

      if (signal === 'back') {
        // State already restored by btnStepBack handler; restart loop at new stepPc
        pc = stepPc;
        steps = Math.max(0, steps - 2); // compensate loop increment
        continue;
      }
      if (signal === 'run') {
        // Resume auto-run from current position
        // stepMode is already false
      }
      // 'step' → just proceed to execute this instruction
    }

    // Save snapshot BEFORE executing (so step-back can undo)
    saveStepSnapshot(pc);

    const result = executeInstruction(item, pc);

    if (result.finished) break;

    if (!result.ok) {
      failed = true;
      showResultModal(
        'WRONG',
        'wrong',
        result.msg || 'Execution stopped.',
        [{ label: 'TRY AGAIN', class: 'try-again', onClick: resetExecution }]
      );
      break;
    }

    renderAllRuntime();

    if (!stepMode) {
      await new Promise(r => setTimeout(r, STEP_MS));
    }

    if (result.jumpTo != null) {
      pc = result.jumpTo;
    } else {
      pc = nextExecutablePc(pc + 1);
    }
    stepPc = pc;
  }

  if (!failed && !stopRequested) {
    setExecutingCard(-1);
  }

  isRunning = false;
  stepMode  = false;
  setStepButtonsEnabled(false);
  setPlayEnabled(true);
  document.getElementById('btnClear').disabled = false;

  if (stopRequested) {
    setExecutingCard(-1);
    resetRuntime();
    renderAllRuntime();
    return;
  }
  if (failed) return;

  setExecutingCard(-1);

  if (runInbox.length === 0) {
    const expected = levelData.expectedOutbox || [];
    const correct = arraysEqual(runOutbox, expected);
    if (correct) {
      const completed = JSON.parse(localStorage.getItem('archego_completed') || '[]');
      if (!completed.includes(levelId)) {
        completed.push(levelId);
        localStorage.setItem('archego_completed', JSON.stringify(completed));
      }
      const nextLevel = levelId + 1;
      const hasNext = ALL_LEVELS[nextLevel];
      showResultModal(
        'DONE',
        'done',
        'Correct! Well done.<br><img src="../assets/done.jpg" alt="" class="result-img">',
        [
          { label: 'OKAY', class: 'okay', onClick: () => {} },
          ...(hasNext
            ? [{ label: 'NEXT LEVEL', class: 'next-level', onClick: () => { window.location.href = `game.html?level=${nextLevel}`; } }]
            : [])
        ]
      );
    } else {
      showResultModal(
        'WRONG',
        'wrong',
        'Wrong output. Try again!<br><img src="../assets/ayoo.jpeg" alt="" class="result-img">',
        [{ label: 'TRY AGAIN', class: 'try-again', onClick: resetExecution }]
      );
    }
  } else {
    showResultModal(
      'WRONG',
      'wrong',
      'INBOX still has items. Program did not finish correctly.<br><img src="../assets/try.jpg" alt="" class="result-img">',
      [{ label: 'TRY AGAIN', class: 'try-again', onClick: resetExecution }]
    );
  }
}

function resetExecution() {
  isRunning = false;
  stepMode = false;
  stepHistory = [];
  setStepButtonsEnabled(false);
  setPlayEnabled(true);
  document.getElementById('btnClear').disabled = false;
  setExecutingCard(-1);
  resetRuntime();
  renderAllRuntime();
}

// ── Buttons ───────────────────────────────────────────────────────────────────
document.getElementById('btnClear').addEventListener('click', () => {
  if (isRunning) return;
  program   = [];
  jumpLinks = [];
  resetRuntime();
  renderProgram();
  renderAllRuntime();
});

document.getElementById('btnPlay').addEventListener('click', () => {
  runProgram();
});

document.getElementById('btnStop').addEventListener('click', () => {
  if (isRunning) {
    stopRequested = true;
    stepMode = false;
    if (stepResolve) { stepResolve('stop'); stepResolve = null; }
  }
});

// Step Forward
document.getElementById('btnStepFwd').addEventListener('click', () => {
  if (!isRunning) return;

  if (!stepMode) {
    // Enter step mode — pause the auto-run after current instruction finishes
    stepMode = true;
    setPlayEnabled(true); // allow resuming as auto-run
    return;
  }

  // Already in step mode → advance one instruction by resolving the loop's pause
  if (stepResolve) { stepResolve('step'); stepResolve = null; }
});

// Step Backward
document.getElementById('btnStepBack').addEventListener('click', () => {
  if (!isRunning) return;

  if (!stepMode) {
    stepMode = true;
    setPlayEnabled(true);
    return;
  }

  if (stepHistory.length === 0) return; // nothing to go back to

  // Restore previous snapshot
  const snap = stepHistory.pop();
  restoreStepSnapshot(snap);
  renderAllRuntime();
  setExecutingCard(stepPc);

  // Wake loop so it can re-position at the restored pc
  if (stepResolve) { stepResolve('back'); stepResolve = null; }
});

document.getElementById('programSlots').addEventListener('scroll', renderArrows);
window.addEventListener('resize', renderArrows);

// ── Init ──────────────────────────────────────────────────────────────────────
renderPalette();
renderProgram();
resetRuntime();
renderAllRuntime();