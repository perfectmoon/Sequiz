<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SessionTimeout
{
    protected int $idleTimeout = 60; 
    protected int $absTimeout = 12; 


    public function handle(Request $request, Closure $next)
    {
        if (! Auth::check()) {
            return $next($request);
        }

        $now = now();

        $lastActivity = session('lastActivity');
        $loginTime = session('loginTime');

        if ($lastActivity && $now->diffInMinutes($lastActivity) >= $this->idleTimeout) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'login' => 'You were logged out due to inactivity',
            ]);
        }

        if ($loginTime && $now->diffInHours($loginTime) >= $this->absTimeout) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'login' => 'Your session has expired',
            ]);
        }

        if (!$loginTime) {
            session(['loginTime' => $now]);
        }

        session(['lastActivity' => $now]);
        return $next($request);
    }
}
