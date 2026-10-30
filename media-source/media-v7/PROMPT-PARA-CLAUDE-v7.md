Actuá como un senior mobile product designer especializado en iOS y Android. Aplicá esta corrección de recursos sobre el proyecto actual de Yndarena. Esta entrega reemplaza únicamente la representación vertical incorrecta del set y el bloque negro de Coming soon. Conservá las mejoras de navegación, controles móviles y Care Plan que ya venimos trabajando.

## 1. El producto real manda

Revisá references/TABLAS-original.pdf. Es el diseño suministrado por el dueño de la marca. No rediseñes el producto para mejorar la composición.

Descartá como recursos de producto `yndarena-set-upright-v6.png`, `yndarena-set-upright-v6.webp` y cualquier imagen o boceto que haya copiado sus grabados incorrectos.

Usá `assets/yndarena-upright-original-v7.webp` para el frente del set. También se incluyen PNG de alta resolución y SVG autocontenido. El SVG conserva los motivos originales del PDF y los nombres como trazados extraídos de su página de vectores; no requieren recrear la tipografía.

Respetá estos detalles:

- De izquierda a derecha: CHEESE & BREAD, FRUITS & VEGETABLES, MEAT & FISH.
- Las palabras se leen de arriba hacia abajo con el set de pie.
- Arriba hay UNA rama horizontal que continúa entre las tres tablas. No repetir una rama completa en cada tabla.
- Abajo hay un motivo botánico individual con su línea de suelo en cada tabla.
- Conservá los colores y el arte del documento original; no reemplazar por otros grabados, plantas o letras generadas.

## 2. Dimensiones y escala

Cada tabla tiene dimensiones exteriores confirmadas de 330 × 240 × 18 mm, equivalentes a 33 × 24 × 1,8 cm.

En la elevación frontal suministrada se ven los CANTOS de 18 mm. Tres cantos juntos tienen 54 mm de ancho y 330 mm de alto. Por eso el recurso tiene proporción 54:330, exportado a 540 × 3300 px. Los 240 mm corresponden al ancho de la cara grande de cada tabla; no al canto visible en esta vista.

Mostrá el recurso con object-fit: contain y dimensiones proporcionales. No lo ensanches, no le apliques object-fit: fill ni escales un eje por separado para ocupar más espacio. Conservá los tres motivos y los extremos completos.

Si elegís desarrollar una vista con perspectiva para que tenga más presencia en el teléfono, construí primero la geometría de CADA tabla con 330 × 240 × 18 mm y aplicá los grabados originales sobre sus cantos. La perspectiva puede cambiar la proyección; no puede cambiar las dimensiones ni inventar el diseño. El recurso incluido es una ilustración frontal derivada del arte original, no una foto medida del producto terminado. No lo deformes para simular una perspectiva.

Este paquete no confirma dimensiones del soporte ni de la ranura. No inventarlas como si fueran medidas reales.

## 3. Coming soon: romero + signo de pregunta

Eliminá `coming-soon-upright-v6.svg` y cualquier caja, bloque negro, tapa o silueta de producto futuro.

Usá `assets/yndarena-rosemary-question-v7.svg`, también disponible en PNG/WebP transparente. Combina el romero original extraído del PDF con la curva y el punto de un signo de pregunta, en verde oscuro apagado. Es un símbolo gráfico de lo que vendrá, no una tabla ni otro producto anunciado.

Integralo con aire en la cocina, como un detalle de marca secundario al set. Evitá que parezca un objeto físico apoyado a la misma escala que las tablas. Sin rectángulo negro ni fondo opaco detrás del símbolo. No lo conviertas en un botón sin destino.

Debajo, en texto real y accesible construido en código:

More for your home
Coming soon

El símbolo es decorativo: si estos textos ya identifican el contenido, evitá duplicarlo en el lector de pantalla.

## 4. Composición de la entrada

La entrada sigue siendo la de Yndarena para todos sus productos. Por ahora solo Cutting Board Set está disponible. El Home number pertenece a la cuenta, no al producto.

Conservá la cocina y la identidad de marca. Reservá un área para el set completo y otra para el símbolo futuro. Poné el nombre del set y la acción Open your set por debajo, con espacio propio: nada debe tapar los grabados, la madera ni la base de las tablas.

La imagen `preview-correccion-v7.png` es una lámina de revisión de estos dos recursos; no es una pantalla de la app ni un fondo que debas insertar con sus textos incrustados. Resolvé la composición de la app con elementos independientes y conservá el lenguaje táctil móvil ya definido.

## 5. Comprobación

Revisá 320 × 568, 375 × 667, 390 × 844 y 430 × 932, además del preview de escritorio. Confirmá que el set no se estira ni se recorta y que ningún texto, botón o tarjeta lo tapa. Si falta espacio vertical, permití desplazamiento.

Compará la entrada final con el PDF original, comprobá la lectura de los tres nombres y verificá que el símbolo futuro no tenga un rectángulo de fondo. Conservá el Care Plan, los datos guardados y el funcionamiento del resto de la app.

Entregá capturas de la entrada en dos tamaños de teléfono y explicá qué cambió. No describas una vista frontal como una foto real ni una perspectiva como físicamente validada sin comprobarla.
