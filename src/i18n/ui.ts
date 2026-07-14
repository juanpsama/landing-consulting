// src/i18n/ui.ts
export const languages = {
  en: 'English',
  es: 'Español',
};

export const showDefaultLang = false;
export const defaultLang = 'es';

export const ui = {
  es: {
    'site.title': 'Grupo Garpe | Desarrollo, Consultoría y Automatización',
    'site.description': 'Ayudamos a las empresas a crecer con tecnología moderna, automatización inteligente y asesoría estratégica a medida.',
    'hero.title': 'Desarrollo, Consultoría y Automatización digital para empresas',
    'hero.subtitle': 'Impulsa tu negociocon software a medida, automatización de procesos y consultoría tecnológica. Optimizamos tu operación para que te enfoques en crecer.',
    'hero.cta': 'Empezar',
    'hero.services': 'Ver servicios',
    'nav.solutions': 'Soluciones',
    'nav.blog': 'Blog',
    'nav.contact': 'Contacto',
    'nav.customers': 'Clientes',
    'footer.tagline': 'Grupo Garpe — Desarrollo, Consultoría y Automatización',
    'footer.desc': 'Ayudamos a las empresas a crecer con tecnología moderna, automatización inteligente y asesoría estratégica.',
    'footer.pages': 'Páginas',
    'footer.socials': 'Redes sociales',
    'footer.legal': 'Aviso legal',
    'footer.tos': 'Términos del servicio',
    'footer.privacy': 'Política de privacidad',
    'footer.cookies': 'Política de cookies',
    'footer.solutions': 'Soluciones',
    'footer.about': 'Empresa',
    'footer.copyright': '© {year} Grupo Garpe. Todos los derechos reservados.',
    // Team member page
    'member.greeting': '¡Hola! Soy {name}',
    'member.subtitle': 'Guarda mi contacto directo para hablar sobre el motor tecnológico de tu negocio.',
    'member.modal_button': '📥 Guardar en mis contactos',
    'member.modal_close': 'Cerrar e ir a mi perfil completo',
    'member.slogan': 'Deja de hacer todo a mano!... te ayudamos a automatizar y a adoptar la tecnologia en tu negocio.',
    // 404 page
    '404.title': 'Esta página no existe',
    '404.description': 'El enlace que buscas puede haber cambiado o ya no está disponible. Mientras tanto, te ayudamos a volver a un entorno estable.',
    '404.badge': 'RUTA NO ENCONTRADA',
    '404.highlight': 'todavía',
    '404.primary_btn': 'Volver al inicio',
    '404.secondary_btn': 'Explorar servicios',
    // Contact section
    'contact.title': 'Contáctanos',
    'contact.subtitle': 'Cuéntanos sobre tu proyecto y te ayudaremos a encontrar la mejor solución.',
    'contact.name': 'Nombre',
    'contact.email': 'Correo electrónico',
    'contact.phone': 'Teléfono',
    'contact.message': 'Mensaje',
    'contact.send': 'Enviar mensaje',
    'contact.whatsapp': 'WhatsApp',

  },
  en: {
    'site.title': 'Grupo Garpe | Development, Consulting & Automation',
    'site.description': 'We help businesses and SMEs grow with modern technology, smart workflow automation, and custom strategic consulting.',
    'hero.title': 'Development, Consulting & Automation for SMBs',
    'hero.subtitle': 'Scale your SME with custom software, workflow automation, and strategic tech consulting. We optimize your operations so you can focus on growth.',
    'hero.cta': 'Get started',
    'hero.services': 'Explore services',
    'nav.solutions': 'Solutions',
    'nav.blog': 'Blog',
    'nav.contact': 'Contact',
    'nav.customers': 'Customers',
    'footer.tagline': 'Grupo Garpe — Development, Consulting & Automation',
    'footer.desc': 'We help businesses grow with modern technology, smart automation, and strategic consulting.',
    'footer.pages': 'Pages',
    'footer.socials': 'Socials',
    'footer.legal': 'Legal',
    'footer.tos': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.cookies': 'Cookie Policy',
    'footer.solutions': 'Solutions',
    'footer.about': 'Company',
    'footer.copyright': '© {year} Grupo Garpe. All rights reserved.',
    // Team member page
    'member.greeting': 'Hi! I\'m {name}',
    'member.subtitle': 'Save my direct contact to talk about the technological engine of your business.',
    'member.modal_button': '📥 Save to Contacts',
    'member.modal_close': 'Close and view full profile',
    'member.slogan': 'Leave the manual work behind!... We help you automate and adopt technology in your business.',
    // 404 page
    '404.title': 'This page doesn\'t  exist',
    '404.description': 'The link you are looking for may have changed or is no longer available. In the meantime, we help you return to a stable environment.',
    '404.badge': 'PAGE NOT FOUND',
    '404.highlight': 'yet',
    '404.primary_btn': 'Go back to home',
    '404.secondary_btn': 'Explore services',
    // Contact section
    'contact.title': 'Contact us',
    'contact.subtitle': 'Tell us about your project and we\'ll help you find the best solution.',
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.phone': 'Phone',
    'contact.message': 'Message',
    'contact.send': 'Send message',
    'contact.whatsapp': 'WhatsApp',
  },
} as const;

export type Lang = keyof typeof ui;
