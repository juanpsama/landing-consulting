import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

test("Chaos & Adversarial Iconography Suite: Phosphor Icons & Services", async (t) => {
	// =========================================================================
	// 1. RESILIENCIA DE services.json Y REGLAS ADVERSARIALES
	// =========================================================================
	await t.test("1. Resiliencia de services.json frente a datos extremos y anomalías", async (t) => {
		const servicesJsonPath = path.join(rootDir, "src", "data", "services.json");
		assert.ok(fs.existsSync(servicesJsonPath), "src/data/services.json debe existir");

		const rawContent = fs.readFileSync(servicesJsonPath, "utf-8");

		await t.test("1.1 Integridad estructural y parseo JSON estricto", () => {
			assert.doesNotThrow(() => {
				JSON.parse(rawContent);
			}, "services.json debe ser JSON estrictamente válido sin errores de sintaxis");

			// Adversarial check: No debe haber caracteres nulos (\0) ni caracteres de control ocultos
			assert.ok(!rawContent.includes("\0"), "services.json no debe contener caracteres nulos (\\0)");
			assert.doesNotMatch(rawContent, /[\u0001-\u0008\u000B\u000C\u000E-\u001F]/, "No debe contener caracteres de control ilegales");
		});

		const data = JSON.parse(rawContent);

		await t.test("1.2 Ningún servicio tiene icono nulo, indefinido, vacío, espacios o payloads maliciosos", () => {
			for (const locale of ["es", "en"]) {
				const services = data[locale]?.services;
				assert.ok(Array.isArray(services), `Locale '${locale}' debe tener un array de servicios`);
				assert.ok(services.length > 0, `Locale '${locale}' debe tener al menos un servicio`);

				services.forEach((srv, idx) => {
					const ctx = `[locale=${locale}, index=${idx}, title='${srv.title}']`;

					// Null / Undefined check
					assert.notStrictEqual(srv.icon, null, `${ctx} Icono no debe ser null`);
					assert.notStrictEqual(srv.icon, undefined, `${ctx} Icono no debe ser undefined`);

					// Type check
					assert.strictEqual(typeof srv.icon, "string", `${ctx} Icono debe ser de tipo string`);

					// Empty / Whitespace check
					assert.ok(srv.icon.length > 0, `${ctx} Icono no debe ser string vacío`);
					assert.strictEqual(srv.icon.trim(), srv.icon, `${ctx} Icono no debe tener espacios al inicio ni al final ('${srv.icon}')`);
					assert.ok(!/\s/.test(srv.icon), `${ctx} Icono no debe contener espacios en blanco intermedios ('${srv.icon}')`);

					// Adversarial payload injections (XSS, HTML tags, quotes, backticks, script tags)
					assert.doesNotMatch(srv.icon, /[<>"'`/\\]/, `${ctx} Icono no debe contener caracteres de inyección HTML/XSS ('${srv.icon}')`);

					// Strict phosphor class regex
					assert.match(srv.icon, /^ph-[a-z0-9]+(?:-[a-z0-9]+)*$/, `${ctx} Icono '${srv.icon}' debe cumplir el patrón exacto ph-kebab-case`);
				});
			}
		});

		await t.test("1.3 Verificación contra catálogo oficial de @phosphor-icons/web (Detección de typos)", () => {
			const phosphorSelectionPath = path.join(
				rootDir,
				"node_modules",
				"@phosphor-icons",
				"web",
				"src",
				"regular",
				"selection.json"
			);
			assert.ok(fs.existsSync(phosphorSelectionPath), "El catálogo selection.json de Phosphor debe estar presente");

			const phosphorData = JSON.parse(fs.readFileSync(phosphorSelectionPath, "utf-8"));
			const officialIconNames = new Set(phosphorData.icons.map((i) => `ph-${i.properties.name}`));

			for (const locale of ["es", "en"]) {
				for (const service of data[locale].services) {
					assert.ok(
						officialIconNames.has(service.icon),
						`El icono '${service.icon}' en servicio '${service.title}' (${locale}) no existe en la biblioteca oficial de Phosphor (posible typo)`
					);
				}
			}
		});

		await t.test("1.4 Comprobación de que no hay iconos duplicados en el mismo catálogo de servicios", () => {
			for (const locale of ["es", "en"]) {
				const services = data[locale].services;
				const seenIcons = new Map();

				for (const service of services) {
					assert.ok(
						!seenIcons.has(service.icon),
						`Icono duplicado '${service.icon}' detectado en '${service.title}' (previamente usado en '${seenIcons.get(service.icon)}') en locale '${locale}'`
					);
					seenIcons.set(service.icon, service.title);
				}
			}
		});

		await t.test("1.5 Simulación de estrés: el validador de servicios rechaza entradas adversariales", () => {
			const validateIcon = (icon) => {
				if (typeof icon !== "string") return false;
				if (icon.trim() !== icon) return false;
				if (icon.length === 0 || icon.length > 64) return false;
				if (!/^ph-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(icon)) return false;
				return true;
			};

			const adversarialAttacks = [
				null,
				undefined,
				"",
				" ",
				"   ",
				"\t",
				"\n",
				"ph-",
				"ph- ",
				" ph-database",
				"ph-database ",
				"ph-database<script>",
				"ph-database\" onclick=\"alert(1)",
				"ph-database' OR 1=1--",
				"ph-data_base",
				"ph-Data-Base",
				"ph-😀",
				"ph-".padEnd(2000, "a"),
				{},
				[],
				123,
				true,
				false,
				NaN,
				Infinity,
			];

			for (const badInput of adversarialAttacks) {
				assert.strictEqual(
					validateIcon(badInput),
					false,
					`El validador de iconos debe rechazar la entrada adversarial: ${JSON.stringify(badInput)}`
				);
			}

			// Asegurar que los iconos reales pasan la validación
			for (const locale of ["es", "en"]) {
				for (const s of data[locale].services) {
					assert.strictEqual(
						validateIcon(s.icon),
						true,
						`El icono válido '${s.icon}' debe ser aceptado por el validador`
					);
				}
			}
		});
	});

	// =========================================================================
	// 2. PARIDAD ESTRICTA ENTRE IDIOMAS (es vs en)
	// =========================================================================
	await t.test("2. Paridad estricta entre idiomas (es vs en)", async (t) => {
		const servicesJsonPath = path.join(rootDir, "src", "data", "services.json");
		const data = JSON.parse(fs.readFileSync(servicesJsonPath, "utf-8"));

		const esServices = data.es.services;
		const enServices = data.en.services;

		await t.test("2.1 Cardinalidad idéntica de servicios entre locales", () => {
			assert.strictEqual(
				esServices.length,
				enServices.length,
				`La cantidad de servicios debe ser exactamente igual (es: ${esServices.length}, en: ${enServices.length})`
			);
		});

		await t.test("2.2 Mapeo 1:1 de iconos por índice y correspondencia semántica", () => {
			for (let i = 0; i < esServices.length; i++) {
				const esSrv = esServices[i];
				const enSrv = enServices[i];

				assert.strictEqual(
					esSrv.icon,
					enSrv.icon,
					`Discrepancia de icono en el índice ${i}: 'es' tiene '${esSrv.icon}' (${esSrv.title}), pero 'en' tiene '${enSrv.icon}' (${enSrv.title})`
				);

				assert.strictEqual(
					esSrv.featured,
					enSrv.featured,
					`Discrepancia en 'featured' en el índice ${i} ('${esSrv.title}' vs '${enSrv.title}')`
				);
			}
		});

		await t.test("2.3 Ningún servicio queda sin icono al cambiar de locale", () => {
			const esIcons = new Set(esServices.map((s) => s.icon));
			const enIcons = new Set(enServices.map((s) => s.icon));

			const diffEsEn = [...esIcons].filter((icon) => !enIcons.has(icon));
			const diffEnEs = [...enIcons].filter((icon) => !esIcons.has(icon));

			assert.strictEqual(diffEsEn.length, 0, `Iconos presentes en 'es' pero ausentes en 'en': ${diffEsEn.join(", ")}`);
			assert.strictEqual(diffEnEs.length, 0, `Iconos presentes en 'en' pero ausentes en 'es': ${diffEnEs.join(", ")}`);
		});

		await t.test("2.4 Consistencia de campos y esquemas requeridos", () => {
			const requiredFields = ["icon", "title", "description", "schema_description", "featured"];

			for (const locale of ["es", "en"]) {
				data[locale].services.forEach((s, idx) => {
					for (const field of requiredFields) {
						assert.ok(
							field in s,
							`Servicio en índice ${idx} (${locale}) carece del campo obligatorio '${field}'`
						);
					}
				});
			}
		});
	});

	// =========================================================================
	// 3. RESILIENCIA EN BUILD DE TEMPLATES Y AUSENCIA DE "undefined"
	// =========================================================================
	await t.test("3. Resiliencia en build de templates e interpolación de clases", async (t) => {
		await t.test("3.1 ServiceCard.astro: Especificación de interfaz y robustez de renderizado", () => {
			const serviceCardPath = path.join(rootDir, "src", "components", "ServiceCard.astro");
			assert.ok(fs.existsSync(serviceCardPath), "src/components/ServiceCard.astro debe existir");

			const content = fs.readFileSync(serviceCardPath, "utf-8");

			// Verificar que `icon: string;` está tipado estrictamente en Props
			assert.match(
				content,
				/icon:\s*string;/,
				"ServiceCard.astro debe exigir 'icon: string;' como propiedad requerida"
			);

			// Verificar que la interpolación no admita 'ph undefined'
			assert.match(
				content,
				/<i\s+class=\{`ph \$\{icon\} text-2xl`\}>/i,
				"ServiceCard.astro debe renderizar <i class={`ph ${icon} text-2xl`}>"
			);
		});

		await t.test("3.2 ContactForm.tsx: Clases de spinner estáticas e inmunes a undefined", () => {
			const contactFormPath = path.join(rootDir, "src", "components", "ContactForm.tsx");
			assert.ok(fs.existsSync(contactFormPath), "src/components/ContactForm.tsx debe existir");

			const content = fs.readFileSync(contactFormPath, "utf-8");

			// Verificar que no se usen variables dinámicas para las clases del icono en el botón
			assert.match(
				content,
				/<i\s+class="ph-bold ph-circle-notch animate-spin text-base"><\/i>/,
				"ContactForm.tsx debe usar clases explícitas y estáticas para el spinner"
			);
			assert.doesNotMatch(
				content,
				/class=\{`.*undefined.*`\}/,
				"ContactForm.tsx no debe tener templates de clases susceptibles a undefined"
			);
		});

		await t.test("3.3 Escaneo estático en todo src/ contra patrones degenerados 'ph undefined' o 'ph-undefined'", () => {
			const srcDir = path.join(rootDir, "src");

			function scanDir(dir) {
				const entries = fs.readdirSync(dir, { withFileTypes: true });
				for (const entry of entries) {
					const fullPath = path.join(dir, entry.name);
					if (entry.isDirectory()) {
						scanDir(fullPath);
					} else if (/\.(astro|tsx|jsx|ts|js|html|css)$/.test(entry.name)) {
						const fileContent = fs.readFileSync(fullPath, "utf-8");
						assert.doesNotMatch(
							fileContent,
							/ph\s+undefined/i,
							`Patrón corrupto 'ph undefined' encontrado en ${path.relative(rootDir, fullPath)}`
						);
						assert.doesNotMatch(
							fileContent,
							/ph-undefined/i,
							`Patrón corrupto 'ph-undefined' encontrado en ${path.relative(rootDir, fullPath)}`
						);
						assert.doesNotMatch(
							fileContent,
							/ph\s+null/i,
							`Patrón corrupto 'ph null' encontrado en ${path.relative(rootDir, fullPath)}`
						);
						assert.doesNotMatch(
							fileContent,
							/ph-null/i,
							`Patrón corrupto 'ph-null' encontrado en ${path.relative(rootDir, fullPath)}`
						);
						assert.doesNotMatch(
							fileContent,
							/\[object\s+Object\]/,
							`Cadena '[object Object]' encontrada en ${path.relative(rootDir, fullPath)}`
						);
					}
				}
			}

			scanDir(srcDir);
		});

		await t.test("3.4 Verificación de artefactos generados en dist/client/ (Static Output)", () => {
			const distClientDir = path.join(rootDir, "dist", "client");
			if (fs.existsSync(distClientDir)) {
				const htmlFiles = [
					path.join(distClientDir, "es", "index.html"),
					path.join(distClientDir, "en", "index.html"),
				];

				for (const htmlFile of htmlFiles) {
					if (fs.existsSync(htmlFile)) {
						const htmlContent = fs.readFileSync(htmlFile, "utf-8");
						assert.doesNotMatch(
							htmlContent,
							/ph\s+undefined/,
							`El archivo generado ${htmlFile} contiene 'ph undefined'`
						);
						assert.doesNotMatch(
							htmlContent,
							/class="[^"]*undefined[^"]*"/,
							`El archivo generado ${htmlFile} contiene una clase con 'undefined'`
						);
						assert.doesNotMatch(
							htmlContent,
							/class="[^"]*null[^"]*"/,
							`El archivo generado ${htmlFile} contiene una clase con 'null'`
						);
					}
				}
			}
		});
	});

	// =========================================================================
	// 4. MANEJO DE ASSETS Y EMPAQUETADO (@phosphor-icons/web)
	// =========================================================================
	await t.test("4. Manejo de assets, empaquetado y fuentes de Phosphor Icons", async (t) => {
		const phosphorBase = path.join(rootDir, "node_modules", "@phosphor-icons", "web");
		assert.ok(fs.existsSync(phosphorBase), "node_modules/@phosphor-icons/web debe existir");

		const requiredWeights = ["regular", "bold", "fill"];
		const requiredFontExts = [".woff2", ".woff", ".ttf", ".svg"];

		for (const weight of requiredWeights) {
			await t.test(`4.1 Peso '${weight}': Presencia e integridad de style.css y fuentes`, () => {
				const weightDir = path.join(phosphorBase, "src", weight);
				assert.ok(fs.existsSync(weightDir), `El directorio para el peso '${weight}' debe existir en ${weightDir}`);

				const styleCssPath = path.join(weightDir, "style.css");
				assert.ok(fs.existsSync(styleCssPath), `style.css para '${weight}' debe existir`);
				const styleStat = fs.statSync(styleCssPath);
				assert.ok(styleStat.size > 1000, `style.css para '${weight}' no debe estar vacío (${styleStat.size} bytes)`);

				const styleContent = fs.readFileSync(styleCssPath, "utf-8");
				assert.match(
					styleContent,
					/@font-face/,
					`style.css para '${weight}' debe definir @font-face`
				);

				// Verificar archivos de fuentes
				for (const ext of requiredFontExts) {
					const files = fs.readdirSync(weightDir);
					const fontFile = files.find((f) => f.endsWith(ext));
					assert.ok(
						fontFile,
						`No se encontró archivo de fuente con extensión '${ext}' en el peso '${weight}'`
					);

					const fontPath = path.join(weightDir, fontFile);
					const fontStat = fs.statSync(fontPath);
					assert.ok(
						fontStat.size > 0,
						`El archivo de fuente ${fontFile} en '${weight}' no debe tener 0 bytes`
					);
				}
			});
		}

		await t.test("4.2 Verificación de import local en src/styles/global.css", () => {
			const globalCssPath = path.join(rootDir, "src", "styles", "global.css");
			assert.ok(fs.existsSync(globalCssPath), "src/styles/global.css debe existir");

			const globalCss = fs.readFileSync(globalCssPath, "utf-8");
			assert.match(
				globalCss,
				/@import\s+["']@phosphor-icons\/web\/fill["'];?/,
				"global.css debe importar directamente el paquete local @phosphor-icons/web/fill"
			);
		});

		await t.test("4.3 Ausencia absoluta de CDNs externos no controlados para iconografía", () => {
			const filesToCheck = [
				path.join(rootDir, "src", "layouts", "Layout.astro"),
				path.join(rootDir, "src", "pages", "sistemas-de-ventas.astro"),
				path.join(rootDir, "src", "pages", "[locale]", "index.astro"),
			];

			const externalCdnPattern = /(unpkg\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net).*phosphor/i;

			for (const file of filesToCheck) {
				if (fs.existsSync(file)) {
					const content = fs.readFileSync(file, "utf-8");
					assert.doesNotMatch(
						content,
						externalCdnPattern,
						`El archivo ${path.relative(rootDir, file)} contiene referencias CDN externas a Phosphor Icons`
					);
				}
			}
		});
	});
});
