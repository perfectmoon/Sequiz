<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckDatabaseConnection
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $msg = $e->getMessage();

            $isConnectionError =
                str_contains($msg, 'SQLSTATE[HY000] [2002]') ||
                str_contains($msg, 'Connection refused') ||
                str_contains($msg, 'No connection could be made');

            $isUnknownDatabase =
                str_contains($msg, 'Unknown database') ||
                str_contains($msg, 'SQLSTATE[42000] [1049]');

            if ($isConnectionError || $isUnknownDatabase) {
                $friendlyMessage = $isConnectionError
                    ? 'Aplikasi tidak bisa terhubung ke database. Pastikan service MySQL / MariaDB sudah berjalan.'
                    : 'Database yang dikonfigurasi belum ada atau salah nama. Cek kembali DB_DATABASE di file .env.';

                return Inertia::render('DatabaseDown', [
                    'message' => $friendlyMessage,
                ])->toResponse($request)->setStatusCode(503);
            }

            throw $e;
        }

        return $next($request);
    }
}
