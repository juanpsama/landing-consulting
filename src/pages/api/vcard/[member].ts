// src/pages/api/vcard/[member].ts
import type { APIRoute } from "astro";
import { teamMembers } from "../../../data/links";

export const GET: APIRoute = async ({ params, request }) => {
  const memberSlug = params.member || "";
  const member = teamMembers[memberSlug];

  // Obtenemos el origen de la petición en tiempo de ejecución (localhost o dominio real)
  const url = new URL(request.url);
  const currentOrigin = url.origin;

  console.log(
    `[vCard API] Generating contact for: "${memberSlug}" on origin: ${currentOrigin}`,
  );

  if (!member) {
    return new Response("Contacto no encontrado / Contact not found", {
      status: 404,
    });
  }

  // Sintaxis nativa del estándar vCard 3.0
  // Usamos el currentOrigin dinámico para el campo URL corporativo
  const vcardText = `BEGIN:VCARD
        VERSION:3.0
        FN:${member.name}
        TITLE:${member.role}
        ORG:Grupo Garpe
        TEL;TYPE=CELL:${member.phone}
        EMAIL:${member.email}
        URL:${currentOrigin}
        END:VCARD`;

  return new Response(vcardText, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${memberSlug}-contacto.vcf"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
};
