# Tactics

Motor de juego 2D basado en Canvas de HTML5.

## Descripción
Tactics es un motor de juego 2D ligero que permite la creación de escenas interactivas con diversos tipos de objetos (tokens). Incluye un sistema de colisiones, gestión de cámaras (viewport) y herramientas de edición básicas.

## Estructura del Proyecto
- `index.html`: Punto de entrada de la aplicación.
- `lib/`: Contiene el núcleo del motor.
  - `tactics.js`: Inicialización y configuración de escenas.
  - `engine.js`: Bucle lógico del motor.
  - `scene.js`: Gestión del renderizado y la escena.
  - `token.js`: Definición de objetos básicos.
  - `tokens/`: Extensiones de tokens (imágenes, colisionadores, etc.).
- `css/`: Estilos de la aplicación.
- `img/`: Recursos gráficos.

## Cómo ejecutar
Simplemente abre `index.html` en un navegador web moderno. No requiere servidor para las funcionalidades básicas, aunque se recomienda para evitar problemas de CORS con ciertos recursos.

## Funcionalidades
- Sistema de colisiones circular y jerárquico.
- Detección de intersecciones de líneas.
- Viewport con seguimiento de tokens.
- Ajuste automático de FPS.
- Herramientas de depuración (ver colisionadores, IDs, rejilla).
