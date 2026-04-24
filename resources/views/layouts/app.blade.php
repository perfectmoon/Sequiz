<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', 'Obscurum - Cybersecurity Puzzle Game')</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Fira Code', monospace;
        }
        .glitch {
            animation: glitch 1s infinite;
        }
        @keyframes glitch {
            0%, 100% { transform: none; opacity: 1; }
            95% { transform: skew(5deg); opacity: 0.9; }
            96% { transform: skew(-5deg); opacity: 0.8; }
            97% { transform: skew(2deg); }
        }
        .points-animation {
            animation: pointsPop 0.5s ease-out;
        }
        @keyframes pointsPop {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); color: gold; }
            100% { transform: scale(1); opacity: 1; }
        }
    </style>
</head>
<body class="bg-gray-900">
    <!-- Navigation -->
    <nav class="bg-gray-800 border-b border-gray-700">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <a href="/dashboard" class="flex items-center space-x-2">
                    <span class="text-2xl">🔐</span>
                    <span class="text-xl font-bold text-white">Obscurum</span>
                </a>
                
                <div class="flex items-center space-x-6">
                    <!-- Points Display -->
                    <div class="flex items-center space-x-2 bg-yellow-900 px-3 py-1 rounded-lg">
                        <i class="fas fa-star text-yellow-400"></i>
                        <span id="pointsDisplay" class="text-yellow-400 font-bold">{{ session('total_points', 0) }}</span>
                        <span class="text-gray-400 text-sm">points</span>
                    </div>
                    
                    <!-- Progress Display -->
                    @php
                        $completedCount = 0;
                        for($i = 1; $i <= 7; $i++) {
                            if(session("level_{$i}_completed")) $completedCount++;
                        }
                    @endphp
                    <div class="flex items-center space-x-2 bg-blue-900 px-3 py-1 rounded-lg">
                        <i class="fas fa-trophy text-blue-400"></i>
                        <span class="text-blue-400 font-bold">{{ $completedCount }}</span>
                        <span class="text-gray-400 text-sm">/7 levels</span>
                    </div>
                    
                    <!-- Reset button -->
                    <button onclick="resetProgress()" 
                            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition">
                        <i class="fas fa-redo-alt"></i> Reset
                    </button>
                </div>
            </div>
        </div>
    </nav>
    
    <!-- Main Content -->
    <main>
        @yield('content')
    </main>
    
    <!-- Scripts -->
    <script>
        function resetProgress() {
            if(confirm('⚠️ Reset all progress? This will clear your points and completed levels. You will start from Level 1.')) {
                fetch('/reset-progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                }).then(response => response.json())
                .then(data => {
                    if(data.success) {
                        // Update display
                        document.getElementById('pointsDisplay').textContent = '0';
                        window.location.href = '/level/1';
                    }
                });
            }
        }
        
        function updatePointsDisplay(points) {
            const pointsElement = document.getElementById('pointsDisplay');
            pointsElement.textContent = points;
            pointsElement.classList.add('points-animation');
            setTimeout(() => {
                pointsElement.classList.remove('points-animation');
            }, 500);
        }
    </script>
    
    @stack('scripts')
</body>
</html>