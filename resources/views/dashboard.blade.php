{{--
  =====================================================================
  SEQUIZ - Game Hub Dashboard (PS5-style Carousel)
  =====================================================================
  Letakkan file ini di:
    sequiz/resources/views/dashboard.blade.php

  Cara kerja:
  - Setelah user login, halaman ini muncul
  - Carousel PS5-style dengan 4 item:
      [0] SEQUIZ        → redirect ke /sequiz (game kamu)
      [1] ARCHEGO       → redirect ke /archego  (game Andrew)
      [2] OBSCURUM      → redirect ke /obscurum (game Leonardus)
      [3] ABOUT SEQUIZ  → halaman deskripsi
  - Setiap item punya warna tema sendiri (background berubah saat di-hover/focus)
  - Navigasi pakai keyboard (←/→) dan klik
  =====================================================================
--}}
<head>
    <style>
        /* ── GLOBAL RESET & FONT ── */
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;900&display=swap');

        .hub-root {
            font-family: 'Montserrat', sans-serif;
            min-height: 100vh;
            background: #0a0a0f;
            color: #fff;
            overflow: hidden;
            position: relative;
        }

        /* ── ANIMATED BACKGROUND ── */
        .hub-bg {
            position: fixed;
            inset: 0;
            z-index: 0;
            transition: background 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .hub-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, #ffffff06 1px, transparent 1px);
            background-size: 28px 28px;
        }

        /* ── HEADER ── */
        .hub-header {
            position: relative;
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 22px 48px;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            background: rgba(0,0,0,0.4);
            backdrop-filter: blur(12px);
        }
        .hub-logo {
            font-size: 22px;
            font-weight: 900;
            letter-spacing: 3px;
            color: #fff;
        }
        .hub-logo span { opacity: 0.5; }
        .hub-user {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            color: rgba(255,255,255,0.6);
        }
        .hub-user strong { color: #fff; }
        .hub-logout {
            font-size: 12px;
            color: rgba(176, 78, 78, 0.4);
            border: 1px solid rgba(255,255,255,1);
            padding: 5px 14px;
            border-radius: 6px;
            text-decoration: none;
            transition: all 0.2s;
        }
        .hub-logout:hover { color: #fff; border-color: rgba(255,255,255,0.5); }

        /* ── MAIN LAYOUT ── */
        .hub-main {
            position: relative;
            z-index: 5;
            display: flex;
            flex-direction: column;
            height: calc(100vh - 70px);
            padding: 0 0 40px;
        }

        /* ── ACTIVE GAME INFO (TOP AREA) ── */
        .hub-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 0 80px 32px;
            transition: all 0.4s ease;
        }
        .hub-game-tag {
            font-size: 11px;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.4);
            margin-bottom: 10px;
            transition: color 0.4s;
        }
        .hub-game-title {
            font-size: clamp(42px, 6vw, 72px);
            font-weight: 900;
            line-height: 1;
            margin-bottom: 14px;
            transition: color 0.4s;
        }
        .hub-game-desc {
            font-size: 15px;
            color: rgba(255,255,255,0.55);
            max-width: 520px;
            line-height: 1.6;
            margin-bottom: 28px;
        }
        .hub-play-btn {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 14px 36px;
            border-radius: 8px;
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            text-decoration: none;
            border: none;
            cursor: pointer;
            transition: all 0.25s;
            outline: none;
        }
        .hub-play-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        }
        .hub-play-btn svg {
            width: 18px;
            height: 18px;
        }

        /* ── CAROUSEL ── */
        .hub-carousel-wrap {
            padding: 0 80px;
            position: relative;
        }
        .hub-carousel-label {
            font-size: 11px;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.3);
            margin-bottom: 14px;
        }
        .hub-carousel {
            display: flex;
            gap: 16px;
            overflow: visible;
        }

        /* ── CARD ── */
        .hub-card {
            position: relative;
            width: 200px;
            height: 120px;
            border-radius: 12px;
            flex-shrink: 0;
            cursor: pointer;
            overflow: hidden;
            border: 2px solid transparent;
            transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
            outline: none;
        }
        .hub-card:hover, .hub-card:focus {
            transform: translateY(-6px) scale(1.04);
        }
        .hub-card.active {
            border-color: rgba(255,255,255,0.8);
            box-shadow: 0 0 0 4px rgba(255,255,255,0.15), 0 20px 50px rgba(0,0,0,0.6);
            transform: translateY(-8px) scale(1.06);
        }
        .hub-card-bg {
            position: absolute;
            inset: 0;
            transition: all 0.4s;
        }
        .hub-card-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(0,0,0,0.3), rgba(0,0,0,0.1));
        }
        .hub-card-content {
            position: absolute;
            inset: 0;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 12px 14px;
        }
        .hub-card-name {
            font-size: 13px;
            font-weight: 900;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: #fff;
            text-shadow: 0 1px 4px rgba(0,0,0,0.6);
        }
        .hub-card-sub {
            font-size: 10px;
            color: rgba(255,255,255,0.6);
            letter-spacing: 1px;
            margin-top: 2px;
        }
        .hub-card-icon {
            position: absolute;
            top: 12px;
            right: 14px;
            font-size: 28px;
            opacity: 0.7;
        }
        .hub-card-badge {
            position: absolute;
            top: 10px;
            left: 12px;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 2px;
            padding: 3px 8px;
            border-radius: 4px;
            background: rgba(255,255,255,0.15);
            backdrop-filter: blur(4px);
            color: #fff;
        }

        /* ── NAV ARROWS ── */
        .hub-arrows {
            display: flex;
            gap: 10px;
            margin-top: 16px;
            padding: 0 80px;
        }
        .hub-arrow {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.12);
            color: rgba(255,255,255,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 16px;
            outline: none;
        }
        .hub-arrow:hover {
            background: rgba(255,255,255,0.15);
            color: #fff;
        }
        .hub-arrow:disabled {
            opacity: 0.2;
            cursor: not-allowed;
        }

        /* ── INDICATOR DOTS ── */
        .hub-dots {
            display: flex;
            gap: 6px;
            padding: 10px 80px 0;
            align-items: center;
        }
        .hub-dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            transition: all 0.3s;
            cursor: pointer;
        }
        .hub-dot.active {
            width: 18px;
            border-radius: 3px;
            background: rgba(255,255,255,0.8);
        }

        /* ── KEYBOARD HINT ── */
        .hub-hint {
            position: fixed;
            bottom: 20px;
            right: 30px;
            font-size: 11px;
            color: rgba(255,255,255,0.2);
            display: flex;
            gap: 14px;
            z-index: 20;
        }
        .hub-hint kbd {
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.15);
            padding: 2px 7px;
            border-radius: 4px;
        }
    </style>
