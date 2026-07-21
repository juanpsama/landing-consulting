// src/env.d.ts

// 1. Tipamos las variables de entorno de Cloudflare Workers (Producción)
declare namespace App {
    interface Locals {
        runtime: {
            env: {
                RESEND_API_KEY: string;
                EMAIL_TO: string | string[];
            };
        };
    }
}

type Env = {
    RESEND_API_KEY: string;
    EMAIL_TO: string | string[];
};

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
    interface Locals extends Runtime { }
}