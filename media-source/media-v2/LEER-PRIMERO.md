# Yndarena — Media v2

Paquete de recursos para completar la biblioteca fotográfica del preview. Generado con la herramienta integrada de imágenes de Codex.

## Contenido y verificación

- `ingredients/`: 33 recortes PNG transparentes para los 24 ingredientes que faltaban, con sus variantes.
- `recipes/`: cinco portadas fotográficas de recetas.
- `presentations/`: siete portadas editoriales: Golden Hour en dos layouts, Sunday Garden en dos, The Copper Pot y Love, Like Rosemary en The Sprig y Gathered.
- `surfaces/`: textura genérica de madera, opcional para el preview.
- `manifest.json`: correspondencia entre recursos, ingredientes, formatos, recetas y presentaciones. Sus nombres describen la interfaz revisada; no pretenden ser IDs del código.
- `asset-metadata.json`: dimensiones, modo, SHA-256, transparencia y límites visibles.
- `generation-records.json`: prompts originales y trazabilidad de generación. No contiene las imágenes en base64.
- `galeria.html`: galería local. Descomprimir el ZIP antes de abrirla.
- `PROMPT-PARA-CLAUDE-CODE.md`: instrucciones de integración.
- `GUIA-VIDEOS-HIGGSFIELD.md` y `video-plan.json`: plan de clips pendientes. No hay videos generados dentro del ZIP.

El manifest y el informe de verificación indican las cantidades efectivamente generadas.

## Relación con el paquete anterior

Este paquete complementa `yndarena-ingredients-v1`; no lo reemplaza ni lo vuelve a incluir. Conservar los nueve ingredientes anteriores: Fig & Rosemary Jam, Brie, Aged cheddar, Prosciutto, Red grapes, Fresh figs, Crackers, Rosemary Honey Walnuts y Fresh rosemary.

El seed cracker nuevo es una sola unidad, para que la app pueda repetirla formando abanicos y pilas. En los otros recursos de grupo, el número de piezas es visual y no está calibrado a una cantidad física. No convertir un grupo de cubos, rodajas o fruta en un peso o un contador de piezas.

## Qué representan las portadas

Las portadas son imágenes editoriales generadas con IA, basadas en los ingredientes y las ideas de las fichas revisadas. No son fotografías de una receta probada ni del producto físico Yndarena. Su composición y cantidad visual pueden diferir de los datos del Designer. La composición editable y las listas de ingredientes deben seguir siendo la fuente para guiar el armado.

La madera incluida es una textura genérica para usar dentro de la silueta existente de la tabla. No certifica especie, veta, acabado ni diseño del producto. Usar la referencia real antes de presentar la tabla como una reproducción del producto.

## Verificación

Se inspeccionan las imágenes generadas y se comprueba que los PNG de ingredientes contienen transparencia real. Las mediciones de límites visibles sirven para compensar márgenes en el renderizador. Los archivos fuente no se recortan ni se modifican mediante código en este paquete.

No se modificó ni publicó el proyecto de Vercel desde esta entrega. Claude Code debe integrar los recursos y verificar los recorridos dentro de la app.
