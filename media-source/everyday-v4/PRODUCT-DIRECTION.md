# Yndarena — cuidar primero, disfrutar después

Revisión del preview del 28 de octubre de 2026: https://yndarena-app-preview.vercel.app/

## Decisión del usuario

El Care Plan es la utilidad principal de la app. Las ideas para servir acompañan su uso, incluyendo comidas principales de todos los días. Los recordatorios de regalos completan la experiencia. No convertir Yndarena en una escuela de cocina ni en un catálogo dedicado únicamente a appetizers.

La funcionalidad existente se conserva. La modificación es de prioridad, organización y amplitud del contenido.

## Home, en este orden vertical

1. **Your care plan.** Primer bloque de contenido, visible sin desplazarse en una pantalla móvil habitual. Mostrar el estado real de la tabla, la siguiente acción y una llamada principal. Mantener una cabecera breve con Home number y bienvenida. No poner una fotografía grande de comida antes del cuidado.
2. **Ideas for your table.** Bloque breve con dos o tres propuestas cotidianas y acceso a Discover. Sin desplegar todo el catálogo, las técnicas y la comunidad dentro del Home.
3. **Gift dates.** Fechas guardadas, próximo recordatorio y acceso para agregar o administrar ocasiones. Va debajo de las ideas para servir, dentro del Home, no en una pestaña independiente a la derecha.

Los detalles de calendario/historial del Care Plan se abren desde el primer bloque. Los detalles y la edición de fechas se abren desde el último. Son destinos de detalle, no secciones principales que compitan con Home.

## Navegación propuesta

Home · Discover · Collection.

Retirar el cuarto acceso principal `Care & gifts`. Conservar sus rutas o redirigir los enlaces existentes hacia el bloque o detalle correspondiente para no romper los recorridos. No duplicar la lógica del cuidado ni del sistema de fechas.

## Primer bloque: el estado determina la acción

| Estado proveniente del sistema existente | Contenido y acción |
|---|---|
| Care Plan todavía sin configurar | “Let's set up your board care.” → “Set up care” |
| Próxima revisión futura | “Your next water test” + fecha → “View care plan”; “Check now” puede ser secundario |
| Revisión pendiente | “It's time for a quick water test.” → “Start water test” |
| Necesita aceite, todavía sin completar | “Your board needs oil.” → “Continue care” |
| Cuidado completado | Confirmación breve y próxima revisión que devuelva el sistema |

Estos textos son una propuesta de presentación, no una nueva máquina de estados. Mapear únicamente a estados reales que ya existan. Si falta un dato, no inventar una fecha o un resultado. Una fecha de revisión no implica automáticamente que haga falta aceite.

El flujo actual de water test, acceso al video, disponibilidad de aceite, kit e historial se reutiliza. El ofrecimiento de aceite sigue siendo secundario al cuidado, sin bloquear las instrucciones. No marcar como terminado un aceitado que el cliente todavía no confirmó.

## Discover

Dar presencia a `Everyday meals` junto al contenido actual para compartir. Ofrecer platos principales sencillos, una preparación opcional breve y hasta tres pasos para distribuirlos. No exigir ingredientes especiales, salsas hechas desde cero, técnicas decorativas ni videos para comenzar.

Las recetas existentes y las presentaciones de picadas se mantienen; las técnicas y comunidad viven en Discover, accesibles para quien las busque. Los nombres de comidas principales son claros en inglés, sin forzar una historia poética distinta para cada receta.

## Contenido nuevo

Seis propuestas iniciales: Gnocchi, Tomato & Basil; Lemon Chicken & Potatoes; Steak & Roasted Potatoes; Salmon, Rice & Beet Salad; Chicken Wraps; Tomato & Mozzarella Flatbread.

Los datos están en `everyday-meals.json`. Sus cantidades y pasos son borradores editoriales de presentación, no recetas probadas. Los minutos se refieren al montaje con la comida lista. La persona puede cocinar como ya acostumbra o usar productos preparados.

En el Designer se trabaja con componentes listos para servir: bowl de ñoquis, pollo cocido, papas, arroz, wraps, etc. No convertir cada grano de arroz o cada ñoqui en una pieza que deba arrastrarse. Dejar una composición completa al abrir y libertad para mover o sustituir, sin exigir cambios.

## Imágenes y uso de la tabla

Los nuevos recursos son 16 componentes transparentes y seis portadas de inspiración generadas con IA. No vuelven a incluir los paquetes anteriores. Los ñoquis con salsa quedan dentro de un bowl sobre la tabla. La madera de las portadas es una referencia genérica; validar el uso, el acabado y las limitaciones del producto real antes de presentar una imagen como reproducción de Yndarena. No usar la tabla como salvamanteles para una olla o sartén recién salida del fuego.

Las propuestas muestran comida cocida o lista para servir. No mezclar preparación de carne cruda y servicio sobre una superficie sin limpiar. Referencia oficial para quien implemente las indicaciones: [USDA — prevención de contaminación cruzada en tablas](https://ask.fsis.usda.gov/article/How-can-I-prevent-cross-contamination-when-using-cutting-boards). La apariencia de una imagen no permite determinar la cocción de una carne.

## Archivos para Claude

Cada ZIP es independiente, de menos de 30.000.000 bytes, con un objetivo de alrededor de 24 MB o menos. Extraer todos en la misma carpeta y fusionar la carpeta raíz. No son volúmenes binarios que necesiten reconstruirse. Los documentos principales van en la primera parte y el inventario completo identifica los recursos de todas las partes.

Esta entrega incluye recursos e instrucciones. No modifica ni publica el proyecto de Vercel.


## Revisión de combinaciones

Este paquete reemplaza la entrega Everyday v3 completa. No usar ensalada verde como acompañamiento automático.

| Plato | Acompañamiento de la propuesta |
|---|---|
| Ñoquis con tomate y albahaca | Pan rústico |
| Pollo al limón | Papas y chauchas |
| Carne | Papas y ensalada de tomate y palta |
| Salmón | Arroz y ensalada de remolacha con zanahoria |
| Wraps de pollo | Repollo y zanahoria |
| Pizza de tomate y mozzarella | Tomates con albahaca |

Las cuatro ensaladas tienen pocos ingredientes y dos pasos de preparación. Son alternativas disponibles en el Designer; no hay que agregarlas todas a cada plato ni obligar al cliente a preparar una guarnición. La lechuga dentro de un wrap puede mantenerse: la corrección corresponde al acompañamiento genérico.

Actualizar las portadas, componentes predeterminados, listas y pasos conjuntamente. Mantener el contenido propio guardado por el cliente.
