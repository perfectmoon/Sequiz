@extends('layouts.app')

@section('title', 'Congratulations! - Obscurum')

@section('content')
<div class="min-h-screen bg-gradient-to-br from-green-900 to-blue-900">
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
