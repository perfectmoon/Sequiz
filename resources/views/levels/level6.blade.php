@extends('layouts.app')

@section('title', 'Level 6: Multi-Layer Obfuscation - Obscurum')

@section('content')
<canvas id="matrixCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;"></canvas>
<style>
    .layer1 {
        color: transparent;
        user-select: none;
    }
    .layer1::before {
        content: "NDdjeTUzYw==";
        /* is this hidden enough? */
        display: none;
    }
</style>

<script>
    // Layer 2: Hex encoded
    const layer2 = "5f7065726c";
    
    // Layer 3: Reversed string in localStorage
    const reverseStr = "scitamrahc_hcraeser";
    localStorage.setItem('layer3', reverseStr.split('').reverse().join(''));
    
    // Layer 4: ROT13 in cookie
    function rot13(s) {
        return s.replace(/[a-zA-Z]/g, c => 
            String.fromCharCode(c <= 'Z' ? 65 + (c.charCodeAt(0) - 65 + 13) % 26 : 
                                         97 + (c.charCodeAt(0) - 97 + 13) % 26));
    }
    document.cookie = `layer4=${rot13("gur_svany_chmmyr")}; path=/`;
</script>

<div class="min-h-screen text-white">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
            <!-- Level Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold mb-2">Level 6: Multi-Layer Obfuscation</h1>
                <div class="flex justify-center space-x-4 text-sm">
                    <span class="bg-orange-600 px-3 py-1 rounded-full">{{ $level->difficulty }}</span>
                    <span class="bg-gray-700 px-3 py-1 rounded-full">{{ $level->time_estimate }}</span>
                    <span class="bg-yellow-600 px-3 py-1 rounded-full">{{ $level->points_awarded }} pts</span>
                </div>
            </div>
            
            <!-- Points Info -->
            <div class="mb-4 p-3 bg-gray-700 rounded-lg text-center">
                <p class="text-sm">
                    <i class="fas fa-star text-yellow-400"></i> 
                    Base points: {{ $level->points_awarded }} | 
                    <i class="fas fa-lightbulb text-yellow-400"></i> 
                    Hint costs are progressive: Hint 1 = 5, Hint 2 = 10
                </p>
            </div>
            
            <!-- Layers -->
            <div class="space-y-4 mb-8">
                <div class="p-4 bg-gray-700 rounded-lg border-l-4 border-red-500">
                    <h4 class="font-semibold mb-2">Layer 1 (CSS): Base64 encoded</h4>
                    <h4 class="font-semibold mb-2">Layer 2 (JavaScript): Hex encoded</h4>
                    <h4 class="font-semibold mb-2">Layer 3 (Storage): Reversed string</h4>
                    <h4 class="font-semibold mb-2">Layer 4 (Cookie): ROT13 encoded</h4>
                </div>
            </div>
            
            <div class="mb-8 p-4 bg-gray-900 rounded-lg">
                <h4 class="font-semibold mb-2">📋 YOUR TASK:</h4>
                <ol class="list-decimal list-inside space-y-1 text-sm">
                    <li>Find all 4 encoded strings in the layers</li>
                    <li>Decode each using the appropriate method</li>
                    <li>Combine them in order (Layer 1 + Layer 2 + Layer 3 + Layer 4)</li>
                </ol>
            </div>
            
            <!-- Answer Input -->
            <div class="mt-8">
                <input type="text" 
                       id="answer" 
                       class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4"
                       placeholder="Enter combined password"
                       autocomplete="off">
                <button onclick="checkAnswer()" 
                        class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg mb-4">
                    Submit Answer
                </button>
                <div id="message" class="mt-4 text-center hidden"></div>
            </div>
            
            <!-- Hints Section -->
            <div class="mt-8 pt-4 border-t border-gray-700">
                <h4 class="text-lg font-semibold mb-4">💡 Hints (Click to reveal):</h4>
                
                <div class="grid grid-cols-1 gap-3 mb-4">
                    <button id="hint1Btn" class="text-left bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg transition">
                        <div class="flex justify-between items-center">
                            <span><i class="fas fa-lightbulb"></i> Hint 1</span>
                            <span class="text-yellow-400 text-sm">-5 points</span>
                        </div>
                    </button>
                    <button id="hint2Btn" class="text-left bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg transition">
                        <div class="flex justify-between items-center">
                            <span><i class="fas fa-lightbulb"></i> Hint 2</span>
                            <span class="text-yellow-400 text-sm">-10 points</span>
                        </div>
                    </button>
                </div>
                
                <div id="hintDisplay" class="mt-4 p-4 bg-gray-700 rounded-lg hidden"></div>
            </div>
        </div>
    </div>
