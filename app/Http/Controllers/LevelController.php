<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use App\Models\Level;
use App\Models\Hint;
use Inertia\Inertia;

class LevelController extends Controller
{
    public function show($levelNumber)
    {
        // Check if level is accessible (can't skip ahead)
        $completedLevels = session('completed_levels', []);
        
        // Can only access level 1 or levels that are unlocked
        if ($levelNumber > 1 && !in_array($levelNumber - 1, $completedLevels)) {
            return redirect('/level/' . (count($completedLevels) + 1))
                ->with('error', 'Complete previous levels first!');
        }
        
        $level = Level::where('level_number', $levelNumber)->first();
        
        if (!$level) {
            return redirect('/level/1');
        }
        
        $hints = Hint::where('level_id', $level->id)
            ->orderBy('order')
            ->get();
        
// Get hint usage for this level
        $usedHints = session("hints_used_level_{$levelNumber}", []);
        
        // Get session data for real-time display
        $totalPoints = session('total_points', 0);
        $completedLevels = session('completed_levels', []);
        
// Return Blade view instead of Inertia
        return view('levels.level' . $levelNumber, [
            'level' => $level,
            'hints' => $hints,
            'usedHints' => $usedHints,
            'csrfToken' => csrf_token(),
            'totalPoints' => $totalPoints,
            'completedLevels' => $completedLevels
        ]);
    }

    public function checkAnswer(Request $request, $levelNumber)
    {
        $request->validate([
            'answer' => 'required|string'
        ]);
        
        $answer = trim($request->answer);
        $level = Level::where('level_number', $levelNumber)->first();
        
        if (!$level) {
            return response()->json([
                'success' => false,
                'message' => 'Level not found'
            ]);
        }
        
        $isCorrect = ($answer === $level->expected_answer);
        
        if ($isCorrect) {
            // Get used hints for this level
            $usedHints = session("hints_used_level_{$levelNumber}", []);
            $hintsCount = count($usedHints);
            
            // Calculate points earned
            if ($levelNumber == 1) {
                // Level 1: hints are free
                $pointsEarned = $level->points_awarded;
                $pointsMessage = "Level 1 hints are FREE! No points deducted.";
            } else {
                // Other levels: each hint costs 10 points
                $pointsDeduction = $hintsCount * 10;
                $pointsEarned = $level->points_awarded - $pointsDeduction;
                
                if ($pointsEarned < 0) {
                    $pointsEarned = 0;
                }
                
                $pointsMessage = $hintsCount > 0 
                    ? "You used {$hintsCount} hint(s). Deducted " . ($hintsCount * 10) . " points. Earned: {$pointsEarned} points." 
                    : "No hints used! Full {$pointsEarned} points!";
            }
            
            // Record completed level (only if not already completed)
            $completedLevels = session('completed_levels', []);
            if (!in_array($levelNumber, $completedLevels)) {
                $completedLevels[] = $levelNumber;
                session(['completed_levels' => $completedLevels]);
                
                // Add points to total
                $totalPoints = session('total_points', 0);
                $totalPoints += $pointsEarned;
                session(['total_points' => $totalPoints]);
            }
            
            session(["level_{$levelNumber}_completed" => true]);
            
            return response()->json([
                'success' => true,
                'message' => "Correct! +{$pointsEarned} points! " . $pointsMessage,
                'points_earned' => $pointsEarned,
                'total_points' => session('total_points', 0),
                'hints_used' => $hintsCount,
                'next_level' => $levelNumber + 1,
                'is_last_level' => ($levelNumber >= 7),
                'redirect' => ($levelNumber >= 7) ? '/complete' : "/level/" . ($levelNumber + 1)
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Incorrect answer. Try again!'
            ]);
        }
    }

    public function getHint(Request $request, $levelNumber)
    {
        $hintNumber = $request->hint_number;
        
        // Get level
        $level = Level::where('level_number', $levelNumber)->first();
        
        if (!$level) {
            return response()->json([
                'success' => false,
                'error' => 'Level not found'
            ]);
        }
        
        // Get hint
        $hintQuery = Hint::where('level_id', $level->id);
        
        if (Schema::hasColumn('hints', 'hint_number')) {
            $hintQuery->where(function ($query) use ($hintNumber) {
                $query->where('order', $hintNumber)
                      ->orWhere('hint_number', $hintNumber);
            });
        } else {
            $hintQuery->where('order', $hintNumber);
        }
        
        $hint = $hintQuery->first();
        
        if (!$hint) {
            return response()->json([
                'success' => false,
                'error' => 'Hint not found'
            ]);
        }
        
        // Track hint usage and deduct points
        $usedHints = session("hints_used_level_{$levelNumber}", []);
        $cost = 0;
        
        if (!in_array($hintNumber, $usedHints)) {
            $usedHints[] = $hintNumber;
            session(["hints_used_level_{$levelNumber}" => $usedHints]);
            
            // Deduct points for hint usage
            if ($levelNumber == 1) {
                $cost = 0; // Free hints for level 1
            } else {
                $cost = $hintNumber * 5; // Progressive cost: 5, 10, 15, 20, etc.
            }
            
            if ($cost > 0) {
                $currentPoints = session('total_points', 0);
                $newPoints = max(0, $currentPoints - $cost);
                session(['total_points' => $newPoints]);
            }
        }
        
        return response()->json([
            'success' => true,
            'hint' => $hint->hint_text,
            'hint_number' => $hint->order ?? $hint->hint_number,
            'cost' => $cost,
            'hints_used_count' => count($usedHints),
            'total_points' => session('total_points', 0)
        ]);
    }

    public function resetProgress()
    {
        session()->flush();
        return response()->json(['success' => true]);
    }

public function complete()
    {
        $completedLevels = session('completed_levels', []);
        $totalCompleted = count($completedLevels);
        $totalPoints = session('total_points', 0);
        
        return view('levels.complete', [
            'totalCompleted' => $totalCompleted,
            'totalPoints' => $totalPoints
        ]);
    }
    
    public function showPoints()
    {
        return response()->json([
            'total_points' => session('total_points', 0),
            'completed_levels' => session('completed_levels', []),
            'hints_used_per_level' => [
                'level1' => session('hints_used_level_1', []),
                'level2' => session('hints_used_level_2', []),
                'level3' => session('hints_used_level_3', []),
                'level4' => session('hints_used_level_4', []),
                'level5' => session('hints_used_level_5', []),
                'level6' => session('hints_used_level_6', []),
                'level7' => session('hints_used_level_7', []),
            ]
        ]);
    }
}