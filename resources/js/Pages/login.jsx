import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { Logo } from '../components/ui/attributes';

export default function Login() {
    const { errors } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        router.post(
            '/login',
            {
                login: formData.username,
                password: formData.password,
            },
            {
                onFinish: () => {
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen pt-8">
            <p
                onClick={() => window.history.back()}
                className="absolute top-3 left-18 text-white text-3xl font-bold cursor-pointer hover:opacity-80 mt-15"
            >
                ‹ back
            </p>

            <div className="flex flex-col items-center w-full max-w-[600px] pt-[60px]">
                {/* <div className="w-[100px] h-[100px]">
                    <Logo/>
                </div> */}

                <div className="flex flex-col items-center bg-neutral-900/90 p-10 rounded-3xl shadow-2xl w-full border-2 text-green-400 border-[#00a424] min-h-[500px]">
                    <p className="text-2xl text-center justify-center mb-10 font-semibold">
                        Login to your account!
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
                        <input
                            type="text"
                            name="username"
                            placeholder="Username / Email"
                            value={formData.username}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 w-full"
                            required
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="p-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-green-400 w-full mb-28"
                            required
                        />

                        {errors?.login && (
                            <p className="text-red-500 -mt-6">{errors.login}</p>
                        )}

                        <div className="flex flex-col items-start text-sm text-[#029a2f] mt-2">
                            <div className="flex items-center gap-2">
                                <p className="mb-3">Don’t have an account?</p>
                                <Link href="/register" className="underline mb-3 cursor-pointer hover:opacity-75">
                                    Register here
                                </Link>
                            </div>

                            <Link href="/forgot-password" className="underline mb-2 cursor-pointer hover:opacity-75">
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`mt-auto flex items-center justify-center gap-2 bg-[#0a8704] hover:bg-[#0ce02c] text-white text-lg py-3 rounded-2xl shadow-md active:scale-95 transition border-2 border-[#00a434]
                                ${isLoading ? "opacity-70 cursor-not-allowed" : ""}
                            `}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Logging in...
                                </>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