</div>

@push('scripts')
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

    let currentLevel = {{ $level->level_number }};
    
    // Get references to buttons
    const hint1Btn = document.getElementById('hint1Btn');
    const hint2Btn = document.getElementById('hint2Btn');
    const hintDisplay = document.getElementById('hintDisplay');
    
    // Hint click handlers
    if (hint1Btn) hint1Btn.addEventListener('click', function() { getHint(1); });
    if (hint2Btn) hint2Btn.addEventListener('click', function() { getHint(2); });
    
    function getHint(hintNumber) {
        fetch(`/level/${currentLevel}/hint`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ hint_number: hintNumber })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                hintDisplay.classList.remove('hidden');
                hintDisplay.innerHTML = `
                    <p class="text-yellow-400 font-semibold mb-2">💡 Hint ${data.hint_number}:</p>
                    <p class="text-white">${data.hint}</p>
                    <p class="text-sm text-gray-400 mt-2">Cost: ${data.cost} points</p>
                `;

                // Update points display
                const pointsElement = document.getElementById('pointsDisplay');
                if (pointsElement) {
                    const currentPoints = parseInt(pointsElement.textContent, 10) || 0;
                    updatePointsDisplay(Math.max(0, currentPoints - data.cost));
                }
                
                // Disable the button after use
                const btn = document.getElementById(`hint${hintNumber}Btn`);
                if (btn) {
                    btn.disabled = true;
                    btn.classList.add('opacity-50', 'cursor-not-allowed');
                }
            } else {
                alert(data.error || 'Hint not available');
            }
        });
    }
    
    function updatePointsDisplay(points) {
        const pointsElement = document.getElementById('pointsDisplay');
        if (pointsElement) {
            pointsElement.textContent = points;
            pointsElement.classList.add('points-animation');
            setTimeout(() => {
                pointsElement.classList.remove('points-animation');
            }, 500);
        }
    }
    
    function checkAnswer() {
        const answer = document.getElementById('answer').value.trim();
        const messageDiv = document.getElementById('message');
        
        if (!answer) {
            alert('Please enter an answer');
            return;
        }
        
        fetch(`/level/${currentLevel}/check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ answer: answer })
        })
        .then(response => response.json())
        .then(data => {
            messageDiv.classList.remove('hidden', 'bg-green-600', 'bg-red-600');
            
            if (data.success) {
                messageDiv.className = 'mt-4 p-4 bg-green-600 text-white rounded-lg';
                messageDiv.innerHTML = `
                    <p class="font-bold">✅ ${data.message}</p>
                    <p class="text-sm mt-1">Points earned: +${data.points_earned} | Total: ${data.total_points}</p>
                `;
                updatePointsDisplay(data.total_points);
                
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 2000);
            } else {
                messageDiv.className = 'mt-4 p-4 bg-red-600 text-white rounded-lg';
                messageDiv.textContent = data.message;
                document.getElementById('answer').value = '';
                document.getElementById('answer').focus();
            }
        });
    }
    
    console.log('%c🧩 OBSCURUM - LEVEL 6', 'font-size: 20px; color: #c084fc;');
    
    document.getElementById('answer').focus();
</script>
@endpush
@endsection