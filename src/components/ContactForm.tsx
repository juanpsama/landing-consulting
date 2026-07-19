import { useState } from "preact/hooks";

interface Labels {
  name: string;
  email: string;
  phone: string;
  message: string;
  send: string;
  success: string;
  error: string;
}

const inputClass =
  "w-full bg-canvas text-ink border border-hairline rounded-md px-4 h-10 text-base outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-colors";

export default function ContactForm({ labels }: { labels: Labels }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "fail">(
    "idle",
  );

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(form),
      });

      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("fail");
      }
    } catch {
      setStatus("fail");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div class="mb-4">
        <label class="block text-sm font-medium text-ink mb-1.5" for="name">
          {labels.name} <span class="text-brand-error">*</span>
        </label>
        <input class={inputClass} id="name" name="name" required type="text" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-ink mb-1.5" for="email">
          {labels.email} <span class="text-brand-error">*</span>
        </label>
        <input
          class={inputClass}
          id="email"
          name="email"
          required
          type="email"
        />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-ink mb-1.5" for="phone">
          {labels.phone}
        </label>
        <input class={inputClass} id="phone" name="phone" type="text" />
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-ink mb-1.5" for="message">
          {labels.message} <span class="text-brand-error">*</span>
        </label>
        <textarea
          class="w-full bg-canvas text-ink border border-hairline rounded-md p-4 h-32 text-base outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-colors resize-none"
          id="message"
          name="message"
          required
        />
      </div>

      {status === "ok" && (
        <p class="mb-4 text-center text-sm font-medium text-brand-green">
          {labels.success}
        </p>
      )}
      {status === "fail" && (
        <p class="mb-4 text-center text-sm font-medium text-brand-error">
          {labels.error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        class="bg-brand-green text-primary text-base font-semibold w-full rounded-lg py-3 px-6 text-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {status === "sending" ? (
          <>
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {labels.send}
          </>
        ) : (
          labels.send
        )}
      </button>
    </form>
  );
}
