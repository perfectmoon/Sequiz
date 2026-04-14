<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index()
    {
        $users = User::orderBy('score', 'desc')
            ->take(10)
            ->get(['name', 'score', 'avatar']); 

        $formattedUsers = $users->map(function ($user) {
            return [
                'name' => $user->name,
                'score' => $user->score,
                'avatar' => $user->avatar ? asset('storage/' . $user->avatar) : null,
            ];
        });

        return response()->json($formattedUsers);
    }
}