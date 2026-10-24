// src/utils/schemaBuilder.ts
import membersData from '../data/members.json';
import servicesData from '../data/services.json';
import type { SeoData, ServicesData } from '../types/data';

export function generateOrganizationSchema(
    seoData: SeoData,
    localizedUi: Record<string, string>,
    currentLang: string
) {
    const typedServices = servicesData as ServicesData;

    // 1. Array de Empleados
    const employeeArray = Object.entries(membersData).map(([slug, data]) => {
        return {
            "@type": "Person",
            "name": [data.name, data.lastName, data.mothersLastName].filter(Boolean).join(' '),
            "jobTitle": localizedUi[`role.${slug}`] || data.role,
            "url": `https://${seoData.domain}/${currentLang}/team/${slug}`,
            "worksFor": {
                "@type": "Organization",
                "name": seoData.business_name
            }
        };
    });

    // 2. Extraemos los servicios del idioma actual
    const currentServices = typedServices[currentLang]?.services ?? [];

    // 3. Array de Servicios (Ofertas)
    const offersArray = currentServices.map((service) => ({
        "@type": "Offer",
        "itemOffered": {
            "@type": "Service",
            "name": service.title,
            "description": service.schema_description || service.description
        }
    }));

    // 4. Retornamos el schema ensamblado
    return {
        "@context": "https://schema.org",
        "@type": ["Organization", "ITService"],
        "name": seoData.business_name,
        "url": `https://${seoData.domain}`,
        "logo": `https://${seoData.domain}/favicon.svg`,
        "image": `https://${seoData.domain}${seoData.thumbnail || '/garpe-thumbnail.jpg'}`,
        "description": localizedUi['schema.description'],
        "slogan": localizedUi['schema.slogan'],
        "makesOffer": offersArray,
        "employee": employeeArray,
        "sameAs": seoData.socials || []
    };
}
