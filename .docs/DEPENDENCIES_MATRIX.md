# 📊 Matriz de Dependencias - Tactics Engine

## 🔍 Tabla de Relaciones entre Clases

| Clase | Tipo | Hereda de | Usa/Compone | Usada por | Responsabilidad |
|-------|------|-----------|-------------|-----------|-----------------|
| **Point** | Class | - | - | CursorPoint, ImgToken, Collider, Projectile, Vector, Scene | Punto 2D básico con ID y config |
| **CursorPoint** | Class | Point | - | WireToken, ColliderToken | Punto con rotación y movimiento |
| **Vector** | Class | - | Point (a, b) | WireToken, Scene | Segmento de línea, intersecciones |
| **IToken** | Interface | - | Point | ImgToken, Scene | Contrato común de tokens |
| **ImgToken** | Class | Point | HTMLImageElement | Rectangle, ColliderToken, Scene | Token con imagen renderizable |
| **Rectangle** | Class | ImgToken | WireToken | Scene | Rectángulo con detección de colisión |
| **WireToken** | Class | CursorPoint | Point[], Vector | Rectangle, Scene, Editor | Polígono de puntos, intersecciones |
| **Collider** | Class | Point | Collider[] (sub) | ColliderToken, BulletProjectile | Colisión circular recursiva |
| **ColliderToken** | Class | ImgToken | Collider | Shooter, AutoToken, Scene | Token con física de colisión |
| **Shooter** | Class | ColliderToken | BulletProjectile | Scene, Engine | Token que dispara proyectiles |
| **AutoToken** | Class | ColliderToken | - | Scene, Engine | Token con autopilot |
| **Projectile** | Class | Point | - | BulletProjectile | Proyectil base con rango |
| **BulletProjectile** | Class | Projectile | Collider, Effects | Shooter, Scene, Engine | Bala con colisión y efecto |
| **Effects** | Object | - | - | BulletProjectile, Scene | Efectos de impacto (damage, split) |
| **Scene** | Class | - | Canvas, Token[], Effects | Engine, Control, Editor | Compositor principal, renderer |
| **Engine** | Class | - | Scene | Control | Bucle de juego, física |
| **Viewport** | Class | - | - | Scene | Sistema de cámara |
| **Control** | Class | - | Engine | - | Gestión de input, mapeo de teclas |
| **Editor** | Class | - | Scene, WireToken, Point | - | Editor de niveles en tiempo real |

---

## 🎯 Jerarquía de Herencia

```
Point [BASE CLASS]
├── CursorPoint
│   └── WireToken
├── ImgToken
│   ├── Rectangle
│   └── ColliderToken
│       ├── Shooter
│       └── AutoToken
├── Collider
└── Projectile
    └── BulletProjectile
```

---

## 🔗 Gráfico de Dependencias (Simplificado)

### Núcleo (Core)
```
Control → Engine → Scene
            ↓
        arrTokens[] ← Editor
```

### Geometría (Geometry)
```
Point → CursorPoint → WireToken
  ↓                      ↓
Vector               getVectors()
```

### Tokens (Entities)
```
IToken (interface)
   ↓ implements
Point → ImgToken → ColliderToken → Shooter
   ↓        ↓            ↓            ↓
Collider    ↓       Collider    BulletProjectile
            ↓
        Rectangle
```

### Projectiles
```
Point → Projectile → BulletProjectile
                          ↓
                      Collider + Effects
```

---

## 📋 Análisis de Dependencias por Módulo

### 🟢 Módulo `geometry/` (Sin dependencias externas)
**Muy portable, reutilizable**

| Archivo | Depende de | Complejidad |
|---------|------------|-------------|
| Point.ts | - | ⭐ Baja |
| CursorPoint.ts | Point | ⭐ Baja |
| Vector.ts | Point | ⭐⭐ Media |

**✅ Puede extraerse como paquete independiente: `@tactics/geometry`**

---

### 🔵 Módulo `tokens/` (Depende de geometry)

