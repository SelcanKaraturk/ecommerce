<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Öncelikle header veya query parametresinden locale al
        $locale = $request->header('X-Locale')
            ?? $request->query('locale')
            ?? 'en';

        // Sadece desteklenen diller
        if (!in_array($locale, ['en', 'tr'])) {
            $locale = 'en';
        }

        App::setLocale($locale);

        return $next($request);
    }
}