</head>

<div class="hub-root" id="hubRoot">
    <!-- Dynamic Background -->
    <div class="hub-bg" id="hubBg"></div>

    <!-- Header -->
    <header class="hub-header">
        <div class="hub-logo">SEQUIZ <span>HUB</span></div>
        <div class="hub-user">
            Halo, <strong>{{ Auth::user()->name }}</strong>
            <form method="POST" action="{{ route('logout') }}" style="display:inline">
                @csrf
                <button type="submit" class="hub-logout">Logout</button>
            </form>
        </div>
    </header>

    <!-- Main -->
    <main class="hub-main">
        <!-- Active Game Info -->
        <div class="hub-info" id="hubInfo">
            <div class="hub-game-tag" id="hubTag">GAME</div>
            <div class="hub-game-title" id="hubTitle">SEQUIZ</div>
            <p class="hub-game-desc" id="hubDesc">Loading...</p>
            <a href="#" class="hub-play-btn" id="hubPlayBtn" style="background:#fff; color:#000;">
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                MAIN SEKARANG
            </a>
        </div>

        <!-- Carousel -->
        <div class="hub-carousel-wrap">
            <div class="hub-carousel-label">PILIH GAME</div>
            <div class="hub-carousel" id="hubCarousel">
                <!-- Cards generated by JS -->
            </div>
        </div>

        <!-- Arrows + Dots -->
        <div class="hub-arrows">
            <button class="hub-arrow" id="btnPrev" onclick="navigate(-1)">&#8592;</button>
            <button class="hub-arrow" id="btnNext" onclick="navigate(1)">&#8594;</button>
        </div>
        <div class="hub-dots" id="hubDots"></div>
    </main>

    <!-- Keyboard hint -->
    <div class="hub-hint">
        <span><kbd>←</kbd><kbd>→</kbd> navigasi</span>
        <span><kbd>Enter</kbd> main</span>
    </div>
</div>

