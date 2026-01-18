<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Owner has access to everything
        if ($user->role === 'owner') {
            return $next($request);
        }

        // Check if user's role is in allowed roles
        if (in_array($user->role, $roles)) {
            return $next($request);
        }

        // Redirect to beranda if not authorized
        return redirect()->route('beranda')->with('error', 'Anda tidak memiliki akses ke halaman tersebut.');
    }
}
