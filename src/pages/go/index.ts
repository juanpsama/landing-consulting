// src/pages/go/index.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {

    const url = new URL(request.url);
    const currentOrigin = url.origin;

    console.log(`Raíz de /go/ interceptada, redirigiendo a la landing ${currentOrigin}.`);
    return new Response(null, {
        status: 302,
        headers: {
            'Location': currentOrigin
        }
    });
}