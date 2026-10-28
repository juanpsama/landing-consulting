import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

test("Suite de Pruebas: Migración a @phosphor-icons/web", async (t) => {
	await t.test("1. src/assets/icons/ no debe contener los 9 SVGs antiguos", () => {
		const iconsDir = path.join(rootDir, "src", "assets", "icons");
		const legacyIcons = [
			"book.svg",
			"chart.svg",
			"cloud.svg",
			"database.svg",
			"globe.svg",
			"lightbulb.svg",
			"link.svg",
			"monitor.svg",
			"refresh.svg",
		];

		if (fs.existsSync(iconsDir)) {
			const files = fs.readdirSync(iconsDir);
			const foundLegacy = legacyIcons.filter((icon) => files.includes(icon));
			assert.strictEqual(
				foundLegacy.length,
				0,
				`Se encontraron SVGs antiguos en src/assets/icons/: ${foundLegacy.join(", ")}`
			);
			const svgFiles = files.filter((f) => f.endsWith(".svg"));
			assert.strictEqual(
				svgFiles.length,
				0,
				`src/assets/icons/ aún contiene archivos SVG: ${svgFiles.join(", ")}`
			);
		}
	});

	await t.test("2. src/data/services.json debe mapear iconos válidos con clases ph-*", () => {
		const servicesJsonPath = path.join(rootDir, "src", "data", "services.json");
		assert.ok(fs.existsSync(servicesJsonPath), "src/data/services.json no existe");

		const rawData = fs.readFileSync(servicesJsonPath, "utf-8");
		const data = JSON.parse(rawData);

		const validIcons = new Set([
			"ph-desktop",
			"ph-globe",
			"ph-plugs-connected",
			"ph-arrows-clockwise",
			"ph-database",
			"ph-lightbulb",
			"ph-cloud-arrow-up",
			"ph-chart-bar",
			"ph-book-open",
		]);

		for (const lang of ["es", "en"]) {
			assert.ok(data[lang]?.services, `Faltan servicios en idioma '${lang}'`);
			for (const service of data[lang].services) {
				assert.ok(
					typeof service.icon === "string" && service.icon.startsWith("ph-"),
					`El servicio '${service.title}' (${lang}) tiene icono '${service.icon}', el cual debe empezar con 'ph-'`
				);
				assert.ok(
					validIcons.has(service.icon),
					`El icono '${service.icon}' en servicio '${service.title}' (${lang}) no es uno de los iconos Phosphor permitidos: ${[...validIcons].join(", ")}`
				);
			}
		}
	});

	await t.test("3. src/components/ServicesSection.astro no debe importar SVGs crudos", () => {
		const filePath = path.join(rootDir, "src", "components", "ServicesSection.astro");
		assert.ok(fs.existsSync(filePath), "src/components/ServicesSection.astro no existe");

		const content = fs.readFileSync(filePath, "utf-8");

		assert.doesNotMatch(
			content,
			/\.svg\?raw/,
			"ServicesSection.astro no debe tener imports con '?raw' de SVGs"
		);
		assert.doesNotMatch(
			content,
			/assets\/icons/,
			"ServicesSection.astro no debe referenciar '../assets/icons/'"
		);
	});

	await t.test("4. src/components/ServiceCard.astro debe renderizar etiquetas <i class='ph ...'> sin set:html", () => {
		const filePath = path.join(rootDir, "src", "components", "ServiceCard.astro");
		assert.ok(fs.existsSync(filePath), "src/components/ServiceCard.astro no existe");

		const content = fs.readFileSync(filePath, "utf-8");

		assert.doesNotMatch(
			content,
			/set:html=\{icon\}/,
			"ServiceCard.astro no debe usar 'set:html={icon}' para renderizar iconos"
		);
		assert.match(
			content,
			/<i\s+[^>]*class=[^>]*ph/i,
			"ServiceCard.astro debe renderizar un elemento <i class=\"ph ...\">"
		);
	});

	await t.test("5. src/components/ContactForm.tsx no debe contener SVG inline de spinner y debe usar ph-circle-notch", () => {
		const filePath = path.join(rootDir, "src", "components", "ContactForm.tsx");
		assert.ok(fs.existsSync(filePath), "src/components/ContactForm.tsx no existe");

		const content = fs.readFileSync(filePath, "utf-8");

		assert.doesNotMatch(
			content,
			/<svg[\s>]/,
			"ContactForm.tsx no debe tener elementos <svg> inline para el spinner"
		);
		assert.match(
			content,
			/ph-circle-notch/,
			"ContactForm.tsx debe usar la clase 'ph-circle-notch' para el spinner"
		);
	});

	await t.test("6. src/styles/global.css debe incluir @import de @phosphor-icons/web/fill", () => {
		const filePath = path.join(rootDir, "src", "styles", "global.css");
		assert.ok(fs.existsSync(filePath), "src/styles/global.css no existe");

		const content = fs.readFileSync(filePath, "utf-8");

		assert.match(
			content,
			/@import\s+["']@phosphor-icons\/web\/fill["'];?/,
			"global.css debe incluir '@import \"@phosphor-icons/web/fill\";'"
		);
	});

	await t.test("7. src/pages/sistemas-de-ventas.astro no debe contener enlaces CDN de jsDelivr para Phosphor", () => {
		const filePath = path.join(rootDir, "src", "pages", "sistemas-de-ventas.astro");
		assert.ok(fs.existsSync(filePath), "src/pages/sistemas-de-ventas.astro no existe");

		const content = fs.readFileSync(filePath, "utf-8");

		assert.doesNotMatch(
			content,
			/jsdelivr.*phosphor/i,
			"sistemas-de-ventas.astro no debe contener links CDN a jsDelivr de Phosphor"
		);
	});
});