| Archivo | Depende de | Complejidad |
|---------|------------|-------------|
| IToken.ts | Point | ⭐ Baja |
| ImgToken.ts | Point, IToken | ⭐⭐ Media |
| Rectangle.ts | ImgToken, WireToken | ⭐⭐ Media |
| WireToken.ts | CursorPoint, Vector, Point | ⭐⭐⭐ Alta |
| Collider.ts | Point, CursorPoint | ⭐⭐⭐ Alta |
| ColliderToken.ts | ImgToken, Collider | ⭐⭐⭐ Alta |
| Shooter.ts | ColliderToken, BulletProjectile | ⭐⭐ Media |
| AutoToken.ts | ColliderToken | ⭐⭐ Media |

**⚠️ Collider y WireToken son complejos y cruciales**

---

### 🔴 Módulo `projectiles/` (Depende de geometry + tokens)

| Archivo | Depende de | Complejidad |
|---------|------------|-------------|
| Projectile.ts | Point | ⭐ Baja |
| BulletProjectile.ts | Projectile, Collider | ⭐⭐ Media |
| Effects.ts | - | ⭐⭐ Media |

---

### 🟠 Módulo `core/` (Depende de TODO)

| Archivo | Depende de | Complejidad |
|---------|------------|-------------|
| Viewport.ts | - | ⭐ Baja |
| Engine.ts | Scene, AutoToken, Projectile, Shooter, Effects | ⭐⭐⭐⭐ Muy Alta |
| Scene.ts | Point, Rectangle, ColliderToken, ImgToken, Effects, IToken | ⭐⭐⭐⭐⭐ Crítica |

**Scene.ts tiene 823 líneas - Candidato a refactorización**

---

### 🟣 Módulo `input/` (Depende de core)

| Archivo | Depende de | Complejidad |
|---------|------------|-------------|
| Control.ts | Engine | ⭐ Baja |
| Editor.ts | Scene, WireToken, Point | ⭐⭐ Media |

---

## 🚨 Problemas Detectados

### 1. Dependencias Circulares
```
Scene ⟷ Engine
  ↓      ↓
 Token ← BulletProjectile
```

**Solución:** Usar interfaces e inyección de dependencias

---

### 2. Scene.ts es Monolítico (823 líneas)
**Responsabilidades mezcladas:**
- Renderizado
- Gestión de tokens
- Control de cámara
- Gestión de eventos DOM
- Detección de colisiones

**Refactorización sugerida:**
```typescript
Scene (compositor)
  ├── Renderer (renderizado)
  ├── TokenManager (gestión de arrTokens)
  ├── Camera (viewport y centrado)
  ├── EventManager (eventos DOM)
  └── CollisionDetector (física)
```

---

### 3. Uso de Prototipo Mezclado con Clases

**❌ Inconsistente:**
```typescript
export class WireToken {
    constructor(id, p) {...}
}
WireToken.prototype.draw = function(){...}  // ⚠️ Prototipo
```

**✅ Debería ser:**
```typescript
export class WireToken extends CursorPoint {
    constructor(id: string, p: Point) {...}
    
    draw(ctx: CanvasRenderingContext2D): void {...}
}
```

---

### 4. Tipado Incompleto

**❌ Problemas:**
```typescript
this.config: any  // ⚠️ Tipo any
arrTokens: any[]  // ⚠️ Tipo any
```

**✅ Solución:**
```typescript
interface TokenConfig {
    position: 'relative' | 'absolute';
    color: string;
    viewName: boolean;
    selectable: boolean;
}

arrTokens: IToken[]
```

---

## 🎯 Orden de Refactorización Recomendado

### Fase 1: Fundamentos (Sin dependencias)
1. ✅ `Point.ts`
2. ✅ `CursorPoint.ts`
3. ✅ `Vector.ts`
4. ✅ `IToken.ts` (interface)

### Fase 2: Tokens Simples
5. ✅ `ImgToken.ts`
6. ✅ `Rectangle.ts`
7. ✅ `Collider.ts`

### Fase 3: Tokens Complejos
8. ✅ `WireToken.ts`
9. ✅ `ColliderToken.ts`
10. ✅ `Shooter.ts`
11. ✅ `AutoToken.ts`

