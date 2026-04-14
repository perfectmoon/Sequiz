<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request): RedirectResponse {
        $data = $request->validated();
        $login = trim($data['login']);
        $password = $data['password'];
        
        $isEmail = filter_var($login, FILTER_VALIDATE_EMAIL) !== false;
        $field = $isEmail ? 'email' : 'name';

        $user = User::where($field, $login)->first();

        if (! $user || !Hash::check($password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Invalid Credentials'],
            ]);
        }

        if (! $user->email_verified_at) {
            throw ValidationException::withMessages([
                'login' => ['Email not verified'],
            ]);
        }

        Auth::login($user, $request->boolean('remember'));
        
        $request->session()->regenerate();

        return redirect()->intended('/');
    }

    public function destroy(Request $request): RedirectResponse {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}