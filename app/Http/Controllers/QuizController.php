<?php

namespace App\Http\Controllers;

use App\Models\QuizSession;
use App\Models\QuizQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function show()
    {
        return Inertia::render('quiz');
    }

    public function generate(Request $request)
    {
        $data = $request->validate([
            'category' => 'required|string|in:crypto,web-ex,forensics,network,mixed',
        ]);

        $category = $data['category'];
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            return response()->json(['message' => 'API Key missing'], 500);
        }

        if (Auth::check()) {
            $abandonedSessions = QuizSession::where('user_id', Auth::id())
                ->where('score', 0)
                ->get();

            foreach ($abandonedSessions as $oldSession) {
                $oldSession->questions()->delete();
                $oldSession->delete();
            }
        }

        $randomSeed = rand(1000, 999999); 
        $subTopics = ['history', 'technical', 'attacks', 'defense', 'tools'];
        $randomFocus = $subTopics[array_rand($subTopics)];

        $prompt = <<<PROMPT
You are an expert Cyber Security Trainer.
Your task is to generate a UNIQUE quiz set about "{$category}".
Current Focus: {$randomFocus}.
Random Seed: {$randomSeed}.

Instructions:
1. Create EXACTLY 5 multiple-choice questions.
2. Mix difficulty levels.
3. Output valid JSON only.

Format:
{
  "questions": [
    {
      "question": "string",
      "choices": ["A", "B", "C", "D"],
      "correct_index": 0,
      "explanation": "short explanation"
    }
  ]
}
PROMPT;

        $candidateModels = [
            'gemini-2.0-flash-lite-preview-02-05', 
            'gemini-2.0-flash-exp',       
            'gemini-exp-1206',            
            'gemini-flash-latest',        
        ];

        $finalResponse = null;
        $usedModel = '';
        $errors = [];

        for ($attempt = 1; $attempt <= 3; $attempt++) {
            foreach ($candidateModels as $model) {
                try {
                    $url = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}";
                    
                    $response = Http::withOptions(['verify' => false]) 
                        ->withHeaders(['Content-Type' => 'application/json'])
                        ->post($url, [
                            'contents' => [['parts' => [['text' => $prompt]]]]
                        ]);

                    if ($response->successful()) {
                        $finalResponse = $response->json();
                        $usedModel = $model;
                        break 2; 
                    } else {
                        $errors[$model] = $response->json()['error']['message'] ?? 'Unknown error';
                    }
                } catch (\Exception $e) {
                    $errors[$model] = $e->getMessage();
                }
            }
            if ($attempt < 3) sleep(2); 
        }

        if (!$finalResponse) {
            return response()->json(['message' => 'System busy.', 'details' => $errors], 500);
        }

        try {
            $textResponse = data_get($finalResponse, 'candidates.0.content.parts.0.text');
            $textResponse = str_replace(['```json', '```'], '', $textResponse);
            $payload = json_decode($textResponse, true);

            if (!isset($payload['questions'])) {
                return response()->json(['message' => 'Invalid JSON', 'raw' => $textResponse], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Parsing Error'], 500);
        }

        if (!Auth::check()) {
            return response()->json(['message' => 'Login required'], 401);
        }

        $session = QuizSession::create([
            'user_id'         => Auth::id(),
            'category'        => $category,
            'total_questions' => count($payload['questions']),
            'score'           => 0,
        ]);

        foreach ($payload['questions'] as $q) {
            QuizQuestion::create([
                'quiz_session_id' => $session->id,
                'question'        => $q['question'],
                'choices'         => $q['choices'],
                'correct_index'   => $q['correct_index'],
                'explanation'     => $q['explanation'] ?? '',
            ]);
        }

        return response()->json([
            'quiz_session_id' => $session->id,
            'questions'       => $payload['questions'],
            'debug_model'     => $usedModel
        ]);
    }

    public function finish(Request $request, QuizSession $session)
    {
        $data = $request->validate(['answers' => 'required|array']);

        if ($session->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $answers   = $data['answers'];
        $questions = $session->questions()->get(); 
        $score = 0;

        foreach ($questions as $index => $question) {
            if (!array_key_exists($index, $answers)) continue;
            
            $userIndex = (int) $answers[$index];
            $correct   = $userIndex === (int) $question->correct_index;

            $question->update([
                'user_answer_index' => $userIndex,
                'is_correct'        => $correct,
            ]);

            if ($correct) {
                $score += 20; 
            }
        }

        $session->update(['score' => $score]);

        $user = Auth::user();
        if ($user) {
            $user->increment('score', $score);
        }

        $session->questions()->delete();

        return response()->json([
            'score' => $score,
            'total' => $session->total_questions,
            'total_user_score' => $user ? $user->fresh()->score : 0
        ]);
    }
}