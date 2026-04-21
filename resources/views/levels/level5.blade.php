@extends('layouts.app')

@section('title', 'Level 5: XOR Encryption - Obscurum')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-red-900 to-pink-800 text-white">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
            <!-- Level Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold mb-2">🔢 Level 5: XOR Encryption</h1>
                <div class="flex justify-center space-x-4 text-sm">
                    <span class="bg-yellow-600 px-3 py-1 rounded-full">{{ $level->difficulty }}</span>
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
            
            <p style="display: none;" class="font-mono">
                0x36 0x27 0x2c 0x25 0x21 0x3a 0x0a 0x3d 0x34 0x36 0x3e 0x30 0x27
            </p>
            
            <div class="mb-8 p-4 bg-gray-700 rounded-lg">
                <p><strong>KEY:</strong> <span class="text-yellow-400">0x55</span></p>
            </div>
            
            <!-- XOR Decoder Tool -->
            <div class="mb-8 p-4 bg-gray-700 rounded-lg">
                <h4 class="font-semibold mb-4">🛠️ XOR Decoder Tool:</h4>
                <div class="space-y-4">
                    <div>
                        <label class="block mb-2">Encrypted bytes:</label>
                        <input type="text" id="encryptedInput" placeholder="Enter hex value" class="w-full bg-gray-600 text-white px-3 py-2 rounded">
                    </div>
                    <div>
                        <label class="block mb-2">Key (hex):</label>
                        <input type="text" id="keyInput" placeholder="Enter key in hex" class="w-full bg-gray-600 text-white px-3 py-2 rounded">
                    </div>
                    <button onclick="xorDecode()" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">Decode</button>
                    <div id="decodedResult" class="mt-4 p-4 bg-black rounded font-mono"></div>
                </div>
            </div>
            
            <!-- Answer Input -->
            <div class="mt-8">
                <input type="text" 
                       id="answer" 
                       class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4"
                       placeholder="Enter decrypted password"
                       autocomplete="off">
                <button onclick="checkAnswer()" 
                        class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg mb-4">
                    Submit Answer
                </button>
                <div id="message" class="mt-4 text-center hidden"></div>
            </div>
            
            <!-- Hints Section -->
            <div class="mt-8 pt-4 border-t border-gray-700">
                <h4 class="text-lg font-semibold mb-4">Hints (Click to reveal):</h4>
                
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
    let currentLevel = {{ $level->level_number }};
    
    // Get references to buttons
    const hint1Btn = document.getElementById('hint1Btn');
    const hint2Btn = document.getElementById('hint2Btn');
    const hint3Btn = document.getElementById('hint3Btn');
    const hintDisplay = document.getElementById('hintDisplay');
    
    // Hint click handlers
    if (hint1Btn) hint1Btn.addEventListener('click', function() { getHint(1); });
    if (hint2Btn) hint2Btn.addEventListener('click', function() { getHint(2); });
    if (hint3Btn) hint3Btn.addEventListener('click', function() { getHint(3); });
    
    function xorDecode() {
        const encrypted = document.getElementById('encryptedInput').value.split(',').map(b => parseInt(b.trim(), 16));
        const key = parseInt(document.getElementById('keyInput').value, 16);
        const decrypted = encrypted.map(b => String.fromCharCode(b ^ key)).join('');
        document.getElementById('decodedResult').innerHTML = `Decoded: <span class="text-green-400">"${decrypted}"</span>`;
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
    
    console.log('%c🔢 OBSCURUM - LEVEL 5', 'font-size: 20px; color: #f87171;');
    
    document.getElementById('answer').focus();
</script>
@endpush
@endsection
