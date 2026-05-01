@extends('layouts.app')

@section('title', 'Level 1: The Hidden Message - Obscurum')

@section('content')
<canvas id="matrixCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;"></canvas>
@php
    // Set initial points to 50 for level 1 if not already set
    if (!session()->has('total_points')) {
        session(['total_points' => 50]);
    }
@endphp
<div class="min-h-screen text-white">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
            <!-- Level Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold mb-2">Level 1: The Hidden Message</h1>
                <div class="flex justify-center space-x-4 text-sm">
                    <span class="bg-green-500 px-3 py-1 rounded-full">{{ $level->difficulty }}</span>
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
            
            <!-- Puzzle Description -->
            <div class="mb-8 p-4 bg-gray-700 rounded-lg">
                <p>{{ $level->description }}</p>
                <!-- code: Zmlyc3Rfc3RlcA== -->
                <p class="text-sm text-gray-400 mt-2">Hint: Look for comments in the HTML source (Ctrl+U)</p>
            </div>
            
            <!-- Answer Input -->
            <div class="mt-8">
                <input type="text" 
                       id="answer" 
                       class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4"
                       placeholder="Enter decoded password"
                       autocomplete="off">
                <button id="submitBtn" onclick="checkAnswer()" 
                        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg mb-4">
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
    const submitBtn = document.getElementById('submitBtn');
    const answerInput = document.getElementById('answer');
    const messageDiv = document.getElementById('message');
    const hintDisplay = document.getElementById('hintDisplay');
    
    // Hint click handlers
    if (hint1Btn) {
        hint1Btn.addEventListener('click', function() { getHint(1); });
    }
    if (hint2Btn) {
        hint2Btn.addEventListener('click', function() { getHint(2); });
    }
    
    // Submit button handler
    if (submitBtn) {
        submitBtn.addEventListener('click', checkAnswer);
    }
    
    // Enter key support
    if (answerInput) {
        answerInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkAnswer();
            }
        });
    }
    
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
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error getting hint');
        });
    }
    
    function checkAnswer() {
        const answer = answerInput.value.trim();
        
        if (!answer) {
            alert('Please enter an answer');
            return;
        }
        
        messageDiv.classList.remove('hidden');
        messageDiv.className = 'mt-4 p-4 bg-gray-700 text-white rounded-lg';
        messageDiv.textContent = 'Checking answer...';
        
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
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.className = 'mt-4 p-4 bg-red-600 text-white rounded-lg';
            messageDiv.textContent = 'Error checking answer. Please try again.';
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
    
    // Console hints
    console.log('%c🔍 LEVEL 1: HINTS COST PROGRESSIVE POINTS: Hint 1 = 5, Hint 2 = 10', 'font-size: 20px; color: #fbbf24; font-weight: bold;');
    console.log('%c💰 You start with 50 points for Level 1.', 'color: #fbbf24');
    
    document.getElementById('answer').focus();
</script>
@endpush
@endsection