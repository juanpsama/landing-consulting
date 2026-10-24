// src/pages/api/vcard/[member].ts
import type { APIRoute } from "astro";
import teamMembers from "../../../data/members.json";

const escapeVCard = (val: string | null | undefined): string => {
  if (!val) return "";
  return val
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
};

export const GET: APIRoute = async ({ params, request }) => {
  const memberSlug = params.member || "";
  const member = Object.prototype.hasOwnProperty.call(teamMembers, memberSlug)
    ? teamMembers[memberSlug as keyof typeof teamMembers]
    : null;

  const url = new URL(request.url);
  const currentOrigin = url.origin;

  if (import.meta.env.DEV) {
    console.log(
      `[vCard API] Generating contact for: "${memberSlug}" on origin: ${currentOrigin}`,
    );
  }

  if (!member) {
    return new Response("Contacto no encontrado / Contact not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const fullName = [member.name, member.lastName, member.mothersLastName]
    .filter(Boolean)
    .join(" ");

  // RFC 2426 vCard 3.0 Standard
  const vcardLines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN;CHARSET=UTF-8:${escapeVCard(fullName)}`,
    `N;CHARSET=UTF-8:${escapeVCard(member.lastName)};${escapeVCard(member.name)};${escapeVCard(member.mothersLastName || "")};;`,
    `TITLE;CHARSET=UTF-8:${escapeVCard(member.role)}`,
    "ORG;CHARSET=UTF-8:Grupo Garpe",
    `TEL;TYPE=CELL:${escapeVCard(member.phone)}`,
    `EMAIL;TYPE=INTERNET:${escapeVCard(member.email)}`,
    `URL:${currentOrigin}`,
    "END:VCARD",
  ];
  const vcardText = vcardLines.join("\r\n");

  return new Response(vcardText, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(memberSlug)}-contacto.vcf"`,
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    },
  });
};
