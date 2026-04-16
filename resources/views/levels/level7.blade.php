@extends('layouts.app')

@section('title', 'Level 7: The Meta Puzzle - Obscurum')

@section('content')
<style>
    .binary-bg {
        opacity: 0.1;
        font-family: monospace;
        font-size: 10px;
        position: fixed;
        bottom: 0;
        right: 0;
        pointer-events: none;
        color: #0f0;
        white-space: pre;
        z-index: 0;
    }
    .gradient-clue {
        width: 100%;
        height: 50px;
        background: linear-gradient(90deg, 
            #670000ff, #6c0000ff, #610000ff, #640000ff, #5f0000ff, #690000ff, #740000ff, #730000ff, #5f0000ff, #6f0000ff, #760000ff, #650000ff, #720000ff, #5f0000ff, #700000ff, #750000ff, #7a0000ff, #7a0000ff, #6c0000ff, #650000ff);
    }
</style>

<div class="binary-bg">
01110000 01100001 01110011 01110011 01110111 01101111 01110010 01100100
00100000 01101001 01110011 00100000 01101101 01100001 01100100 01100101
00100000 01101111 01100110 00100000 01110100 01101000 01100101 00100000
01110000 01100001 01110011 01110100
</div>

<div class="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative z-10">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8 border-2 border-yellow-500">
            <!-- Level Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold mb-2 animate-pulse">Level 7: The Meta Puzzle</h1>
                <div class="flex justify-center space-x-4 text-sm">
                    <span class="bg-red-600 px-3 py-1 rounded-full">{{ $level->difficulty }}</span>
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
            
            <div class="text-center mb-8">
                <h2 class="text-2xl font-bold text-yellow-400">THE FINAL CHALLENGE</h2>
                <p class="mt-4">Congratulations, Agent. You've reached the final level.</p>
            </div>
            
            <!-- Clues -->
            <div class="space-y-4 mb-8">
                <div class="p-4 bg-gray-900 rounded-lg">
                    <h4 class="font-semibold text-green-400 mb-2">🔍 CLUE #1: The Binary Message</h4>
                    <p class="font-mono text-xs break-all">01110000 01100001 01110011 01110011 01110111 01101111 01110010 01100100 00100000 01101001 01110011 00100000 01101101 01100001 01100100 01100101 00100000 01101111 01100110 00100000 01110100 01101000 01100101 00100000 01110000 01100001 01110011 01110100</p>
                </div>
                <div class="p-4 bg-gray-900 rounded-lg">
                    <h4 class="font-semibold text-blue-400 mb-2">🔍 CLUE #2: The CSS Gradient</h4>
                    <div class="gradient-clue mb-4"></div>
                </div>
                <div class="p-4 bg-gray-900 rounded-lg">
                    <h4 class="font-semibold text-purple-400 mb-2">🔍 CLUE #3: The Journey Back</h4>
                    <p>All previous passwords are stored in your session</p>
                </div>
            </div>
            
            <!-- Console for finalHint() -->
            <div class="mb-8 p-4 bg-black rounded-lg border border-green-500 font-mono text-sm">
                <p class="text-green-400 mb-2">OBSCURUM CONSOLE v7.0</p>
                <div id="consoleOutput" class="bg-black text-green-400 p-3 rounded mb-4 h-32 overflow-y-auto whitespace-pre-wrap text-xs"></div>
                <div class="flex">
                    <span class="text-green-400 mr-2">&gt;</span>
                    <input type="text" id="consoleInput" placeholder="Type 'finalHint();' for help" class="flex-1 bg-black text-green-400 border-0 outline-none">
                </div>
            </div>
            
            <!-- Instructions -->
            <div class="mb-8 p-6 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg">
                <h4 class="font-semibold text-xl mb-4">🎯 FINAL TASK:</h4>
                <ol class="list-decimal list-inside space-y-2 text-sm">
                    <li>Decode the binary message (CLUE #1)</li>
                    <li>Decode the CSS gradient hex to ASCII (CLUE #2)</li>
                    <li>Retrieve all 6 previous level passwords from your session</li>
                    <li>Combine passwords in REVERSE order (Level 6 → Level 1) with dashes</li>
                    <li>Format: level6-password-level5-password-...-level1-password</li>
                    <li><em>Type 'finalHint();' in the console above for additional guidance</em></li>
                </ol>
            </div>
            
            <!-- Answer Input -->
            <div class="mt-8">
                <input type="text" 
                       id="answer" 
                       class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4 font-mono text-sm"
                       placeholder="Enter the final password"
                       autocomplete="off">
                <button onclick="checkAnswer()" 
                        class="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg mb-4">
                    Submit Final Answer
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
    let currentLevel = {{ $level->level_number }};
    
    // Get references to buttons
    const hint1Btn = document.getElementById('hint1Btn');
    const hint2Btn = document.getElementById('hint2Btn');
    const hintDisplay = document.getElementById('hintDisplay');
    
    // Hint click handlers
    if (hint1Btn) hint1Btn.addEventListener('click', function() { getHint(1); });
    if (hint2Btn) hint2Btn.addEventListener('click', function() { getHint(2); });
    
    window.binaryToAscii = function(binary) {
        return binary.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
    };
    
    window.hexToAscii = function(hex) {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        return str;
    };
    
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
    
    console.log('%c🏆 OBSCURUM - FINAL LEVEL', 'font-size: 20px; color: gold;');
    
    // Console functionality
    const consoleInput = document.getElementById('consoleInput');
    const consoleOutput = document.getElementById('consoleOutput');
    
    if (consoleInput) {
        consoleInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const command = this.value.trim();
                consoleOutput.textContent += '\n> ' + command;
                
                if (command === 'finalHint();') {
                    const hint = `FINAL HINT:
1. Binary says: password is made of the past
2. CSS gradient: glad_its_over_puzzle
3. Previous passwords are in your session
4. Combine in REVERSE order (Level 6 to Level 1) with dashes
5. Format: level6-password-level5-password-...-level1-password`;
                    consoleOutput.textContent += '\n\n' + hint + '\n';
                } else {
                    consoleOutput.textContent += '\nUnknown command. Type "finalHint();" for help.\n';
                }
                
                this.value = '';
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
            }
        });
    }
    
    document.getElementById('answer').focus();
</script>
@endpush
@endsection
