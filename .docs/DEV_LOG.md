# Bitácora de Desarrollo y Lecciones Aprendidas - Refactorización Tactics Engine

**Fecha:** 14 de Diciembre de 2025
**Objetivo:** Migrar el motor de juego a Módulos ES6 nativos y refactorizar clases legacy.

## 1. Contexto
El proyecto partía de una mezcla de TypeScript y JavaScript con patrones antiguos (constructores como funciones + prototipos) y una gestión de dependencias que causaba errores en tiempo de ejecución en el navegador (CommonJS vs ES Modules).

## 2. Desafíos Principales y Soluciones

### A. Dependencias Circulares y Orden de Carga
*   **Problema:** `tactics.js` importaba módulos que a su vez dependían de clases definidas en `tactics.js` (como `IntersectionPoint`), creando un ciclo irresoluble y errores de "module not defined".
*   **Solución:** Extraer las clases base comunes (como `IntersectionPoint`) a sus propios archivos independientes (`lib/point/intersectionpoint.ts`). Esto rompe el ciclo y permite que otros módulos las importen sin depender del archivo principal.

### B. Refactorización de Clases (Prototipos vs ES6 Classes)
*   **Problema:** Clases como `Collider`, `Shooter`, `Rectangle` o `ImgToken` estaban definidas como funciones constructoras con métodos añadidos al `prototype` externamente. Al intentar extenderlas o usarlas con `class ... extends` en TypeScript/ES6, se producían errores de tipo `Class constructor cannot be invoked without 'new'`.
*   **Solución:** Reescribir estas entidades como clases ES6 nativas (`class Nombre extends Padre { ... }`).
    *   Mover métodos del prototipo al cuerpo de la clase.
    *   Usar `super()` correctamente en el constructor.
    *   Asegurar la exportación (`export class ...`) e importación correcta.

### C. Contexto de `this` (El clásico de JS)
*   **Problema:** En métodos como `render`, `loadImg` o `drawScene`, el uso de `forEach` con funciones anónimas (`function(e){...}`) o callbacks asíncronos (`requestAnimationFrame`) hacía que se perdiera el contexto de `this`, resultando en errores `Cannot read properties of undefined`.
*   **Solución:**
    *   **Arrow Functions:** Usar `(e) => { ... }` en los `forEach` para heredar el `this` del contexto padre.
    *   **Variable `self`:** En funciones complejas o recursivas como `drawScene`, capturar el contexto al inicio (`var self = this;`) y usar `self` en lugar de `this` para garantizar la referencia correcta a la instancia, especialmente dentro de `requestAnimationFrame`.

### D. Inicialización de Propiedades
*   **Problema:** Errores `Cannot set properties of undefined` al intentar asignar valores a objetos anidados (`this.config.viewGrid`, `this.buffer.drawing`) que no habían sido inicializados en el constructor.
*   **Solución:** Asegurar que todas las propiedades objeto (`config`, `buffer`, `fps`) se inicialicen (`this.config = {};`) antes de asignarles valores.

### E. Importaciones en Navegador (ESM)
*   **Problema:** El navegador requiere extensiones de archivo explícitas para los imports (e.g., `import ... from './archivo.js'`), mientras que TypeScript o bundlers a menudo las omiten.
*   **Solución:** Añadir explícitamente la extensión `.js` a todos los imports en los archivos generados/refactorizados.

## 3. Recomendaciones para Futuro Desarrollo

1.  **Consistencia:** Mantener todas las nuevas entidades como clases ES6. No mezclar con el estilo antiguo de `prototype`.
2.  **Modularidad:** Si una clase es usada por múltiples módulos, debe tener su propio archivo. Evitar definir múltiples clases en un solo archivo si generan dependencias cruzadas.
3.  **Tipado:** Aprovechar TypeScript para definir interfaces claras (`IToken`) y evitar errores de "propiedad no existente" antes del tiempo de ejecución.
4.  **Bundling:** A largo plazo, considerar usar Vite o Webpack para manejar las extensiones de importación y el bundling automáticamente, facilitando el desarrollo y despliegue.

---
*Documento creado automáticamente tras sesión de refactorización.*
