<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\OtpController;
use App\Http\Controllers\LeaderboardController;

$staticPages = ['/', '/about', '/features'];
foreach ($staticPages as $page) {
    $name = ltrim($page, '/') ?: 'home';
    $file = $name === 'home' ? 'home' : $name;
    Route::get($page, fn () => Inertia::render($file))->name($name);
}

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
                $user->forceFill(['password' => Hash::make($password)])->save();
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

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    
    Route::post('/profile/update', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('/timer', fn () => Inertia::render('timer'))->name('timer');
    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');

    Route::controller(QuizController::class)->group(function () {
        Route::get('/quiz', 'show')->name('quiz.show');
        Route::post('/quiz/generate', 'generate')->name('quiz.generate');
        Route::post('/quiz/{session}/finish', 'finish')->name('quiz.finish'); 
    });

    Route::controller(TaskController::class)->group(function () {
        Route::get('/todolist', 'index')->name('todolist');
        Route::get('/schedule', 'schedule')->name('schedule');
        Route::post('/tasks', 'store');
        Route::put('/tasks/{task}', 'update');
        Route::delete('/tasks/{task}', 'destroy');
    });
});

Route::get('/whoami', function () {
    return [
        'auth_id' => auth()->id(),
        'user' => auth()->user(),
        'session' => session()->all(),
    ];
});