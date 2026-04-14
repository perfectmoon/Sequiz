import React from "react";
import { Head } from "@inertiajs/react";

export default function DatabaseDown({ message }) {
    return (
        <>
            <Head title="Database Offline" />

            <div className="min-h-screen flex items-center justify-center bg-slate-950/80">
                <div className="max-w-lg w-full mx-4 rounded-2xl bg-neutral-900/90 border border-slate-700 shadow-2xl shadow-blue-900/40 p-8 text-slate-100">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-900/30 border border-green-500/60 text-[11px] font-semibold uppercase tracking-[0.18em] mb-4">
                        <span className="w-2 h-2 rounded-full bg-red-700 shadow-[0_0_0_6px_rgba(248,113,113,0.25)]" />
                        Database Offline
                    </div>

                    <h1 className="text-2xl font-semibold mb-2">
                        Database Belum Dinyalakan
                    </h1>

                    <p className="text-sm text-slate-300 mb-1">
                        Aplikasi tidak bisa terhubung ke database saat ini.
                    </p>
                    <p className="text-sm text-slate-300 mb-4">
                        Pastikan service <span className="font-semibold">MySQL / MariaDB</span> sudah berjalan, lalu refresh halaman ini.
                    </p>

                    {message && (
                        <p className="text-xs text-slate-400 italic mb-4">
                            Detail: {message}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-[1.01] active:scale-100 transition-transform transition-shadow duration-150"
                    >
                        Refresh Page
                    </button>

                    <div className="mt-6 text-xs text-left text-slate-400 space-y-1">
                        <p className="font-semibold text-slate-300">
                            Kalau kamu di lokal (XAMPP / Laragon / Docker):
                        </p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>Buka control panel (XAMPP, Laragon, Docker, dsb.).</li>
                            <li>Start service <span className="font-semibold">MySQL</span> / <span className="font-semibold">MariaDB</span>.</li>
                            <li>
                                Cek kembali konfigurasi di file <code className="bg-slate-800 px-1.5 py-0.5 rounded-md">.env</code>:
                                <br />
                                <span className="font-mono text-[11px]">
                                    DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
                                </span>
                            </li>
                        </ol>

                        <p className="pt-2 text-[11px] text-slate-500">
                            Halaman ini muncul khusus saat koneksi database gagal
                            (contoh: server DB mati atau port salah), supaya user nggak lihat stack trace jelek.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
