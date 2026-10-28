# Yndarena — revisión de tablas, escala y cantidades

Preview revisado: https://yndarena-app-preview.vercel.app/

Fecha: 28 de octubre de 2026. Medidas aportadas por el usuario: **33 × 24 × 1,8 cm**. La referencia adjunta muestra una juice groove y está recortada; no permite medir con precisión su ancho ni reconstruir el borde inferior.

## Resultado

El nuevo orden del Home ya responde al enfoque pedido. Care Plan aparece primero, ideas para servir después y Gift dates al final. La navegación tiene Home, Discover y Collection. Las seis comidas y sus acompañamientos corregidos están integrados.

La escala física y la asignación automática de tablas todavía requieren correcciones antes de considerar que el montaje representa lo que cabría sobre el producto real.

## Correcciones prioritarias

### 1. Asignar la tabla al plato principal

Las seis fichas muestran Cheese & Bread. Esto incluye Lemon Chicken & Potatoes, Steak & Roasted Potatoes y Salmon, Rice & Beet Salad.

La selección manual de Meat & Fish sí funciona y se conserva después de guardar y reabrir desde Collection. El problema observado está en los valores predeterminados y en la ayuda del selector, que todavía dice: “For serving, most presentations start on Cheese & Bread”.

Propuesta de asignación:

| Presentación | Tabla predeterminada |
|---|---|
| Gnocchi, Tomato & Basil, con pan | Cheese & Bread |
| Lemon Chicken & Potatoes | Meat & Fish |
| Steak & Roasted Potatoes | Meat & Fish |
| Salmon, Rice & Beet Salad | Meat & Fish |
| Chicken Wraps | Meat & Fish, por el pollo como principal |
| Tomato & Mozzarella Flatbread | Cheese & Bread |
| Presentación exclusivamente de frutas o vegetales | Fruits & Vegetables |

Una guarnición no debe cambiar automáticamente la tabla de un plato principal. Mantener la libertad de elección y las versiones propias del cliente.

### 2. Corregir la geometría del producto

El SVG observado usa una superficie de **600 × 400 unidades**, proporción **1,5**. La tabla de **33 × 24 cm** tiene proporción **1,375**. Si los 600 puntos se interpretan como 33 cm, el lienzo actual representa 22 cm de alto.

Usar una relación de aspecto de 330:240, con unidades físicas coherentes. Mantener los 18 mm de espesor como dato del producto; el espesor no cambia el área cenital de servicio.

La superficie actual usa una textura genérica sin ranura. Incorporar la juice groove y diferenciar el contorno exterior de la zona central donde pueden apoyarse recipientes. El centro de un bowl dentro de la tabla no garantiza que su base completa esté dentro de esa zona.

La posición de la ranura es **estimada** hasta medirla. Para una prueba de implementación puede usarse un margen interior editable de 20 mm, que produciría un rectángulo central aproximado de 290 × 200 mm, antes de descontar curvas. No presentar esos 20 mm como medida del producto. Con márgenes de 15–25 mm, el rectángulo central estaría aproximadamente entre 300 × 210 y 280 × 190 mm. La foto parcial no determina cuál es el valor exacto.

### 3. Calibrar alimentos y recipientes

Se leyeron las dimensiones de las imágenes representadas en el SVG visible. Las siguientes equivalencias usan el ancho exterior de 600 unidades = 33 cm y corresponden al rectángulo del recurso, no a una medición de comida real:

| Recurso | Ancho asignado | Equivalencia aproximada |
|---|---:|---:|
| Bowl de ñoquis | 194,415 unidades | 10,7 cm |
| Bowl de tomate y palta | 145,6 unidades | 8,0 cm |
| Grupo de una pechuga cortada | 150 unidades | 8,3 cm |
| Grupo de un steak cortado | 160 unidades | 8,8 cm |
| Porción de salmón | 150 unidades | 8,3 cm |
| Grupo de cuatro piezas de flatbread | 200 unidades | 11,0 cm |

