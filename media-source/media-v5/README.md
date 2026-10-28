# Yndarena Media v5 - cocina y nuevo catalogo

Entrega del 28 de octubre de 2026.

## Contenido

- 21 nuevos recortes fotograficos cenitales de comida con transparencia, uno por cada estilo pendiente del panel de revision.
- 2 fondos fotograficos de una cocina residencial estadounidense: movil y escritorio.
- 1 visualizacion IA del set en perspectiva, derivada de la referencia existente, con los tres textos del lomo conservados.
- 1 recurso original del set recuperado del preview y convertido a PNG, sin redisenar sus grabados.

Son **24 imagenes nuevas generadas con la herramienta integrada image_gen** y una referencia original reutilizada. Los alimentos y la cocina son imagenes generadas, no fotos de una preparacion probada. La perspectiva del producto es una visualizacion IA: no verifica la veta, acabado o geometria finales.

## Que subir a Claude Code

**Yndarena-V5-Listo-Para-Claude.zip** contiene todos los recursos optimizados WebP, las instrucciones y los manifiestos. Es suficiente para integrar esta entrega.

Los dos ZIP **Originales-PNG** contienen copias de maxima calidad. Son opcionales para trabajar en la app; guardalos como originales. Cada ZIP es independiente, tiene nombre distinto y pesa menos de 30 MB.

## Archivos de integracion

- PROMPT-PARA-CLAUDE.md: instrucciones listas para copiar.
- registry-map.json: correspondencia exacta entre item:style del preview y archivo WebP.
- asset-manifest.json: dimensiones reales del archivo, transparencia, limites visibles y hashes.
- GENERATION-PROMPTS.json: prompts finales y procedencia de las referencias. Se utilizo la herramienta integrada; no la API/CLI.
- gallery.html: galeria local de todos los recursos optimizados.
- preview/food-contact-sheet.jpg: vista de los 21 componentes.
- preview/product-on-ivory.jpg: comprobacion del recorte del set sobre fondo marfil; es una vista de control, no un recurso con transparencia.

## Reglas importantes

- Conservar alpha al importar o volver a optimizar. Un fondo negro mostrado por un visor no significa que el archivo tenga fondo negro: comprobar el canal alfa.
- Usar los limites visibles del manifiesto, no el margen transparente, para encajar cada imagen en el renderer existente.
- Mantener Photo y Layout como dos vistas de la misma escena. No crear nuevas portadas con tablas genericas.
- No deformar un bowl ni agrandarlo al aumentar la cantidad. Las imagenes no contienen informacion de capacidad o gramos.
- Slider: el archivo contiene **un slider**. Sopa: **un bowl**. Grilled cheese: **un sandwich en dos mitades**. Quesadilla: **una quesadilla representada por cuatro triangulos**. Pan de ajo: **cuatro rebanadas**. Los demas grupos sueltos tienen un conteo ilustrativo y no determinan gramos ni tazas.
- El basilico que aparece en los raviolis ya esta dentro del recurso. No duplicar visualmente la decoracion si la receta tambien tiene una capa de basilico.
- Los milimetros del sistema actual siguen siendo estimaciones. Esta entrega no confirma el encaje fisico, la capacidad de recipientes ni las porciones.
- La visualizacion en perspectiva del set se usa en la entrada de producto; no como textura cenital ni plantilla para medir la ranura. La referencia original queda disponible para conservar la representacion actual del Care Plan.
- El bloque Coming soon, el logo, los textos y los botones se construyen en codigo, separados del fondo de cocina. No hay textos ni controles incrustados en los fondos.

## Alcance

Se entregan recursos e instrucciones. No se modifico ni desplego la aplicacion. Siguen pendientes los videos, las fotografias reales del producto y la comprobacion fisica con tablas, recipientes y comida.
