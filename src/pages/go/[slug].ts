// src/pages/go/[slug].ts
import type { APIRoute } from 'astro';
import { generalShortLinks } from '../../data/links';

export const GET: APIRoute = async ({ params, request }) => {
    const slug = params.slug?.toLowerCase() || "";
    const url = new URL(request.url);

    // TRUCO SENIOR: Calculamos el origen dinámicamente (ej. "http://localhost:4321" o "https://grupogarpe.com")
    // Al usar url.origin, se adapta automáticamente al entorno en el que esté corriendo.
    const currentOrigin = url.origin;

    console.log(`[Router] Request for slug: "${slug}" on origin: ${currentOrigin}`);

    if (slug === "") {
        return new Response(null, {
            status: 302, // Usamos 302 temporal en desarrollo para evitar que el navegador cachee de forma agresiva
            headers: { 'Location': `${currentOrigin}` }
        });
    }

    // 3. ¿Es un enlace corto general de marketing?
    if (generalShortLinks[slug]) {
        // Validamos si es una ruta interna relativa para concatenar el origen dinámico
        const targetLocation = generalShortLinks[slug].startsWith('http')
            ? generalShortLinks[slug]
            : `${currentOrigin}${generalShortLinks[slug]}`;

        return new Response(null, {
            status: 302,
            headers: { 'Location': targetLocation }
        });
    }

    // 4. Fallback (Link no existe)
    return new Response(null, {
        status: 302,
        headers: { 'Location': `${currentOrigin}/404` }
    });
}