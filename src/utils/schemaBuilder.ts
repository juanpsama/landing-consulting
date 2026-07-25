// src/utils/schemaBuilder.ts
import membersData from '../data/members.json';
import servicesData from '../data/services_0001.json';
import { defaultLang } from '../i18n/ui';

export function generateOrganizationSchema(seoData: any, localizedUi: any, currentLang: string) {

    // 1. Array de Empleados (Mantenemos la lógica anterior)
    const employeeArray = Object.entries(membersData).map(([slug, data]) => {
        const urlPrefix = currentLang === defaultLang ? '' : `${currentLang}/`;
        return {
            "@type": "Person",
            "name": data.name,
            "jobTitle": localizedUi[`role.${slug}`] || data.role,
            "url": `https://${seoData.domain}/${urlPrefix}${slug}`,
            "worksFor": {
                "@type": "Organization",
                "name": seoData.business_name
            }
        };
    });

    // 2. Extraemos los servicios del idioma actual
    // Usamos as keyof typeof servicesData para que TypeScript no se queje
    const currentServices = servicesData[currentLang as keyof typeof servicesData].services;

    // 3. Array de Servicios (Ofertas)
    const offersArray = currentServices.map((service) => ({
        "@type": "Offer",
        "itemOffered": {
            "@type": "Service",
            "name": service.title,
            // 🧠 LA MAGIA: Si existe schema_description lo usa, si no, usa el description visual
            "description": service.schema_description || service.description
        }
    }));

    // 4. Retornamos el schema ensamblado
    return {
        "@context": "https://schema.org",
        "@type": ["Organization", "ITService"],
        "name": seoData.business_name,
        "url": `https://${seoData.domain}`,
        "description": localizedUi['schema.description'], // Este sí viene de UI porque es global
        "slogan": localizedUi['schema.slogan'],
        "makesOffer": offersArray, // 🚀 Inyectamos los servicios super-vitaminados
        "employee": employeeArray,
        "sameAs": seoData.socials || []
    };
}