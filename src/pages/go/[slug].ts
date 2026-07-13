// src/pages/go/[slug].ts
import type { APIRoute } from 'astro';
import { teamMembers, generalShortLinks } from '../../data/links';

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

    // 2. ¿Es un miembro del equipo?
    const member = teamMembers[slug];
    if (member) {
        // Inyectamos currentOrigin de manera dinámica en los href, metas y scripts
        const htmlWithPreview = `<!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="utf-8">
            <title>${member.name} | Grupo Garpe</title>
            
            <meta property="og:title" content="${member.name}">
            <meta property="og:description" content="${member.role} — Tecnología que escala con tu negocio.">
            <meta property="og:image" content="${currentOrigin}${member.avatarUrl}">
            <meta property="og:type" content="profile">
            
            <meta http-equiv="refresh" content="0;url=${currentOrigin}/es/team/${slug}?action=vcard">
            </head>
            <body style="background: #1A2333;">
            <script>window.location.replace("${currentOrigin}/es/team/${slug}?action=vcard");</script>
            </body>
            </html>`;

        return new Response(htmlWithPreview, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
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