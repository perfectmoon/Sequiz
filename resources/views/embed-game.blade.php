{{--
  =====================================================================
  FILE: sequiz/resources/views/embed-game.blade.php
  =====================================================================
  View ini dipakai untuk embed game teman-teman via iframe.
  Cara pakai: lihat routes_integration.php Pilihan B
  =====================================================================
--}}

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }} — Sequiz Hub</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;900&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background: #0a0a0f;
            font-family: 'Montserrat', sans-serif;
            overflow: hidden;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* ── TOP BAR ── */
        .game-bar {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 10px 24px;
            background: rgba(0,0,0,0.8);
            backdrop-filter: blur(12px);
            border-bottom: 2px solid {{ $theme }};
            z-index: 100;
            flex-shrink: 0;
        }
        .game-bar-back {
            display: flex;
            align-items: center;
            gap: 8px;
            color: rgba(255,255,255,0.6);
            text-decoration: none;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
            padding: 6px 14px;
            border-radius: 6px;
            border: 1px solid rgba(255,255,255,0.15);
            transition: all 0.2s;
        }
        .game-bar-back:hover {
            color: #fff;
            border-color: rgba(255,255,255,0.4);
            background: rgba(255,255,255,0.05);
        }
        .game-bar-title {
            font-size: 16px;
            font-weight: 900;
            letter-spacing: 3px;
            color: #fff;
        }
        .game-bar-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: {{ $theme }};
            box-shadow: 0 0 8px {{ $theme }};
            animation: pulse 2s infinite;
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(0.9); }
        }
        .game-bar-spacer { flex: 1; }
        .game-bar-hub {
            font-size: 11px;
            color: rgba(255,255,255,0.3);
            letter-spacing: 2px;
        }

        /* ── IFRAME ── */
        .game-frame {
            flex: 1;
            width: 100%;
            border: none;
            background: #000;
        }
    </style>
</head>
<body>
    <div class="game-bar">
        <a href="{{ route('home') }}" class="game-bar-back">
            ← HUB
        </a>
        <div class="game-bar-dot"></div>
        <div class="game-bar-title">{{ $title }}</div>
        <div class="game-bar-spacer"></div>
        <div class="game-bar-hub">SEQUIZ HUB</div>
    </div>

    <iframe
        class="game-frame"
        src="{{ $src }}"
        title="{{ $title }}"
        allow="fullscreen"
        id="gameFrame"
    ></iframe>
</body>
</html>