<script>
    if (window.self !== window.top) {
        window.top.location = '/dashboard';
    }
    // =====================================================================
    // KONFIGURASI GAMES - Edit bagian ini untuk sesuaikan URL & info
    // =====================================================================
    const GAMES = [
        {
            id: 'sequiz',
            name: 'SEQUIZ',
            sub: 'CyberSecurity Quiz',
            tag: 'BY SEQUIZ',
            desc: 'Game kuis interaktif bertema Cyber Security. Jawab pertanyaan-pertanyaan seru tentang Syber Security dan buktikan pengetahuanmu!',
            icon: '🔭',
            url: '/quiz',          // ← sesuaikan route Sequiz kamu
            btnText: 'MAIN SEQUIZ',
            // Theme colors
            bg: 'linear-gradient(135deg, #0f0f2e 0%, #1a1a4e 50%, #0d0d1f 100%)',
            accent: '#6c63ff',
            cardBg: 'linear-gradient(135deg, #1a1a4e, #6c63ff)',
            btnBg: '#6c63ff',
            btnColor: '#fff',
            titleColor: '#a89cff',
        },
        {
            id: 'archego',
            name: 'ARCHEGO',
            sub: 'Programming Puzzle',
            tag: 'BY ANDREW',
            desc: 'Puzzle game berbasis logika pemrograman. Selesaikan setiap level dengan menyusun instruksi yang tepat.',
            icon: '🤖',
            url: '/play/archego',         
            btnText: 'MAIN ARCHEGO',
            bg: 'linear-gradient(135deg, #0f1a0f 0%, #0d2b1a 50%, #071410 100%)',
            accent: '#23a27e',
            cardBg: 'linear-gradient(135deg, #0d2b1a, #23a27e)',
            btnBg: '#23a27e',
            btnColor: '#fff',
            titleColor: '#2CC197',
        },
        {
            id: 'obscurum',
            name: 'OBSCURUM',
            sub: 'Cybersecurity Puzzle',
            tag: 'BY LEONARDUS',
            desc: 'Game CTF cybersecurity berbasis web. Gunakan skill developer tools, kriptografi, dan logika hacking untuk memecahkan 7 level yang menantang.',
            icon: '🔐',
            url: '/play/obscurum',
            btnText: 'MAIN OBSCURUM',
            bg: 'linear-gradient(135deg, #1a0a0a 0%, #2d1010 50%, #0f0808 100%)',
            accent: '#ef4444',
            cardBg: 'linear-gradient(135deg, #2d1010, #ef4444)',
            btnBg: '#ef4444',
            btnColor: '#fff',
            titleColor: '#fca5a5',
        },
    ];

    // =====================================================================
    let activeIndex = 0;

    function buildCarousel() {
        const carousel = document.getElementById('hubCarousel');
        const dots = document.getElementById('hubDots');

        GAMES.forEach((game, i) => {
            // Card
            const card = document.createElement('div');
            card.className = 'hub-card' + (i === 0 ? ' active' : '');
            card.tabIndex = 0;
            card.setAttribute('data-index', i);
            card.innerHTML = `
                <div class="hub-card-bg" style="background: ${game.cardBg}"></div>
                <div class="hub-card-overlay"></div>
                <div class="hub-card-content">
                    <div class="hub-card-name">${game.name}</div>
                    <div class="hub-card-sub">${game.sub}</div>
                </div>
                <div class="hub-card-icon">${game.icon}</div>
                <div class="hub-card-badge">${game.tag}</div>
            `;
            card.onclick = () => selectGame(i);
            card.onkeydown = (e) => { if (e.key === 'Enter') window.location.href = game.url; };
            carousel.appendChild(card);

            // Dot
            const dot = document.createElement('div');
            dot.className = 'hub-dot' + (i === 0 ? ' active' : '');
            dot.onclick = () => selectGame(i);
            dots.appendChild(dot);
        });

        updateInfo(0);
    }

    function selectGame(index) {
        const prev = activeIndex;
        activeIndex = index;

        // Update cards
        document.querySelectorAll('.hub-card').forEach((c, i) => {
            c.classList.toggle('active', i === index);
        });

        // Update dots
        document.querySelectorAll('.hub-dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });

        updateInfo(index);
        updateArrows();
    }

    function updateInfo(index) {
        const g = GAMES[index];

        // Background
        document.getElementById('hubBg').style.background = g.bg;

        // Text info
        document.getElementById('hubTag').textContent = g.tag;
        document.getElementById('hubTitle').textContent = g.name;
        document.getElementById('hubTitle').style.color = g.titleColor;
        document.getElementById('hubDesc').textContent = g.desc;

        // Button
        const btn = document.getElementById('hubPlayBtn');
        btn.textContent = '';
        btn.innerHTML = `
            <svg fill="currentColor" viewBox="0 0 24 24" style="width:18px;height:18px"><path d="M8 5v14l11-7z"/></svg>
            ${g.btnText}
        `;
        btn.style.background = g.btnBg;
        btn.style.color = g.btnColor;
        btn.href = g.url;
    }

    function navigate(dir) {
        const next = activeIndex + dir;
        if (next >= 0 && next < GAMES.length) {
            selectGame(next);
        }
    }

    function updateArrows() {
        document.getElementById('btnPrev').disabled = activeIndex === 0;
        document.getElementById('btnNext').disabled = activeIndex === GAMES.length - 1;
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft')  navigate(-1);
        if (e.key === 'ArrowRight') navigate(1);
        if (e.key === 'Enter') {
            const btn = document.getElementById('hubPlayBtn');
            if (btn.href && btn.href !== '#') window.location.href = btn.href;
        }
    });

    // Init
    buildCarousel();
    updateArrows();
</script>
