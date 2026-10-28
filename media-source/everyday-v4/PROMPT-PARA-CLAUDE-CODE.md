Actuá como un app designer y frontend engineer experto en experiencias móviles premium. Continuá el preview de Yndarena con criterio visual y claridad, conservando las funcionalidades y la identidad de la marca.

Preview: https://yndarena-app-preview.vercel.app/. Es una futura app iOS y Android; seguimos afinando su preview en Vercel. Toda la interfaz del cliente permanece en inglés estadounidense. El slogan es Turning houses into homes. La marca celebra el cuidado, el cariño y los momentos cotidianos del hogar.

Extraé todos los ZIP yndarena-everyday-v4 en la misma ubicación y fusioná su carpeta raíz. Es la entrega COMPLETA revisada de estas seis comidas y reemplaza Everyday v3. No necesitás pedir ni volver a cargar los ZIP v3. Conservá v1 y Media v2, que ya están integrados.

Leé PRODUCT-DIRECTION.md, everyday-meals.json, manifest.json, asset-metadata.json y replacement-map.json.

1. Home y navegación

Reorganizá el Home en una sola columna: Your care plan primero y visible sin desplazarse; Ideas for your table debajo, con dos o tres propuestas; Gift dates al final. Dejá la navegación principal en Home · Discover · Collection. Retirá Care & gifts de la barra inferior y abrí sus detalles desde los bloques del Home, conservando o redirigiendo las rutas existentes.

Reutilizá la lógica actual del Care Plan: water test, resultado, próxima revisión, aceite, video/instrucciones, kit, historial y notificaciones. El estado determina la siguiente acción; una fecha de revisión no significa automáticamente que haga falta aceite. No marques como terminado un aceitado todavía pendiente. Conservá login, Home numbers, fechas de regalos y las funciones existentes. Los datos siguen siendo demo donde aún no exista integración real.

2. Comidas y acompañamientos

Usá las seis propuestas de everyday-meals.json con estas combinaciones predeterminadas:

- Gnocchi, Tomato & Basil: pan rústico.
- Lemon Chicken & Potatoes: papas y chauchas.
- Steak & Roasted Potatoes: tomate y palta como ensalada.
- Salmon, Rice & Beet Salad: arroz y remolacha con zanahoria.
- Chicken Wraps: repollo y zanahoria como acompañamiento.
- Tomato & Mozzarella Flatbread: tomates con albahaca al lado.

No agregues una ensalada universal a todos los platos. Integrá las cuatro ensaladas de sideIdeas como componentes preparados que el cliente puede elegir o quitar, sin crear una sección principal adicional. La lechuga que forma parte del relleno del wrap se mantiene; se cambia su acompañamiento.

La propuesta completa aparece primero, con hasta tres pasos para servir. La preparación breve es opcional y permite recetas habituales o productos preparados. No exigir videos, salsas caseras desde cero ni nuevas técnicas. Los minutos indican montaje con la comida lista, no cocción total. No agregar puntuaciones nutricionales. Mantené picadas, dips, técnicas y comunidad disponibles en Discover, con menor protagonismo en el Home.

3. Imágenes, Designer y actualización

El paquete completo tiene 22 imágenes: 16 componentes transparentes y seis portadas. Incluye todos los recursos que necesita esta entrega, tanto los nuevos como los conservados. Usá replacement-map.json para sustituir las cinco portadas anteriores modificadas. Actualizá también los componentes predeterminados, ingredientes, listas y pasos de esas fichas.

Actualizá las propuestas de la marca por sus IDs estables; no dupliques las seis comidas. Conservá las versiones personales ya guardadas por el cliente y sus ingredientes. La ensalada verde anterior deja de ser un acompañamiento automático; no borres datos personales que la utilicen.

Usá componentes listos para servir en el Designer: bowl de ñoquis, pan, pollo, papas, ensaladas, wraps. No convertir cada ñoqui o grano de arroz en una pieza independiente. Respetá el alpha, las proporciones y los límites visibles de asset-metadata.json. componentInstances orienta la composición, no calibra pesos físicos. El recurso del wrap representa dos mitades de un wrap y se repite para representar dos wraps.

Centralizá los recursos para Home, Discover, detalle, Designer, capas, Collection, versiones y enlaces compartidos. Las portadas son inspiración generada con IA; el montaje editable sigue los datos de la composición. La madera de las portadas es genérica. Los ñoquis con salsa quedan en bowl sobre la tabla.

4. Comprobación

Verificá en móvil la prioridad del Care Plan, el acceso al water test, el estado de cuidado pendiente y las fechas de regalos dentro del Home. Revisá las seis comidas y confirmá que portada, ingredientes, pasos y Designer muestran el acompañamiento correcto. Probá modificaciones, guardado, reapertura y enlaces compartidos. Conservá los recorridos anteriores.

Implementá los cambios en el proyecto actual. Entregá capturas del Home y de las comidas corregidas, un resumen breve y los pendientes reales. No rehagas la app ni agregues recorridos innecesarios.
