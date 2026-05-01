@extends('layouts.app')

@section('title', 'Congratulations! - Obscurum')

@section('content')
<canvas id="matrixCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;"></canvas>
<div class="min-h-screen">
    <div class="container mx-auto px-4 py-16">
        <div class="max-w-2xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
            <div class="text-8xl mb-6 animate-bounce">🏆</div>
            
            <h1 class="text-5xl font-bold mb-4 text-yellow-400">
                CONGRATULATIONS!
            </h1>
            
            <p class="text-2xl text-white mb-8">
                You've completed all 7 levels of Obscurum!
            </p>
            
            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mb-8">
                <div class="bg-gray-700 p-4 rounded-lg">
                    <p class="text-gray-400 text-sm">Total Points</p>
                    <p class="text-3xl font-bold text-yellow-400">{{ $totalPoints ?? 0 }}</p>
                </div>
                <div class="bg-gray-700 p-4 rounded-lg">
                    <p class="text-gray-400 text-sm">Levels Completed</p>
                    <p class="text-3xl font-bold text-green-400">{{ $totalCompleted ?? 7 }}/7</p>
                </div>
            </div>
            
            <p class="text-gray-300 mb-8">
                You've mastered: View Source, CSS Inspection, Console Commands,<br>
                Browser Storage, XOR Cryptography, Multi-layer Obfuscation, and Meta Puzzles!
            </p>
            
            <button onclick="resetAndPlayAgain()" 
                    class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition">
                <i class="fas fa-redo-alt"></i> Play Again (Reset Progress)
            </button>
        </div>
    </div>
</div>

<script>
    /* ════════════════════════════════
       MATRIX BACKGROUND
    ════════════════════════════════ */
    (function () {
      const canvas = document.getElementById('matrixCanvas');
      const ctx = canvas.getContext('2d');

      const resize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();

      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%"\'#&_(),.;:?!|{}<>[]^~';
      const BASE_FONT = 16;
      let rows, xsPx, baseSpeeds;

      const init = () => {
        rows = Math.max(1, Math.floor(canvas.height / BASE_FONT));
        xsPx = Array.from({ length: rows }, () => Math.random() * canvas.width);
        baseSpeeds = Array.from({ length: rows }, () => 0.5 + Math.random() * 0.9);
      };
      init();
      window.addEventListener('resize', init);

      const draw = () => {
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = `${BASE_FONT}px monospace`;
        ctx.fillStyle = 'rgb(0,255,0)';

        for (let i = 0; i < rows; i++) {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(ch, xsPx[i], i * BASE_FONT);

          xsPx[i] += baseSpeeds[i] * BASE_FONT;
          if (Math.random() > 0.985) xsPx[i] += BASE_FONT * 0.5;
          if (xsPx[i] >= canvas.width) xsPx[i] -= canvas.width;
          if (xsPx[i] < 0) xsPx[i] += canvas.width;
        }
      };

      setInterval(draw, 35);
    })();

    function resetAndPlayAgain() {
        if(confirm('Reset all progress and start over?')) {
            fetch('/reset-progress', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                }
            }).then(() => {
                window.location.href = '/level/1';
            });
        }
    }
</script>
@endsection