# Love, Like Rosemary — ingredientes fotográficos

Paquete preparado el 27 de octubre de 2026 para sustituir las ilustraciones de comida de esta presentación y sus variantes dentro del preview de Yndarena.

## Contenido

12 PNG con transparencia real: 11 recursos nuevos y el abanico de cheddar que ya se había entregado. Cubren los nueve ingredientes y las variantes de corte de Two Halves, The Sprig y Gathered.

| Ingrediente | Recursos |
|---|---|
| Fig & Rosemary Jam | Ramekin de cerámica marfil con mermelada |
| Brie | Abanico de cuatro cuñas y rueda con una cuña cortada |
| Aged cheddar | Abanico de triángulos y grupo de cubos |
| Prosciutto | Rosa individual y cintas sueltas |
| Red grapes | Racimo pequeño |
| Fresh figs | Un higo dividido en dos mitades |
| Crackers | Unidad individual para construir abanicos con cantidad exacta |
| Rosemary Honey Walnuts | Grupo de nueces con glaseado ligero y romero |
| Fresh rosemary | Una ramita |

Todos los archivos se generaron con image_gen integrado; no se utilizó el modo CLI. Los prompts seleccionados se incluyen en `generation-prompts.json`.

## Cómo revisar el paquete

Abrir `galeria.html` después de descomprimir para ver cada recurso sobre fondos claros y oscuros. La galería muestra los archivos originales sin modificarlos.

`manifest.json` vincula cada archivo con su ingrediente, formato y técnica. Incluye dimensiones, límites del área visible y un punto de giro sugerido. Las claves del modelo son sugerencias que deben contrastarse con el código existente.

`asset-metadata.json` documenta la comprobación de transparencia y los hashes. Se verificó que los 12 PNG contienen píxeles transparentes y contenido visible. Los originales no fueron recortados, recoloreados ni editados por código.

## Indicación para Claude Code

Integrá los recursos de `assets/` en el renderer compartido de Designer, vistas de layout y montaje por capas de Love, Like Rosemary. Conservá la foto de referencia existente como portada del original; los diseños modificados deben mostrar su composición actual.

1. Contrastá las claves de `manifest.json` con los IDs de ingrediente y formato del proyecto.
2. Vinculá cada variante a su archivo: brie entero/cuñas, cheddar triángulos/cubos y prosciutto rosas/cintas. Aplicá los demás recursos a todas las composiciones de esta presentación que los utilicen.
3. Conservá las posiciones, capas, recetas y cantidades existentes. El cambio visual no debe alterar las listas ni crear supuestas equivalencias de peso.
4. Usá el mismo recurso en el lienzo editable y en la capa de montaje correspondiente. Reutilizá el renderer en las miniaturas de versiones guardadas y enlaces compartidos.
5. Respetá la proporción natural del área visible. El PNG de romero tiene márgenes laterales grandes: sus hojas no deben terminar enormes ni diminutas por medir solo el lienzo completo. Consultá `alphaBounds` y `visibleAspectRatio` para normalizar la caja de dibujo sin deformar el ingrediente.
6. Conservá selección, arrastre, giro, duplicación, sustitución y deshacer/rehacer. Si el elemento se dibuja como varias unidades, debe seguir siendo un solo grupo seleccionable.
7. Para crackers, repetí `plain-round-cracker-single.png`. Un abanico de seis tiene seis instancias y dos abanicos suman doce. No uses una foto de cantidad fija que contradiga el dato de piezas. Al modificar la cantidad, variá las unidades y la distribución, no estires el cracker.
8. Para higos, cada imagen contiene dos mitades de un higo. Dos instancias equivalen visualmente a los dos higos de la receta. Para romero, cada imagen representa una ramita.
9. Para queso, fiambres, uvas, nueces y mermelada, el peso o volumen sigue siendo un dato independiente de la imagen. `calibratedWeightGrams` es null deliberadamente. No conviertas automáticamente un abanico o racimo en una cantidad de onzas sin calibrarlo.
10. Conservá transparencia al optimizar los archivos. Prepará resoluciones de distribución apropiadas para móvil, dejando los originales como fuente.
11. Mantené las observaciones de generación, pruebas y diferencias entre foto y layout en el panel de revisión del preview. No agregues bloques técnicos al recorrido del cliente. La procedencia y el estado provisional pueden identificarse de forma breve dentro del preview.

## Alcance de las imágenes

Son recursos de aspecto fotográfico generados con IA para completar el preview. No representan una preparación pesada ni verifican por sí mismos dimensiones o cantidades. La tabla de madera del producto no forma parte de este paquete: conservar su recurso actual hasta disponer de una referencia real adecuada.

No se incluyen imágenes de todas las sustituciones posibles ni de recetas ajenas a esta presentación. Tampoco videos de técnicas.

## Comprobación al integrar

- Two Halves, The Sprig y Gathered usan los recortes que correspondan a sus ingredientes y cortes.
- Cambiar cheddar de triángulos a cubos y brie de cuñas a entero muestra su variante fotográfica.
- Cambiar entre rosas y cintas mantiene el vínculo con la técnica correcta.
- Las cantidades y las compras no cambian por reemplazar un dibujo por una foto.
- El montaje por capas coincide con las posiciones elegidas.
- Los grupos se pueden mover, girar, duplicar, guardar y recuperar.
- Los doce recursos cargan en la versión desplegada y mantienen su transparencia.