### Fase 4: Proyectiles
12. ✅ `Projectile.ts`
13. ✅ `BulletProjectile.ts`
14. ✅ `Effects.ts`

### Fase 5: Core (Dependen de todo lo anterior)
15. ✅ `Viewport.ts`
16. ✅ Refactorizar `Scene.ts` en módulos
17. ✅ `Engine.ts`

### Fase 6: Input
18. ✅ `Control.ts`
19. ✅ `Editor.ts`

---

## 📊 Métricas de Complejidad

| Métrica | Actual | Objetivo |
|---------|--------|----------|
| Archivos .ts | 19 | 25+ (separados) |
| Clases | 18 | 22+ |
| Interfaces | 1 | 8+ |
| Tipos exportados | ~0 | 15+ |
| Líneas promedio/archivo | ~150 | <200 |
| Archivo más largo | 823 (Scene.ts) | <400 |
| Tests | 0 | 80%+ coverage |
| Dependencias circulares | 2-3 | 0 |

---

## 🔑 Conceptos Clave para Refactorización

### 1. Separación de Responsabilidades
**Single Responsibility Principle**

Cada clase debe tener UNA razón para cambiar:
- ✅ `Point`: Gestionar coordenadas 2D
- ✅ `Collider`: Detectar colisiones
- ❌ `Scene`: ~~Renderizar + Gestionar tokens + Eventos DOM + Física~~ ← MALO

### 2. Inversión de Dependencias
**Dependency Inversion Principle**

Depender de abstracciones, no de implementaciones:
```typescript
// ❌ MAL
class Engine {
    constructor(scene: Scene) {...}  // Acoplado a Scene
}

// ✅ BIEN
interface IScene {
    arrTokens: IToken[];
    render(): void;
}

class Engine {
    constructor(scene: IScene) {...}  // Flexible
}
```

### 3. Composición sobre Herencia
**Favor Composition over Inheritance**

```typescript
// ❌ Herencia profunda
class Shooter extends ColliderToken extends ImgToken extends Point

// ✅ Composición
class Shooter {
    private sprite: Sprite;
    private collider: Collider;
    private weapon: Weapon;
}
```

---

## 🛠️ Herramientas de Análisis

### Analizar Dependencias
```bash
npm install -g madge

# Generar gráfico de dependencias
madge --image deps.svg src/

# Detectar ciclos
madge --circular src/
```

### Analizar Complejidad
```bash
npm install -g complexity-report

# Reporte de complejidad ciclomática
cr src/**/*.ts
```

### Verificar Tipos
```bash
# Chequeo estricto
npx tsc --noEmit --strict
```

---

## ✅ Checklist de Refactorización por Archivo

Para cada archivo `.ts`:

- [ ] Convertir función a clase ES6
- [ ] Eliminar `.prototype`
- [ ] Añadir tipos a todos los parámetros
- [ ] Eliminar `any`
- [ ] Añadir JSDoc a métodos públicos
- [ ] Extraer interfaces donde sea necesario
- [ ] Crear tests unitarios
- [ ] Eliminar `console.log`
- [ ] Agregar validación de parámetros
- [ ] Documentar casos edge

---

## 📈 Roadmap Visual

```
Semana 1: Geometría
  ├── Point ✓
  ├── CursorPoint ✓
  └── Vector ✓

Semana 2: Tokens Básicos
  ├── IToken ✓
  ├── ImgToken ✓
  ├── Rectangle ✓
  └── Collider ✓

Semana 3: Tokens Avanzados
  ├── WireToken ✓
  ├── ColliderToken ✓
  ├── Shooter ✓
  └── AutoToken ✓

Semana 4: Proyectiles
  ├── Projectile ✓
  ├── BulletProjectile ✓
  └── Effects ✓

Semana 5: Core
  ├── Viewport ✓
  ├── Scene Refactor ✓
  └── Engine ✓

Semana 6: Input + Tests
  ├── Control ✓
  ├── Editor ✓
  └── Tests 80%+ ✓
```

---

**Este análisis te da la hoja de ruta completa para convertir Tactics en una librería profesional. ¿Por dónde quieres empezar?** 🚀
