<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\LevelController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\LeaderboardController;

/*
|--------------------------------------------------------------------------
| ROOT (IMPORTANT)
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return auth()->check()
        ? redirect('/dashboard')
        : redirect('/login');
});

/*
|--------------------------------------------------------------------------
| STATIC PAGES
|--------------------------------------------------------------------------
*/
Route::get('/about', fn () => Inertia::render('about'))->name('about');
Route::get('/features', fn () => Inertia::render('features'))->name('features');

/*
|--------------------------------------------------------------------------
| GUEST ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {

    Route::get('/register', fn () => Inertia::render('register'))->name("register");
    Route::post('/register', [RegisterController::class, 'store'])->middleware('throttle:5,1');

    Route::get('/login', fn () => Inertia::render('login'))->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->middleware('throttle:5,1');

    Route::get('/forgot-password', fn () => Inertia::render('forgotpassword'))->name('password.request');

    Route::post('/forgot-password', function (Request $request) {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        return $status === Password::RESET_LINK_SENT
            ? back()->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    })->name('password.email');

    Route::get('/reset-password/{token}', function (Request $request, string $token) {
        return Inertia::render('ResetPassword', [
            'token' => $token,
            'email' => $request->query('email'),
        ]);
    })->name('password.reset');

    Route::post('/reset-password', function (Request $request) {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? redirect()->route('login')->with('status', __($status))
            : back()->withErrors(['email' => __($status)]);
    })->name('password.update');

    Route::get('/verify-otp', [OtpController::class, 'show'])->name('otp.show');
    Route::post('/verify-otp', [OtpController::class, 'verify'])->name('otp.verify');
    Route::post('/otp/resend', [OtpController::class, 'resend'])->name('otp.resend');
});

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/timer', fn () => Inertia::render('timer'))->name('timer');
    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');

    /*
    |--------------------------------------------------------------------------
    | QUIZ
    |--------------------------------------------------------------------------
    */
    Route::controller(QuizController::class)->group(function () {
        Route::get('/quiz', 'show')->name('quiz.show');
        Route::post('/quiz/generate', 'generate')->name('quiz.generate');
        Route::post('/quiz/{session}/finish', 'finish')->name('quiz.finish');
    });

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD (MAIN HUB)
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | GAME ROUTES
    |--------------------------------------------------------------------------
    */

    // Archego (local static)
    Route::get('/play/archego', function () {
        return redirect('/games/archego/html/index.html');
    });

    // Obscurum (external Laravel di port 8001)
    Route::get('/play/obscurum', function () {
        return redirect('http://127.0.0.1:8001');
    });

    /*
    |--------------------------------------------------------------------------
    | OBSCURUM INTERNAL (kalau mau embed nanti)
    |--------------------------------------------------------------------------
    */
    Route::controller(LevelController::class)->group(function () {
        Route::get('/level/{level}', 'show')->name('levels.show');
        Route::post('/level/{level}/check', 'checkAnswer')->name('levels.check');
        Route::post('/level/{level}/hint', 'getHint')->name('levels.hint');
        Route::post('/reset-progress', 'resetProgress')->name('reset.progress');
        Route::get('/debug-points', 'showPoints')->name('debug.points');
        Route::get('/complete', 'complete')->name('levels.complete');
    });

});

/*
|--------------------------------------------------------------------------
| DEBUG
|--------------------------------------------------------------------------
*/
Route::get('/whoami', function () {
    return [
        'auth_id' => auth()->id(),
        'user' => auth()->user(),
        'session' => session()->all(),
    ];
});