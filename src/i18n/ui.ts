export const languages = {
  en: 'English',
  es: 'Español',
};

export const showDefaultLang = false;
export const defaultLang = 'es';

export const ui = {
  es: {
    'hero.title': 'Desarrollo, Consultoría y Automatización digital para empresas',
    'hero.subtitle': 'Impulsa tu PyME con software a medida, automatización de procesos y consultoría tecnológica. Optimizamos tu operación para que te enfoques en crecer.',
    'hero.cta': 'Empezar',
    'hero.services': 'Ver servicios',
    'nav.solutions': 'Soluciones',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.customers': 'Clientes',
    'footer.tagline': 'Grupo Garpe — Desarrollo, Consultoría y Automatización',
    'footer.desc': 'Ayudamos a las empresas a crecer con tecnología moderna, automatización inteligente y asesoría estratégica.',
    'footer.solutions': 'Soluciones',
    'footer.about': 'Empresa',
    'footer.copyright': '© {year} Grupo Garpe. Todos los derechos reservados.',
  },
  en: {
    'hero.title': 'Development, Consulting & Automation for SMBs',
    'hero.subtitle': 'Scale your SME with custom software, workflow automation, and strategic tech consulting. We optimize your operations so you can focus on growth.',
    'hero.cta': 'Get started',
    'hero.services': 'See services',
    'nav.solutions': 'Solutions',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.customers': 'Customers',
    'footer.tagline': 'Grupo Garpe — Development, Consulting & Automation',
    'footer.desc': 'We help businesses grow with modern technology, smart automation, and strategic consulting.',
    'footer.solutions': 'Solutions',
    'footer.about': 'Company',
    'footer.copyright': '© {year} Grupo Garpe. All rights reserved.',
  },
} as const;

export type Lang = keyof typeof ui;