Los márgenes transparentes pueden reducir todavía más el tamaño visible. Ninguna de esas imágenes contiene por sí sola información sobre peso, profundidad del recipiente o capacidad. Las fichas, mientras tanto, anuncian un bowl con 1 lb de ñoquis más salsa, dos steaks, dos tazas de papas o dos porciones de ensalada.

Definir un tamaño físico del recipiente y una capacidad, y una huella de cada componente preparado. Verificar al menos un montaje de referencia con el producto real antes de dar por confirmada la correspondencia entre cantidades y espacio. El archivo de imagen no permite deducir gramos o tazas.

### 4. Separar cantidad y tamaño del recipiente

En el Designer se aumentó Tomato & Avocado Salad de 2 a 3 servings. El ancho del recurso cambió de 145,6 a 178,322853 unidades: aproximadamente **22,5 % más ancho**. Esto reproduce el comportamiento de multiplicar dimensiones por la raíz cuadrada de la cantidad.

No aplicar ese escalado indiscriminadamente a recipientes. Un bowl mantiene su diámetro cuando cambia la cantidad que contiene. Si se supera su capacidad, debe haber otro recipiente, una elección explícita de un tamaño mayor, una reposición o una parte servida al lado de la tabla. Esa decisión debe reflejarse en la composición y en las instrucciones.

Separar en los datos: cantidad de receta, cantidad que se coloca sobre la tabla, recipiente/capacidad, número de grupos gráficos y huella física. Contar unidades solo cuando el recurso realmente las representa; por ejemplo, un recurso del wrap tiene dos mitades y dos recursos representan cuatro mitades.

### 5. Resolver los montajes que no caben

Después de fijar dimensiones, probar cada presentación con el contorno de la ranura y las huellas de sus componentes. No reducir todos los elementos silenciosamente para acomodarlos.

Si un montaje no cabe, acomodar de otra manera, reducir la cantidad que se coloca de una vez, usar otra tabla o dejar una guarnición en un bowl al lado. Diferenciar en ese caso “On the board” y “Alongside”. Serves 2 puede describir una comida completa; no significa que toda su cantidad quepa simultáneamente en una sola tabla de este tamaño.

Las portadas actuales son imágenes de inspiración sobre una madera genérica, con otras proporciones visuales. Revisarlas después de corregir la geometría y las cantidades. No tratarlas como una prueba de que el montaje cabe.

## Comprobaciones que pasaron

- Home: orden Care Plan → ideas para servir → Gift dates.
- Care Plan: water test con resultado It soaks in; posponer el aceitado mantiene Oil pending y Continue care en Home.
- Designer: cambio manual de la tabla de Cheese & Bread a Meat & Fish.
- Collection: la versión de prueba conserva Meat & Fish al reabrirse.
- Sustitución: cambiar tomate y palta por remolacha y zanahoria mantiene la edición.
- Lista de compras: después de esa sustitución aparecen remolacha, zanahoria y limón, y se conserva Meat & Fish en herramientas.
- Gift dates: gestión y apertura de la edición de una fecha. Se mantuvieron sin cambios las fechas del cliente demo.
- Seis fichas: los nuevos acompañamientos y las nuevas portadas corresponden a la revisión Everyday v4.

Las notificaciones y los correos siguen simulados, como indica el preview. No se verificaron envíos reales ni aplicaciones publicadas en tiendas.

## Pulido adicional

- En la vista móvil del Designer, el inicio de ADD aparece recortado y el extremo derecho de la barra de herramientas necesita un desplazamiento claro.
- El temporizador del water test se observó inicialmente como 0:60; debería formatearse 1:00.
- En el detalle del Care Plan se repite Your care plan en dos renglones consecutivos.

## Alcance de esta entrega

Es una revisión con evidencia y especificaciones para Claude Code. No se modificó el código del proyecto ni se publicó Vercel. Se creó una versión local de prueba llamada QA · Steak · Meat & Fish para comprobar el guardado. Las capturas y evidence.json documentan el recorrido. La medida de la ranura y la capacidad de los recipientes siguen sin verificar.
