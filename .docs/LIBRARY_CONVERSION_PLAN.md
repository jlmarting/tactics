# 🚀 Plan de Conversión a Librería: Tactics Engine

## 📋 Resumen Ejecutivo

**Objetivo:** Transformar Tactics de un proyecto personal a una librería npm publicable y reutilizable.

**Tiempo estimado:** 2-3 semanas
**Prioridad:** Alta calidad de código > Velocidad de desarrollo

---

## 🎯 Fase 1: Preparación y Limpieza (Días 1-3)

### ✅ Tareas

#### 1.1 Inicializar Proyecto Moderno
```bash
# Crear package.json
npm init -y

# Instalar dependencias de desarrollo
npm install --save-dev \
  typescript \
  @types/node \
  vite \
  vitest \
  @vitest/ui \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  prettier
```

#### 1.2 Configurar TypeScript
**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

#### 1.3 Reorganizar Estructura
```bash
mkdir -p src/{core,geometry,tokens,projectiles,input,utils}
mv lib/scene/scene.ts src/core/Scene.ts
mv lib/engine/engine.ts src/core/Engine.ts
mv lib/scene/viewport.ts src/core/Viewport.ts
# ... continuar con todos los archivos
```

#### 1.4 Git y .gitignore
```gitignore
# Build
/dist
/lib
*.js
*.js.map

# Dependencies
/node_modules

# Environment
.env

# IDE
.vscode
.idea

# Logs
*.log

# OS
.DS_Store
Thumbs.db
```

---

## 🔧 Fase 2: Refactorización de Código (Días 4-10)

### 2.1 Convertir Funciones a Clases ES6

**❌ ANTES (tactics.ts):**
```typescript
export const Engine = function(scene){
    this.scene = scene;
    this.mapkey = [];
}
Engine.prototype.start = function(){...}
```

**✅ DESPUÉS (src/core/Engine.ts):**
```typescript
export class Engine {
    private scene: Scene;
    private mapkey: string[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public start(): void {
        setInterval(() => {
            this.resolver();
            this.automat();
        }, 16);
    }
}
```

### 2.2 Eliminar Dependencias Circulares

**Problema actual:**
```
Scene -> Engine -> Scene  ❌
```

**Solución:**
```typescript
// Scene.ts
export interface IEngineCallbacks {
    onUpdate?: () => void;
    onRender?: () => void;
}

export class Scene {
    setEngineCallbacks(callbacks: IEngineCallbacks) {
        this.callbacks = callbacks;
    }
}

// Engine.ts
export class Engine {
    constructor(private scene: Scene) {
        scene.setEngineCallbacks({
            onUpdate: () => this.automat(),
            onRender: () => this.resolver()
        });
    }
}
```

### 2.3 Tipado Completo

**Crear types.ts:**
```typescript
export interface Point2D {
    x: number;
    y: number;
}

export interface TokenConfig {
    position: 'relative' | 'absolute';
    color: string;
    viewName: boolean;
    selectable: boolean;
    enabled: boolean;
}

export interface CollisionResult {
    canMove: boolean;
    collisions: string[];
}

export type MovementCommand = 'up' | 'down' | 'left' | 'right' | 'tleft' | 'tright';
export type ActionCommand = 'fire';
export type Command = MovementCommand | ActionCommand;
```

### 2.4 Refactorizar Clases Principales

**Prioridad:**
1. ✅ Point (base de todo)
2. ✅ CursorPoint
3. ✅ Vector
4. ✅ Collider
5. ✅ ImgToken
6. ✅ ColliderToken
7. ✅ Scene
8. ✅ Engine

**Checklist por clase:**
- [ ] Convertir a clase ES6
- [ ] Tipado completo
- [ ] Eliminar `any`
- [ ] JSDoc para métodos públicos
- [ ] Tests unitarios
- [ ] Eliminar console.log (usar logger)

---

