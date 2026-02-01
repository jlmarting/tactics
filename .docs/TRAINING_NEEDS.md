# Plan de Formación y Necesidades Técnicas

**Fecha:** 14 de Diciembre de 2025
**Contexto:** Derivado de la refactorización del motor "Tactics Engine".

Este documento detalla las áreas técnicas donde se han detectado oportunidades de mejora y los conocimientos necesarios para abordar la evolución futura del proyecto hacia una librería profesional.

---

## 1. Fundamentos de JavaScript Moderno (ES6+)

Los errores más frecuentes encontrados (`TypeError: Cannot read properties of undefined`, problemas con `this`) sugieren la necesidad de reforzar conceptos clave del estándar actual de JavaScript.

### A. El Contexto de Ejecución (`this`) y Arrow Functions
*   **La Laguna:** En el código legacy, el uso de `forEach(function(e){...})` o `requestAnimationFrame(this.method)` provocaba la pérdida del contexto `this`, obligando a usar parches como `var self = this`.
*   **Necesidad Formativa:**
    *   Entender la diferencia entre **Function Scope** (funciones tradicionales) y **Lexical Scope** (Arrow Functions `() => {}`).
    *   Uso de `.bind()`, `.call()` y `.apply()`.
    *   **Acción:** Priorizar siempre Arrow Functions en callbacks y métodos de clase que se pasan como argumentos.

### B. Clases ES6 vs. Prototipos
*   **La Laguna:** La mezcla de sintaxis `function MyClass() { ... }` con `MyClass.prototype.method = ...` causó incompatibilidades al intentar usar herencia moderna (`extends`), resultando en errores de constructor.
*   **Necesidad Formativa:**
    *   Sintaxis de `class`, `constructor`, y `super`.
    *   Herencia y polimorfismo en ES6.
    *   Getters y Setters.

---

## 2. Arquitectura de Software y Modularización

Los problemas de carga inicial (errores de importación y dependencias circulares) indican la necesidad de mejorar el diseño arquitectónico.

### A. Gestión de Dependencias y ES Modules (ESM)
*   **La Laguna:** Dependencias circulares (A importa B, B importa A) que rompían la aplicación.
*   **Necesidad Formativa:**
    *   Entender cómo el navegador resuelve y carga los módulos ESM.
    *   **Principio de Inversión de Dependencias:** Cómo abstraer interfaces para desacoplar módulos.
    *   Uso de "Barrel Files" (`index.ts` que exportan todo) con precaución para evitar ciclos.

### B. Ciclo de Vida de Objetos
*   **La Laguna:** Propiedades (`fps`, `config`, `viewPort`) accedidas antes de ser inicializadas en el constructor.
*   **Necesidad Formativa:**
    *   Orden de inicialización en constructores.
    *   Patrones de diseño para configuración por defecto (Factory Pattern o Builder Pattern).

---

## 3. TypeScript Avanzado

Aunque el proyecto usa TypeScript, la configuración laxa permitió que muchos errores llegaran al navegador.

### A. Tipado Estricto vs `any`
*   **La Laguna:** Uso extensivo de `any` y falta de interfaces, lo que impidió que el compilador detectara errores como "propiedad inexistente".
*   **Necesidad Formativa:**
    *   Uso de `Interfaces` para definir contratos (ej. `IToken` estaba incompleta).
    *   Configuración de `tsconfig.json` (activar `strict: true` progresivamente).
    *   Genéricos para estructuras de datos reutilizables.

---

## 4. Herramientas y Futuro Inminente (Next Steps)

Para profesionalizar la librería, es necesario adoptar herramientas de construcción modernas.

### A. Bundlers (Vite / Webpack)
*   **Necesidad:** Actualmente dependemos de añadir `.js` manualmente a los imports y de un servidor HTTP simple.
*   **Formación:**
    *   Cómo funciona **Vite** (Hot Module Replacement, Bundling).
    *   Configuración de entornos de desarrollo vs producción.
    *   Manejo de assets (imágenes, CSS) dentro del grafo de dependencias de JS.

### B. Testing Unitario
*   **Necesidad:** Cada refactorización requirió prueba manual ("recargar y ver si explota").
*   **Formación:**
    *   Introducción a **Jest** o **Vitest**.
    *   Cómo testear lógica matemática (vectores, colisiones) aisladamente sin necesidad del navegador.

---
*Este documento sirve como hoja de ruta para el estudio y la mejora continua del equipo de desarrollo.*
