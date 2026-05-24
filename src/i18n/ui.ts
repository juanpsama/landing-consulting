export const languages = {
  en: 'English',
  es: 'Español',
};

export const showDefaultLang = false;
export const defaultLang = 'es';

export const ui = {
  es: {
    'hero.title': 'Desarrollo, Consultoría y Automatización para empresas',
    'hero.subtitle': 'Creamos software a medida, brindamos asesoría tecnológica estratégica y automatizamos flujos de trabajo — para que las pequeñas y medianas empresas se enfoquen en lo que importa.',
    'hero.cta': 'Empezar',
    'hero.services': 'Ver servicios',
    'nav.solutions': 'Soluciones',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.customers': 'Clientes',
  },
  en: {
    'hero.title': 'Development, Consulting & Automation for SMBs',
    'hero.subtitle': 'We build custom software, give strategic tech advice, and automate workflows — so small and medium businesses can focus on what matters.',
    'hero.cta': 'Get started',
    'hero.services': 'See services',
    'nav.solutions': 'Solutions',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.customers': 'Customers',
  },
} as const;

export type Lang = keyof typeof ui;