## 🧪 Fase 3: Testing (Días 11-13)

### 3.1 Configurar Vitest

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov']
        }
    }
});
```

### 3.2 Tests Unitarios Críticos

**src/geometry/__tests__/Point.test.ts:**
```typescript
import { describe, it, expect } from 'vitest';
import { Point } from '../Point';

describe('Point', () => {
    it('should create point with coordinates', () => {
        const p = new Point(10, 20);
        expect(p.x).toBe(10);
        expect(p.y).toBe(20);
    });

    it('should calculate center correctly', () => {
        const p = new Point(10, 20);
        const center = p.getCenter();
        expect(center).toEqual({ x: 10, y: 20 });
    });

    it('should place at new position', () => {
        const p = new Point(0, 0);
        p.placeAt(50, 100);
        expect(p.x).toBe(50);
        expect(p.y).toBe(100);
    });
});
```

**src/geometry/__tests__/Vector.test.ts:**
```typescript
import { describe, it, expect } from 'vitest';
import { Vector } from '../Vector';

describe('Vector Intersection', () => {
    it('should detect intersection of perpendicular lines', () => {
        const v1 = new Vector('v1', 0, 0, 100, 0);
        const v2 = new Vector('v2', 50, -50, 50, 50);

        const intersection = v1.intersection(v2);

        expect(intersection).not.toBeNull();
        expect(intersection?.x).toBe(50);
        expect(intersection?.y).toBe(0);
    });

    it('should return null for parallel lines', () => {
        const v1 = new Vector('v1', 0, 0, 100, 0);
        const v2 = new Vector('v2', 0, 10, 100, 10);

        expect(v1.intersection(v2)).toBeNull();
    });
});
```

**src/tokens/__tests__/Collider.test.ts:**
```typescript
describe('Collider', () => {
    it('should detect collision between overlapping circles', () => {
        const c1 = new Collider('c1', 0, 0, 50);
        const c2 = new Collider('c2', 40, 0, 50);

        expect(c1.isCollisioning(c2)).toBe(true);
    });

    it('should not detect collision for separate circles', () => {
        const c1 = new Collider('c1', 0, 0, 10);
        const c2 = new Collider('c2', 100, 0, 10);

        expect(c1.isCollisioning(c2)).toBe(false);
    });
});
```

**Objetivo:** 80%+ de cobertura en core y geometría

---

## 📦 Fase 4: Build y Bundling (Días 14-15)

### 4.1 Configurar Vite para Librería

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'TacticsEngine',
            fileName: (format) => `tactics-engine.${format}.js`,
            formats: ['es', 'umd', 'cjs']
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {}
            }
        },
        sourcemap: true,
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true
            }
        }
    }
});
```

### 4.2 Crear Punto de Entrada Principal

**src/index.ts:**
```typescript
// Core
export { Scene } from './core/Scene';
export { Engine } from './core/Engine';
export { Viewport } from './core/Viewport';

// Geometry
export { Point } from './geometry/Point';
export { CursorPoint } from './geometry/CursorPoint';
export { Vector } from './geometry/Vector';

// Tokens
export { IToken } from './tokens/IToken';
export { ImgToken } from './tokens/ImgToken';
export { Rectangle } from './tokens/Rectangle';
export { WireToken } from './tokens/WireToken';
export { Collider } from './tokens/Collider';
export { ColliderToken } from './tokens/ColliderToken';
export { Shooter } from './tokens/Shooter';
export { AutoToken } from './tokens/AutoToken';

// Projectiles
export { Projectile } from './projectiles/Projectile';
export { BulletProjectile } from './projectiles/BulletProjectile';
export { Effects } from './projectiles/Effects';

// Input
export { Control } from './input/Control';
export { Editor } from './input/Editor';

// Types
export * from './types';

// Version
export const VERSION = '__VERSION__';
```

### 4.3 package.json para Publicación

