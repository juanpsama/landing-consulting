// src/pages/go/[slug].ts

export const prerender = false;

import type { APIRoute } from 'astro';
import { teamMembers, generalShortLinks } from '../../data/links';

export const GET: APIRoute = async ({ params }) => {
    const slug = params.slug?.toLowerCase() || "";

    console.log(`Redirection request for slug: ${slug}`);

    const member = teamMembers[slug];

    console.log(`Found team member: ${member ? member.name : 'No member found'}`);

    if (member) {
        const htmlWithPreview = `<!DOCTYPE html>
            <html lang="es">
            <head>
            <meta charset="utf-8">
            <title>${member.name} | Grupo Garpe</title>
            
            <meta property="og:title" content="${member.name}">
            <meta property="og:description" content="${member.role} — Tecnología que escala con tu negocio.">
            <meta property="og:image" content="https://grupogarpe.com${member.avatarUrl}">
            <meta property="og:type" content="profile">
            
            <meta http-equiv="refresh" content="0;url=https://grupogarpe.com/es/team/${slug}?action=vcard">
            </head>
            <body style="background: #1A2333;">
            <script>window.location.replace("https://grupogarpe.com/es/team/${slug}?action=vcard");</script>
            </body>
            </html>`;

        return new Response(htmlWithPreview, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
    }

    // 2. ¿Es un enlace corto general de marketing?
    if (generalShortLinks[slug]) {
        console.log(`Found general short link: ${generalShortLinks[slug]}`);
        return new Response(null, {
            status: 301,
            headers: { 'Location': generalShortLinks[slug] }
        });
    }

    // 3. Fallback (Link no existe)
    return new Response(null, {
        status: 302,
        headers: { 'Location': 'https://grupogarpe.com/404' }
    });
}