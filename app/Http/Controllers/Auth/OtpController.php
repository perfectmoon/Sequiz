<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class OtpController extends Controller
{
    protected int $maxAttempts   = 5;
    protected int $otpTtlMinutes = 10;
    protected int $resendLimit   = 3;

    private function otpKey(string $email): string
    {
        return "otp_register_{$email}";
    }

    private function attemptsKey(string $email): string
    {
        return "otp_register_{$email}_attempts";
    }

    private function expiresKey(string $email): string
    {
        return "otp_register_{$email}_expires";
    }

    private function resendKey(string $email): string
    {
        return "otp_register_{$email}_resend";
    }

    public function show(Request $request)
    {
        $email = session('otp_email');

        if (! $email) {
            return redirect()->route('login')
                ->withErrors(['login' => 'Missing verification context. Please log in or register again.']);
        }

        return inertia('OTPVerification', [
            'email'  => $email,
            'status' => session('success'),
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : [],
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'otp_code' => ['required', 'digits:6'],
        ]);

        $email = session('otp_email');

        if (! $email) {
            return back()->withErrors([
                'otp_code' => 'Session expired. Please request a new code or register again.',
            ]);
        }

        $otpKey      = $this->otpKey($email);
        $attemptsKey = $this->attemptsKey($email);
        $expiresKey  = $this->expiresKey($email);
        $resendKey   = $this->resendKey($email);

        $hashedOtp = session($otpKey);
        $expiresAt = (int) session($expiresKey, 0);

        if (! $hashedOtp || $expiresAt < now()->timestamp) {
            session()->forget([$otpKey, $attemptsKey, $expiresKey]);
            session()->save();

            return back()->withErrors([
                'otp_code' => 'Your code has expired. Please request a new one.',
            ]);
        }

        $attempts = (int) session($attemptsKey, 0);

        if ($attempts >= $this->maxAttempts) {
            session()->forget([$otpKey, $attemptsKey, $expiresKey, $resendKey]);
            session()->save();

            return back()->withErrors([
                'otp_code' => 'Too many incorrect attempts. A new code is required.',
            ]);
        }

        if (! Hash::check($request->otp_code, $hashedOtp)) {
            session([$attemptsKey => $attempts + 1]);
            session()->save();

            return back()->withErrors([
                'otp_code' => 'Invalid code. Please try again.',
            ]);
        }

        $user = User::where('email', $email)->first();

        if ($user) {
            if (! $user->email_verified_at) {
                $user->email_verified_at = now();
                $user->save();
            }

            auth()->login($user);
        }

        session()->forget(['otp_email', $otpKey, $attemptsKey, $expiresKey, $resendKey]);
        session()->save();

        return redirect('/')
            ->with('success', 'Your email has been verified successfully.');
    }

    public function resend(Request $request): RedirectResponse
    {
        $email = session('otp_email');

        if (! $email) {
            return redirect()->route('login')
                ->withErrors(['login' => 'Session expired. Please register or log in again.']);
        }

        $otpKey      = $this->otpKey($email);
        $attemptsKey = $this->attemptsKey($email);
        $expiresKey  = $this->expiresKey($email);
        $resendKey   = $this->resendKey($email);

        $count = (int) session($resendKey, 0);

        if ($count >= $this->resendLimit) {
            return back()->withErrors([
                'otp_code' => 'You have requested too many codes. Please try again later.',
            ]);
        }

        $otp = random_int(100000, 999999);

        session([
            $otpKey      => Hash::make((string) $otp),
            $attemptsKey => 0,
            $resendKey   => $count + 1,
            $expiresKey  => now()->addMinutes($this->otpTtlMinutes)->timestamp,
        ]);
        session()->save();

        Mail::raw("Your new Sequiz verification code is: {$otp}", function ($message) use ($email) {
            $message->to($email)
                ->subject('Your new Sequiz OTP Code');
        });

        return back()->with('success', 'We have resent your verification code.');
    }
}
