// src/pages/go/[slug].ts
import type { APIRoute } from 'astro';
import { generalShortLinks } from '../../data/links';
import { renderSVG } from 'uqr';

export const GET: APIRoute = async ({ params, request }) => {
    const slug = params.slug?.toLowerCase() || "";
    const url = new URL(request.url);
    const format = url.searchParams.get('format');

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

    const targetUrl = generalShortLinks[slug];

    // 3. ¿Es un enlace corto general de marketing?
    if (targetUrl) {
        if (format === 'qr') {
            try {
                // El QR debe apuntar al dominio corto oficial sin el parámetro de generación
                const shortUrl = `https://garpe.dev/${slug.toLowerCase()}`;

                const qrSvg = renderSVG(shortUrl, {
                    blackColor: '#1a2333',
                    whiteColor: '#ffffff00', // Transparente
                });

                return new Response(qrSvg, {
                    status: 200,
                    headers: {
                        'Content-Type': 'image/svg+xml',
                        'Cache-Control': 'public, max-age=31536000' // 1 año de caché
                    }
                });
            } catch (error) {
                return new Response(`Error interno al generar el QR: ${error}`, { status: 500 });
            }
        }

        // Validamos si es una ruta interna relativa para concatenar el origen dinámico
        const targetLocation = targetUrl.startsWith('http')
            ? targetUrl
            : `${currentOrigin}${targetUrl}`;

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