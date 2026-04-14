import React from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react'; 
import { Logo } from '../components/ui/attributes'; 

export default function OTPVerification({ email }) {
    const { errors } = usePage().props;

    const { data, setData, post, processing } = useForm({
        otp_code: '',
    });

    const userEmail = usePage().props?.email ?? "user@kocak.com";

    const submit = (e) => {
        e.preventDefault();
        post('/verify-otp', data);
    };

    const handleResend = () => {
        router.post("/otp/resend", {}, {
            onStart: () => setResending(true),
            onFinish: () => setResending(false),
        });
    };

    const [resending, setResending] = React.useState(false);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-12">
            <p
                onClick={() => window.history.back()}
                className="absolute top-3 left-18 text-white text-3xl font-bold cursor-pointer hover:opacity-80 mt-15"
            >
                ‹ back
            </p>

            <div className="flex flex-col items-center w-full pt-[60px] max-w-[600px] ">
                {/* <div className="w-[100px] h-[100px]">
                    <Logo/>
                </div> */}

                <div className="flex flex-col items-center bg-neutral-800/90 p-10 rounded-3xl shadow-2xl w-full border-2 text-green-400 border-[#00a424] min-h-[500px]">
                    <p className="text-green-400 text-2xl text-center justify-center mb-10 font-semibold">
                        Verify OTP
                    </p>

                    <form onSubmit={submit} className="flex flex-col w-full gap-6">
                        
                        <p className="text-sm text-center text-green-300">
                            Enter the 6-digit code sent to <br/>
                            <span className="font-semibold text-[#00a460]">{userEmail}</span>
                        </p>
                        
                        <input
                            type="text"
                            name="otp_code"
                            placeholder="Enter 6-Digit Code"
                            value={data.otp_code}
                            onChange={(e) => setData('otp_code', e.target.value.slice(0, 6))}
                            className="p-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 w-full text-center tracking-[0.3em] text-lg"
                            maxLength="6"
                            required
                        />

                        {errors?.otp_code && (
                            <p className="text-red-500 text-center text-sm mt-1">
                                {errors.otp_code}
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className={`mt-auto flex items-center justify-center gap-2 bg-[#0a8704] hover:bg-[#0ce02c] text-white text-lg py-3 rounded-2xl shadow-md active:scale-95 transition border-2 border-[#00a434]
                                ${resending ? "opacity-70 cursor-not-allowed" : ""}
                            `}
                        >
                            {resending ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending...
                                </div>
                            ) : (
                                "Resend Code"
                            )}
                        </button>
                        
                        <button 
                            type="submit"
                            disabled={processing}
                            className={`mt-auto bg-[#0a8704] hover:bg-[#0ce02c] text-white text-lg py-3 rounded-2xl shadow-md transition active:scale-95 border-2 border-[#00a434]
                                ${processing ? "opacity-70 cursor-not-allowed" : ""}
                            `}
                        >
                            {processing ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Verifying...
                                </div>
                            ) : (
                                "Verify"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
