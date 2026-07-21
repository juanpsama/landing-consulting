// src/pages/api/contact.ts
import type { APIRoute } from "astro";
import { Resend } from "resend";
import { env } from "cloudflare:workers";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const RESEND_API_KEY = env.RESEND_API_KEY || import.meta.env.RESEND_API_KEY;
    const EMAIL_TO = (env.EMAIL_TO || import.meta.env.EMAIL_TO || "samajpablo@gmail.com")
      .split(",")
      .map((e: string) => e.trim())
      .filter(Boolean);

    console.log("RESEND_API_KEY presente:", !!RESEND_API_KEY);
    console.log("EMAIL_TO length:", EMAIL_TO.length, "JSON:", JSON.stringify(EMAIL_TO));

    if (!RESEND_API_KEY) {
      console.error("Falta RESEND_API_KEY en env");
      return new Response(JSON.stringify({ error: "Falta la API Key de Resend" }), { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);
    const formData = await request.formData();

    const getString = (key: string) => {
      const value = formData.get(key);
      return typeof value === "string" ? value : "";
    };

    const name = getString("name");
    const email = getString("email");
    const phone = getString("phone");
    const message = getString("message");

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const html = `
    <h2>Nuevo mensaje de contacto</h2>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ""}
    <p><strong>Mensaje:</strong></p>
    <p>${message}</p>
  `;

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: EMAIL_TO,
      subject: `Contacto: ${name}`,
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