```json
{
  "name": "@tactics/engine",
  "version": "1.0.0",
  "description": "A 2D game engine for HTML5 Canvas with advanced physics and collision detection",
  "type": "module",
  "main": "./dist/tactics-engine.cjs.js",
  "module": "./dist/tactics-engine.es.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/tactics-engine.es.js",
      "require": "./dist/tactics-engine.cjs.js",
      "types": "./dist/index.d.ts"
    }
  },
  "files": [
    "dist",
    "src"
  ],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "prepublishOnly": "npm run build && npm test"
  },
  "keywords": [
    "game-engine",
    "2d",
    "canvas",
    "physics",
    "collision-detection",
    "typescript"
  ],
  "author": "Tu Nombre",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/tactics-engine"
  },
  "bugs": {
    "url": "https://github.com/tu-usuario/tactics-engine/issues"
  },
  "homepage": "https://github.com/tu-usuario/tactics-engine#readme"
}
```

---

## 📚 Fase 5: Documentación (Días 16-18)

### 5.1 README.md Principal

**README.md:**
````markdown
# 🎮 Tactics Engine

A powerful 2D game engine for HTML5 Canvas with advanced physics, collision detection, and a built-in level editor.

## ✨ Features

- 🎯 **Advanced Physics**: Circular and geometric collision detection
- 🔫 **Projectile System**: Bullets with customizable effects
- 🤖 **Autopilot**: AI-controlled tokens with path planning
- ✏️ **Built-in Editor**: Create levels in real-time
- 🎨 **Flexible Rendering**: Support for images, shapes, and vectors
- 📐 **Geometric Utilities**: Line intersections, rotations, transformations

## 📦 Installation

```bash
npm install @tactics/engine
```

## 🚀 Quick Start

```typescript
import { Scene, Engine, Control, Shooter } from '@tactics/engine';

// Create scene
const scene = new Scene('myCanvas');

// Add player
const player = new Shooter('player', 0, 0, 0, 'player.png', 100, 50);
scene.arrTokens.push(player);

// Start engine
const engine = new Engine(scene);
const control = new Control(engine);

engine.start();
scene.drawScene();
```

## 📖 Documentation

- [API Reference](./docs/API.md)
- [Getting Started Guide](./docs/GETTING_STARTED.md)
- [Examples](./examples)
- [Architecture](./docs/ARCHITECTURE.md)

## 🎓 Examples

See the [examples/](./examples) directory for complete working examples.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📄 License

MIT © [Tu Nombre]
````

### 5.2 Documentación de API

**docs/API.md:**
```markdown
# API Reference

## Core Classes

### Scene

Main compositor and canvas manager.

#### Constructor
```typescript
new Scene(canvasId: string, scenes?: string[])
```

#### Properties
- `canvas: HTMLCanvasElement` - The canvas element
- `arrTokens: IToken[]` - All tokens in the scene
- `tokenIndex: number` - Index of selected token

#### Methods

##### drawScene(timestamp?: number): void
Renders the entire scene. Called automatically by `requestAnimationFrame`.

##### move(x: number, y: number): void
Moves the camera position.

##### centerOn(token: IToken): void
Centers the viewport on a specific token.

##### setToken(tokenId: string): void
Selects a token by ID.

... [continuar con todas las clases]
```

### 5.3 Tutorial Getting Started

**docs/GETTING_STARTED.md:**
```markdown
# Getting Started with Tactics Engine

## Creating Your First Scene

### Step 1: HTML Setup
```html
<!DOCTYPE html>
<html>
<head>
    <title>My Tactics Game</title>
</head>
<body>
    <canvas id="gameCanvas"></canvas>
    <script type="module" src="./game.js"></script>
</body>
</html>
```

### Step 2: Initialize Engine
```typescript
import { Scene, Engine } from '@tactics/engine';

const scene = new Scene('gameCanvas');
const engine = new Engine(scene);
engine.start();
```

### Step 3: Add Your First Token
...
```

