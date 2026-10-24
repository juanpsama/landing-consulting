// src/pages/go/[slug].ts
import type { APIRoute } from 'astro';
import { generalShortLinks } from '../../data/links';
import { renderSVG } from 'uqr';

export const GET: APIRoute = async ({ params, request }) => {
    const slug = (params.slug || "").toLowerCase();
    const url = new URL(request.url);
    const format = url.searchParams.get('format');
    const currentOrigin = url.origin;

    if (import.meta.env.DEV) {
        console.log(`[Router] Request for slug: "${slug}" on origin: ${currentOrigin}`);
    }

    if (slug === "") {
        return new Response(null, {
            status: 302,
            headers: {
                'Location': currentOrigin,
                'Cache-Control': 'no-cache',
            }
        });
    }

    const hasLink = Object.prototype.hasOwnProperty.call(generalShortLinks, slug);
    const targetUrl = hasLink ? generalShortLinks[slug] : null;

    if (targetUrl) {
        if (format === 'qr') {
            try {
                const shortUrl = `https://garpe.dev/${slug}`;

                const qrSvg = renderSVG(shortUrl, {
                    blackColor: '#1a2333',
                    whiteColor: '#ffffff00',
                });

                return new Response(qrSvg, {
                    status: 200,
                    headers: {
                        'Content-Type': 'image/svg+xml',
                        'Cache-Control': 'public, max-age=31536000, immutable'
                    }
                });
            } catch (error) {
                return new Response(`Error interno al generar el QR: ${error}`, {
                    status: 500,
                    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
                });
            }
        }

        const targetLocation = targetUrl.startsWith('http')
            ? targetUrl
            : `${currentOrigin}${targetUrl}`;

        return new Response(null, {
            status: 301,
            headers: {
                'Location': targetLocation,
                'Cache-Control': 'public, max-age=3600, s-maxage=86400',
            }
        });
    }

    // Fallback: Link no existe (retornar 404 directo en vez de redirección)
    return new Response('Not Found', {
        status: 404,
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=60',
        }
    });
};
