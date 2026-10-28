Actua como un product designer, art director y frontend engineer experto en apps moviles premium. Integra los recursos de **Yndarena Media v5** en el proyecto actual: https://yndarena-app-preview.vercel.app/.

Lee README.md, registry-map.json y asset-manifest.json. El ZIP Listo-Para-Claude incluye todos los WebP necesarios con transparencia; no necesitas los ZIP de originales PNG para implementar.

1. **Completa las 21 fotografias pendientes.** Sustituye cada estado Photo pending usando la correspondencia item:style de registry-map.json en el registro central src/data/media.js. Reutiliza el renderer existente para Designer, Photo, Layout, pasos, Collection y versiones. Respeta la representacion indicada de cada recorte: un slider, un bowl de sopa, un sandwich con dos mitades, una quesadilla con cuatro triangulos, etc. No dupliques cantidades ni deduzcas pesos de la imagen.

2. **Conserva la escala.** Ajusta por los limites alfa visibles, sin estirar las imagenes para llenar una caja. Mantiene diametros, perfiles fisicos, capacidades, cantidades y ubicaciones On the board/Alongside. Si un recurso muestra otra proporcion, resuelvelo con encaje proporcional y revisa la huella completa; no cambies silenciosamente los milimetros para forzar un montaje. Las cantidades y capacidades siguen pendientes de prueba fisica. En los raviolis, el basilico ya esta representado dentro del bowl.

3. **Crea la entrada general de Yndarena.** Usa web/kitchen/yndarena-kitchen-mobile.webp y web/kitchen/yndarena-kitchen-desktop.webp para una cocina residencial estadounidense calida y elegante. Son fondos sin UI ni productos: compone el logo, el copy y los elementos interactivos en codigo, con texto legible y controles accesibles.

4. **Seleccion del producto.** Integra el Cutting Board Set sobre la encimera como producto disponible. Para la vista en perspectiva tienes web/product/yndarena-set-perspective.webp, una visualizacion IA basada en la referencia. Para conservar exactamente el recurso actual tienes web/product/yndarena-original-set-spines.webp. Ajusta escala, posicion y sombra para que se apoye en la encimera y no flote. No uses la perspectiva para calibrar las medidas del producto.

5. **Futuros productos.** Crea en codigo un volumen/bloque charcoal elegante con "More for your home." y "Coming soon.". No inventes otros productos ni conviertas el bloque en un enlace vacio. El fondo de cocina debe adaptarse sin recortes que oculten los productos.

6. **Recorrido.** Al abrir la app, el usuario encuentra la entrada general de marca; al tocar Cutting Board Set entra directamente a la experiencia actual. Conserva dentro del set el diseno de las tablas, el Care Plan protagonista, Discover, Designer, Collection y Gift dates. Agrega "All products" para volver a la cocina. Una cuenta y un Home number para toda Yndarena. No agregues codigos de producto ni otro registro. Conserva el flujo de autenticacion y los datos existentes.

7. **Identidad y cuidado.** Mantiene paleta, logos, "Turning houses into homes" y "Made with love. Cared for with ease.". Tienes libertad creativa para composicion, tipografia y movimiento con proposito. Conserva como pendientes los tiempos, cantidades e instrucciones de cuidado que la marca aun debe confirmar.

8. **Verifica la integracion.** Comprueba cobertura fotografica de los 21 estilos, transparencia, cantidades por unidad, cambio Photo/Layout, compras, sustituciones, guardado y reapertura. Prueba entrada general, seleccion y All products en movil y escritorio. Conserva movimiento reducido y estados de foco. No declares pruebas fisicas ni fotografias reales por incorporar estos recursos generados.

Entrega capturas de la entrada, del producto y de los nuevos platos con las fotos integradas, y un resumen de lo implementado y lo pendiente. Implementa en el proyecto existente; no te limites a proponer el diseno.
