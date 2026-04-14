import React from 'react';
import { Link, useForm, usePage } from '@inertiajs/react'; 
import { Mail } from 'lucide-react'; 
import { Logo } from '../components/ui/attributes'; 

export default function ForgotPassword({ onNavigate }) { 
    const { data, setData, post, processing } = useForm({
        email: '',
    });

    const { errors, status, flash } = usePage().props || {};

    const submit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    const success_msg = (flash && flash.success) || status || '';

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-12">
            <p onClick={() => window.history.back()}
            className="absolute top-3 left-18 text-white text-3xl font-bold cursor-pointer hover:opacity-80 mt-15">
            ‹ back
            </p>
        
            <div className="flex flex-col items-center w-full max-w-[600px] pt-[120px] gap-7">
                {/* <div className="w-[100px] h-[100px]">
                    <Logo/>
                </div> */}
            
                <div className="flex flex-col items-center bg-neutral-900/90 p-10 rounded-3xl shadow-2xl w-full border-2 border-[#00a41b]">
                <p className="text-green-400 text-2xl text-center justify-center mb-10 font-semibold">Reset Your Password!</p>
                {success_msg && (
                    <p className="text-green-600 text-sm text-center mb-4">
                        {success_msg}
                    </p>
                )}
                {errors && errors.email && (
                    <p className="text-red-500 text-sm text-center mb-2">
                        {errors.email}
                    </p>
                )}
                    <form onSubmit={submit} className="flex flex-col text-green-400 w-full gap-6">

                        <div className="relative">
                            <Mail className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="p-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 w-full pl-10"
                                required
                            />
                        </div>
                        <div className="flex flex-col items-start text-sm text-[#00a447] mt-2">
                             <div className="flex justify-start">
                                <p>Back to login?</p>
                                <Link href="/login" className="ml-2 underline cursor-pointer hover:opacity-75">
                                    Login
                                </Link>
                            </div>
                        </div>
                        
                        <button 
                        type="submit" 
                        disabled={processing}
                        className={`mt-auto flex items-center justify-center cursor-pointer gap-2 bg-[#0a8704] hover:bg-[#0ce02c] text-white text-lg py-3 rounded-2xl shadow-md active:scale-95 transition border-2 border-[#00a434]
                                ${processing ? "opacity-70 cursor-progress" : ""}
                            `}
                        >
                            {processing ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        
                    </form>
                </div>
            </div>
        </div>
    );
}