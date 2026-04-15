<!DOCTYPE html>
<html>
<head>
    <title>Game Launcher</title>
    <script src="https://cdn.tailwindcss.com"></script>

    <style>
        body {
            margin: 0;
            overflow: hidden;
            transition: background 0.5s ease;
        }

        iframe {
            width: 100vw;
            height: 100vh;
            border: none;
        }

        .menu {
            position: absolute;
            bottom: 40px;
            left: 40px;
            display: flex;
            gap: 20px;
        }

        .item {
            width: 180px;
            height: 100px;
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: 0.3s;
        }

        .item:hover {
            transform: scale(1.1);
        }

        .theme-default {
            background: linear-gradient(135deg, #111, #333);
        }

        .theme-archego {
            background: linear-gradient(135deg, #001f3f, #0074D9);
        }
    </style>
</head>

<body class="theme-default">

<iframe id="gameFrame"></iframe>

<div class="menu">
    <div class="item" onclick="launchGame('archego')">
        🧠 Archego
    </div>
</div>

<script>
function launchGame(game) {
    const frame = document.getElementById("gameFrame");

    if (game === "archego") {
        frame.src = "/games/archego/html/index.html";
    }

    setTheme(game);
}

function setTheme(game) {
    document.body.className = "";

    if (game === "archego") {
        document.body.classList.add("theme-archego");
    }
}
</script>

</body>
</html>