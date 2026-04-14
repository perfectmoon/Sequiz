import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';
import { Logo } from '../components/ui/attributes';

export default function ResetPassword() {
    const { token, email, errors, status } = usePage().props;

    const { data, setData, post, processing } = useForm({
        token: token || '',
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-12">
            <Link
                href='/'
                className='absolute top-3 left-18 text-white text-3xl font-bold cursor-pointer hover:opacity-80 mt-15'
            >
                ‹ home
            </Link>

            <div className="flex flex-col items-center w-full max-w-[600px] pt-[120px] gap-7">
                {/* <div className="w-[100px] h-[100px]">
                    <Logo/>
                </div> */}

                <div className="flex flex-col items-center bg-neutral-800/90 text-green-400 p-10 rounded-3xl shadow-2xl w-full border-2 border-[#00a424]">
                    <p className="text-2xl text-center justify-center mb-4 font-semibold">
                        Set a New Password For {email}
                    </p>

                    {status && (
                        <p className="text-green-600 text-sm text-center mb-4">
                            {status}
                        </p>
                    )}

                    {errors && errors.email && (
                        <p className="text-red-500 text-sm text-center mb-2">
                            {errors.email}
                        </p>
                    )}

                    <form onSubmit={submit} className="flex flex-col w-full gap-4">
                        <input
                            type="password"
                            name="password"
                            placeholder="New Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="p-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 w-full"
                            required
                        />

                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="Confirm Password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="p-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 w-full"
                            required
                        />

                        {errors && errors.password && (
                            <p className="text-red-500 text-sm text-center">
                                {errors.password}
                            </p>
                        )}

                        <button
                            disabled={processing}
                            className={`mt-auto bg-[#0a8704] hover:bg-[#0ce02c] text-white text-lg py-3 rounded-2xl shadow-md transition active:scale-95 border-2 border-[#00a434]
                                ${processing ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {processing ? 'Updating...' : 'Reset Password'}
                        </button>

                        <div className="flex justify-center text-sm text-[#029a2f] mt-3">
                            <p>Remember your password?</p>
                            <Link href="/login" className="ml-2 underline hover:opacity-75">
                                Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}