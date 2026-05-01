@extends('layouts.app')

@section('title', 'Level 3: Console Chronicles - Obscurum')

@section('content')
<canvas id="matrixCanvas" style="position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;"></canvas>
<style>
    .terminal-line {
        font-family: 'Courier New', monospace;
        white-space: pre-wrap;
        word-break: break-all;
    }
    .command-prompt::before {
        content: "> ";
        color: #4ade80;
    }
</style>

<div class="min-h-screen text-white">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
            <!-- Level Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold mb-2">💻 Level 3: Console Chronicles</h1>
                <div class="flex justify-center space-x-4 text-sm">
                    <span class="bg-blue-500 px-3 py-1 rounded-full">{{ $level->difficulty }}</span>
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
                    Hint costs are progressive: Hint 1 = 5, Hint 2 = 10, Hint 3 = 15
                </p>
            </div>
            
            <!-- Terminal Style -->
            <div class="bg-black rounded-lg p-6 mb-8 font-mono border-2 border-green-500">
                <div class="text-green-500 mb-4">
                    <p>> OBSCURUM TERMINAL v3.0</p>
                    <p>> SECURITY PROTOCOL: ACTIVE</p>
                    <p>> PASSWORD REQUIRED FOR ACCESS</p>
                    <p>> _________________________</p>
                </div>
                <div class="text-green-500">
                    <p>> All commands must be entered in the terminal below.</p>
                    <p>> Type 'help' to see available commands.</p>
                    <p>>_ <span class="animate-pulse">█</span></p>
                </div>
            </div>
            
            <!-- Command Help Display -->
            <div id="commandHelp" class="mb-4 p-4 bg-gray-900 rounded-lg border border-green-500 hidden">
                <p class="text-green-400 font-semibold mb-2">📋 Available Commands:</p>
                <div class="grid grid-cols-2 gap-2 text-sm">
                    <div><span class="text-yellow-400">help</span> - Show this help menu</div>
                    <div><span class="text-yellow-400">scan</span> - Scan page for hidden data</div>
                    <div><span class="text-yellow-400">decode &lt;base64&gt;</span> - Decode base64 string</div>
                    <div><span class="text-yellow-400">solve &lt;password&gt;</span> - Submit password</div>
                    <div><span class="text-yellow-400">hint</span> - Get a hint</div>
                    <div><span class="text-yellow-400">clear</span> - Clear terminal output</div>
                </div>
            </div>
            
            <!-- Console Command Input -->
            <div class="mb-8">
                <label class="block mb-2 text-green-400">Terminal Input:</label>
                <div class="flex">
                    <span class="bg-black text-green-500 px-3 py-3 rounded-l border border-green-500 border-r-0 font-mono">&gt;</span>
                    <input type="text" 
                           id="consoleCommand" 
                           class="flex-1 bg-black text-green-500 border border-green-500 p-3 rounded-r font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                           placeholder="Enter command here..."
                           autocomplete="off">
                </div>
                <div id="commandOutput" class="mt-4 text-green-500 font-mono text-sm bg-black p-3 rounded max-h-60 overflow-y-auto">
                    <div>> System ready. Type 'help' to begin.</div>
                </div>
            </div>
            
            <!-- Answer Input -->
            <div class="mt-8">
                <input type="text" 
                       id="answer" 
                       class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4"
                       placeholder="Enter password from terminal"
                       autocomplete="off">
                <button onclick="checkAnswer()" 
                        class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mb-4">
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
                    <button id="hint3Btn" class="text-left bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg transition">
                        <div class="flex justify-between items-center">
                            <span><i class="fas fa-lightbulb"></i> Hint 3</span>
                            <span class="text-yellow-400 text-sm">-15 points</span>
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
    let decodedPassword = "";
    
    // Get references to buttons
    const hint1Btn = document.getElementById('hint1Btn');
    const hint2Btn = document.getElementById('hint2Btn');
    const hint3Btn = document.getElementById('hint3Btn');
    const hintDisplay = document.getElementById('hintDisplay');
    
    // Hint click handlers
    if (hint1Btn) hint1Btn.addEventListener('click', function() { getHint(1); });
    if (hint2Btn) hint2Btn.addEventListener('click', function() { getHint(2); });
    if (hint3Btn) hint3Btn.addEventListener('click', function() { getHint(3); });
    
    // Command handler
    function processCommand(command) {
        const output = document.getElementById('commandOutput');
        const cmd = command.trim().toLowerCase();
        
        // HELP command
        if (cmd === 'help') {
            output.innerHTML += `
                <div>> help</div>
                <div class="text-yellow-400 ml-4">📋 Available commands:</div>
                <div class="ml-8">  <span class="text-green-400">scan</span> - Scan page for hidden data</div>
                <div class="ml-8">  <span class="text-green-400">decode &lt;base64&gt;</span> - Decode base64 string</div>
                <div class="ml-8">  <span class="text-green-400">solve &lt;password&gt;</span> - Submit password</div>
                <div class="ml-8">  <span class="text-green-400">clear</span> - Clear terminal</div>
            `;
            // Also show help box
            document.getElementById('commandHelp').classList.remove('hidden');
            return;
        }
        
        // CLEAR command
        if (cmd === 'clear') {
            output.innerHTML = '<div>> System ready. Type \'help\' to begin.</div>';
            document.getElementById('commandHelp').classList.add('hidden');
            return;
        }
        
        // SCAN command
        if (cmd === 'scan') {
            const encoded = "bmV0d29ya19uaW5qYQ==";
            output.innerHTML += `
                <div>> scan</div>
                <div class="text-yellow-400 ml-4">🔍 Scanning page...</div>
                <div class="ml-4">Found encoded string: <span class="text-green-400">${encoded}</span></div>
            `;
            return;
        }
        
        // DECODE command
        if (cmd.startsWith('decode')) {
            const parts = command.trim().split(' ');
            if (parts.length < 2) {
                output.innerHTML += `<div>> decode</div><div class="text-red-400 ml-4">❌ Usage: decode &lt;base64_string&gt;</div>`;
                return;
            }
            const encoded = parts[1];
            try {
                const decoded = atob(encoded);
                decodedPassword = decoded;
                output.innerHTML += `
                    <div>> decode ${encoded}</div>
                    <div class="text-green-400 ml-4">✅ Decoded: <span class="text-yellow-400">${decoded}</span></div>
                `;
            } catch(e) {
                output.innerHTML += `<div>> decode ${encoded}</div><div class="text-red-400 ml-4">❌ Invalid base64 string</div>`;
            }
            return;
        }
        
        // SOLVE command
        if (cmd.startsWith('solve')) {
            const parts = command.trim().split(' ');
            if (parts.length < 2) {
                output.innerHTML += `<div>> solve</div><div class="text-red-400 ml-4">❌ Usage: solve &lt;password&gt;</div>`;
                return;
            }
            const password = parts.slice(1).join(' ');
            const correct = atob("bmV0d29ya19uaW5qYQ=="); // "network_ninja"
            
            if (password === correct) {
                output.innerHTML += `
                    <div>> solve ${password}</div>
                    <div class="text-green-400 ml-4">🎉 ACCESS GRANTED!</div>
                    <div class="text-yellow-400 ml-4">Password accepted! Submit it below.</div>
                `;
                document.getElementById('answer').value = password;
                document.getElementById('answer').style.border = '2px solid #4ade80';
            } else {
                output.innerHTML += `
                    <div>> solve ${password}</div>
                    <div class="text-red-400 ml-4">❌ ACCESS DENIED!</div>
                    <div class="ml-4">Try scanning the page first: <span class="text-green-400">scan</span></div>
                `;
            }
            return;
        }
        
        // Unknown command
        output.innerHTML += `<div>> ${command}</div><div class="text-red-400 ml-4">❌ Unknown command. Type 'help' for available commands.</div>`;
    }
    
    function executeCommand() {
        const commandInput = document.getElementById('consoleCommand');
        const command = commandInput.value.trim();
        
        if (command === '') return;
        
        processCommand(command);
        
        // Clear input
        commandInput.value = '';
        commandInput.focus();
        
        // Auto-scroll to bottom
        const output = document.getElementById('commandOutput');
        output.scrollTop = output.scrollHeight;
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
    
    console.log('%c💻 OBSCURUM - LEVEL 3', 'font-size: 20px; color: #4ade80;');
    
    // Command input handler
    const consoleInput = document.getElementById('consoleCommand');
    if (consoleInput) {
        consoleInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                executeCommand();
            }
        });
    }
    
    document.getElementById('answer').focus();
</script>
@endpush
@endsection