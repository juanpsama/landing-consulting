// src/data/links.ts

export interface TeamMember {
    name: string;
    role: string;
    phone: string; // Sin espacios para el vcf
    email: string;
    avatarUrl: string | null; // Tu foto estilo dashboard en /public
}

// Registro estático del equipo
export const teamMembers: Record<string, TeamMember> = {
    "gabriel-ramon": {
        name: "Gabriel Ramón Cupil",
        role: "Lead Developer & Tech Consultant",
        phone: "+529611692718",
        email: "gabriel.ramon@grupogarpe.com",
        avatarUrl: null,
    },
    "juan-garcia": {
        name: "Juan García",
        role: "Project Manager",
        phone: "+529612519488",
        email: "juan.garcia@grupogarpe.com",
        avatarUrl: null,
    }
};

// Registro dinámico de links de marketing, repositorios, o redirecciones comunes
export const generalShortLinks: Record<string, string> = {
    "cozy-server": "https://cozy-server.grupogarpe.com/",
};