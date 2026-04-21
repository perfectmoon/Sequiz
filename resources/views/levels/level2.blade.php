@extends('layouts.app')

@section('title', 'Level 2: CSS Secrets - Obscurum')

@section('content')
<style>
    /* SECRET CLUE HIDDEN IN CSS */
    .color-clue-1 { color: #636f6e; }
    .color-clue-2 { color: #736f6c65; }
    .color-clue-3 { color: #5f6d61; }
    .color-clue-4 { color: #73746572; }
    .invisible-text {
        color: transparent;
        text-shadow: 0 0 0 #636f6e;
    }
</style>

<div class="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 text-white">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-2xl p-8">
            <!-- Level Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold mb-2">🎨 Level 2: CSS Secrets</h1>
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
                    Hint costs are progressive: Hint 1 = 5, Hint 2 = 10
                </p>
            </div>
            
            <!-- Puzzle Description -->
            <div class="mb-8 p-4 bg-gray-700 rounded-lg">
                <h3 class="text-xl font-semibold mb-2">🎯 Your Mission:</h3>
                <p>{{ $level->description }}</p>
                <p class="text-sm text-gray-400 mt-2">Look closely at the CSS styles!</p>
            </div>
            
            <!-- Answer Input -->
            <div class="mt-8">
                <input type="text" 
                       id="answer" 
                       class="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4"
                       placeholder="Enter decoded password"
                       autocomplete="off">
                <button id="submitBtn" 
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
                </div>
                
                <div id="hintDisplay" class="mt-4 p-4 bg-gray-700 rounded-lg hidden"></div>
            </div>
        </div>
    </div>
</div>

<script>
    let currentLevel = {{ $level->level_number }};
    
    // Get references to buttons
    const hint1Btn = document.getElementById('hint1Btn');
    const hint2Btn = document.getElementById('hint2Btn');
    const hint3Btn = document.getElementById('hint3Btn');
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
    if (hint3Btn) {
        hint3Btn.addEventListener('click', function() { getHint(3); });
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
                
                if (typeof updatePointsDisplay === 'function' && data.cost) {
                    const pointsElement = document.getElementById('pointsDisplay');
                    if (pointsElement) {
                        const currentPoints = parseInt(pointsElement.textContent, 10) || 0;
                        updatePointsDisplay(Math.max(0, currentPoints - data.cost));
                    }
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
                
                if (typeof updatePointsDisplay === 'function') {
                    updatePointsDisplay(data.total_points);
                }
                
                setTimeout(() => {
                    window.location.href = data.redirect;
                }, 2000);
            } else {
                messageDiv.className = 'mt-4 p-4 bg-red-600 text-white rounded-lg';
                messageDiv.textContent = data.message;
                answerInput.value = '';
                answerInput.focus();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            messageDiv.className = 'mt-4 p-4 bg-red-600 text-white rounded-lg';
            messageDiv.textContent = 'Error checking answer';
        });
    }
    
    // Console hints
    console.log('%c🎨 OBSCURUM - LEVEL 2', 'font-size: 20px; color: #a78bfa;');
    console.log('The password is hidden in CSS hex colors');
    console.log('Look for: #636f6e, #736f6c65, #5f6d61, #73746572');
    console.log('Password is: console_master');
    
    answerInput.focus();
</script>
@endsection
