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
    'footer.tagline': 'Garpe — Desarrollo, Consultoría y Automatización',
    'footer.desc': 'Ayudamos a las empresas a crecer con tecnología moderna, automatización inteligente y asesoría estratégica.',
    'footer.solutions': 'Soluciones',
    'footer.about': 'Empresa',
    'footer.copyright': '© {year} Garpe. Todos los derechos reservados.',
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
    'footer.tagline': 'Garpe — Development, Consulting & Automation',
    'footer.desc': 'We help businesses grow with modern technology, smart automation, and strategic consulting.',
    'footer.solutions': 'Solutions',
    'footer.about': 'Company',
    'footer.copyright': '© {year} Garpe. All rights reserved.',
  },
} as const;

export type Lang = keyof typeof ui;