---

## 🌐 Fase 6: Ejemplos y Playground (Días 19-21)

### 6.1 Crear Ejemplos Ejecutables

**examples/basic/index.html:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Basic Example - Tactics Engine</title>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #1a1a1a; }
        canvas { border: 2px solid #00ff00; }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <script type="module" src="./main.js"></script>
</body>
</html>
```

**examples/basic/main.js:**
```typescript
import { Scene, Engine, Control, ImgToken } from '../../dist/tactics-engine.es.js';

const scene = new Scene('gameCanvas');

const player = new ImgToken('player', 0, 0, 0, './assets/player.png', 50, 50);
scene.arrTokens.push(player);

const engine = new Engine(scene);
const control = new Control(engine);

engine.start();
scene.drawScene();
```

### 6.2 Playground Interactivo

**examples/playground/index.html:**
```html
<!-- Editor visual in-browser con Monaco Editor -->
<!-- Live reload de código -->
<!-- Selector de ejemplos -->
```

---

## 🚀 Fase 7: Publicación (Día 22)

### 7.1 Pre-publicación Checklist

- [ ] Tests pasan al 100%
- [ ] Build sin errores
- [ ] README completo
- [ ] Licencia MIT incluida
- [ ] package.json correcto
- [ ] .npmignore configurado
- [ ] TypeScript declarations generadas

### 7.2 Publicar en npm

```bash
# Login
npm login

# Dry run
npm publish --dry-run

# Publicar
npm publish --access public

# Verificar
npm info @tactics/engine
```

### 7.3 GitHub Release

```bash
git tag -a v1.0.0 -m "First stable release"
git push origin v1.0.0
```

**Crear release en GitHub con:**
- Changelog
- Assets (dist.zip)
- Ejemplos destacados

---

## 🎯 Post-Publicación

### Semana 2-3

#### SEO y Marketing
- [ ] Publicar en r/gamedev
- [ ] Tweet anuncio
- [ ] Post en dev.to
- [ ] Crear video demo en YouTube

#### Mejoras Continuas
- [ ] GitHub Actions para CI/CD
- [ ] Badges en README (coverage, build status)
- [ ] Website con GitHub Pages
- [ ] CodeSandbox/StackBlitz templates

---

## 📊 Métricas de Éxito

### Objetivos Mes 1
- ⭐ 50+ estrellas en GitHub
- 📥 100+ descargas npm
- 📝 3+ ejemplos completos
- 🐛 Issues resueltos < 7 días
- 📚 Documentación completa

### Objetivos Mes 3
- ⭐ 200+ estrellas
- 📥 1000+ descargas
- 👥 5+ contributors
- 🎮 1+ juego publicado usando la librería

---

## 🛠️ Herramientas Útiles

### Desarrollo
- **Vite**: Build tool
- **Vitest**: Testing framework
- **TypeDoc**: Generador de docs
- **ESLint**: Linter
- **Prettier**: Formatter

### CI/CD
- **GitHub Actions**: Automatización
- **Codecov**: Cobertura de tests
- **Semantic Release**: Versionado automático

### Distribución
- **npm**: Package registry
- **jsDelivr**: CDN para navegador
- **unpkg**: CDN alternativo

---

## ✅ Checklist Final

### Código
- [ ] TypeScript sin errores
- [ ] ESLint sin warnings
- [ ] Prettier aplicado
- [ ] Tests > 80% coverage
- [ ] No dependencias circulares

### Documentación
- [ ] README.md
- [ ] API.md completo
- [ ] GETTING_STARTED.md
- [ ] CONTRIBUTING.md
- [ ] LICENSE

### Publicación
- [ ] npm package publicado
- [ ] GitHub release creado
- [ ] Ejemplos funcionando
- [ ] Website/docs online

---

**¡Listo para crear una librería profesional! 🚀**
