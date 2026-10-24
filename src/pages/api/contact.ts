// src/pages/api/contact.ts
import type { APIRoute } from "astro";
import { Resend } from "resend";
import { env } from "cloudflare:workers";

export const prerender = false;

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const POST: APIRoute = async ({ request }) => {
  try {
    const RESEND_API_KEY = env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    const rawEmailTo = env.EMAIL_TO || import.meta.env.EMAIL_TO || "samajpablo@gmail.com";
    const EMAIL_TO = (typeof rawEmailTo === "string" ? rawEmailTo : "")
      .split(",")
      .map((e: string) => e.replace(/['"]/g, "").trim())
      .filter(Boolean);

    if (import.meta.env.DEV) {
      console.log("RESEND_API_KEY presente:", !!RESEND_API_KEY);
      console.log("EMAIL_TO length:", EMAIL_TO.length, "JSON:", JSON.stringify(EMAIL_TO));
    }

    if (!RESEND_API_KEY) {
      console.error("Falta RESEND_API_KEY en env");
      return new Response(JSON.stringify({ error: "Falta la API Key de Resend" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resend = new Resend(RESEND_API_KEY);
    const formData = await request.formData();

    const getString = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value.trim() : "";
    };

    const name = getString("name").slice(0, 100);
    const email = getString("email").slice(0, 254);
    const phone = getString("phone").slice(0, 50);
    const message = getString("message").slice(0, 5000);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !message || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Missing required fields or invalid email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const cleanSubject = `Contacto: ${name.replace(/[\r\n]+/g, " ")}`;
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeMessageHtml = escapeHtml(message).replace(/\n/g, "<br>");

    const html = `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${safeName}</p>
      <p><strong>Email:</strong> ${safeEmail}</p>
      ${safePhone ? `<p><strong>Teléfono:</strong> ${safePhone}</p>` : ""}
      <p><strong>Mensaje:</strong></p>
      <p>${safeMessageHtml}</p>
    `;

    const { error } = await resend.emails.send({
      from: "admin@grupogarpe.com",
      to: EMAIL_TO,
      subject: cleanSubject,
      html,
      replyTo: email,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unhandled error in /api/contact:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
