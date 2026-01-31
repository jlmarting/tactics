# 🎮 Ejemplos de Uso - Tactics Engine API

## 📚 Guía de Uso de la Librería

Esta guía muestra cómo usar Tactics Engine una vez convertido en librería npm.

---

## 🚀 Instalación

```bash
npm install @tactics/engine
```

O con yarn:
```bash
yarn add @tactics/engine
```

---

## 🎯 Ejemplo 1: Hello World

El ejemplo más básico - un token en pantalla.

```typescript
import { Scene, Engine, ImgToken } from '@tactics/engine';

// 1. Crear escena
const scene = new Scene('myCanvas');

// 2. Crear token
const player = new ImgToken('player', 0, 0, 0, './player.png', 50, 50);
scene.arrTokens.push(player);

// 3. Iniciar motor
const engine = new Engine(scene);
engine.start();

// 4. Renderizar
scene.drawScene();
```

**HTML:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hello Tactics</title>
</head>
<body>
    <canvas id="myCanvas" width="800" height="600"></canvas>
    <script type="module" src="./game.js"></script>
</body>
</html>
```

---

## 🎮 Ejemplo 2: Token Controlable

Añadir control de teclado al jugador.

```typescript
import { Scene, Engine, Control, Shooter } from '@tactics/engine';

const scene = new Scene('gameCanvas');

// Crear shooter (token que puede moverse y disparar)
const player = new Shooter(
    'player',          // id
    100, 100,          // x, y inicial
    0,                 // rotación inicial (radianes)
    './tank.png',      // imagen
    100, 50            // width, height
);

player.config.viewName = true;
player.config.selectable = true;

// Añadir a la escena
scene.arrTokens.push(player);
scene.setToken('player');  // Hacer este token el activo

// Configurar motor y control
const engine = new Engine(scene);
const control = new Control(engine);

// Iniciar
engine.start();
scene.drawScene();
```

**Controles:**
- ⬆️ Arriba: Avanzar
- ⬇️ Abajo: Retroceder
- ⬅️ Izquierda: Rotar a la izquierda
- ➡️ Derecha: Rotar a la derecha
- Espacio: Disparar

---

## 🤖 Ejemplo 3: Enemigos con Autopilot

Tokens que se mueven automáticamente.

```typescript
import { Scene, Engine, AutoToken, ColliderToken } from '@tactics/engine';

const scene = new Scene('gameCanvas');

// Crear obstáculo estático
const wall = new ColliderToken(
    'wall',
    400, 300,
    0,
    './wall.png',
    100, 200
);
scene.arrTokens.push(wall);

// Crear enemigo con autopilot
const enemy = new AutoToken(
    'enemy1',
    0, 0,
    0,
    './enemy.png',
    80, 40
);

// Definir plan de movimiento
enemy.plan = [
    'up', 'up', 'up', 'up',
    'right', 'right',
    'down', 'down', 'down', 'down',
    'left', 'left'
];

enemy.config.viewName = true;
scene.arrTokens.push(enemy);

const engine = new Engine(scene);
engine.start();
scene.drawScene();
```

---

## 💥 Ejemplo 4: Sistema de Disparos con Efectos

Balas con efectos de daño.

```typescript
import { Scene, Engine, Control, Shooter, Effects } from '@tactics/engine';

const scene = new Scene('gameCanvas');

// Configurar efecto de bala
scene.config.effect = 'damage';  // 'damage', 'split', o 'brick'

// Crear tanque
const tank = new Shooter('tank', 200, 200, 0, './tank.png', 100, 50);
tank.displ = 3;  // Velocidad de movimiento
tank.bulletCount = 100;  // Munición

// Crear objetivo
const target = new ColliderToken('target', 500, 200, 0, './box.png', 50, 50);
target.health = 100;

scene.arrTokens.push(tank);
scene.arrTokens.push(target);

scene.setToken('tank');

const engine = new Engine(scene);
const control = new Control(engine);

// Escuchar eventos de colisión (futura API)
scene.on('collision', (bullet, target) => {
    console.log(`Impacto! ${bullet.id} golpeó a ${target.id}`);
});

engine.start();
scene.drawScene();
```

---

## 📐 Ejemplo 5: Editor de Niveles

Usar el editor integrado para crear geometría.

```typescript
import { Scene, Engine, Editor } from '@tactics/engine';

const scene = new Scene('editorCanvas');
const engine = new Engine(scene);

// Activar editor
const editor = new Editor(scene);

engine.start();
scene.drawScene();
```

**Uso del Editor:**
1. **Click** en el canvas para añadir puntos
2. **Tecla 'n'**: Crear WireToken con los puntos actuales
3. **Tecla 'd'**: Borrar puntos
4. **Tecla 's'**: Demo de rotación

**Resultado:** Polígonos personalizados dibujados en tiempo real.

---

## 🎨 Ejemplo 6: Múltiples Escenas

Diseño con diferentes escenas pre-cargadas.

```typescript
import { Scene, Engine } from '@tactics/engine';

// Crear escena con múltiples layouts
const scene = new Scene('gameCanvas', [
    'menu',
    'level1',
    'level2',
    'boss'
]);

// Función para cargar nivel 1
function loadLevel1() {
    scene.arrTokens = [];  // Limpiar
    
    // Crear elementos del nivel 1
    const player = new Shooter('player', 0, 0, 0, './player.png', 50, 50);
    const enemy1 = new AutoToken('enemy1', 300, 200, 0, './enemy.png', 40, 40);
    const enemy2 = new AutoToken('enemy2', 500, 400, 0, './enemy.png', 40, 40);
    
    scene.arrTokens.push(player, enemy1, enemy2);
    scene.setToken('player');
}

// Función para cargar menú
function loadMenu() {
    scene.arrTokens = [];
    // ... crear elementos de menú
}

// Iniciar con menú
loadMenu();

const engine = new Engine(scene);
engine.start();
scene.drawScene();

// Cambiar de escena
document.getElementById('startButton').addEventListener('click', () => {
    loadLevel1();
});
```

---

## 🏗️ Ejemplo 7: Construcción de Muros

Crear estructuras complejas con ladrillos.

```typescript
import { Scene, Engine, ColliderToken } from '@tactics/engine';

const scene = new Scene('gameCanvas');

// Función para crear muro
function createWall(startX: number, startY: number, bricksX: number, bricksY: number) {
    const brickWidth = 32;
    const brickHeight = 20;
    
    for (let i = 0; i < bricksX; i++) {
        for (let j = 0; j < bricksY; j++) {
            const brick = new ColliderToken(
                `brick_${i}_${j}`,
                startX + (brickWidth * i),
                startY + (brickHeight * j),
                0,
                './brick.png',
                brickWidth,
                brickHeight
            );
            
            brick.health = 50;
            brick.config.viewName = false;
            
            scene.arrTokens.push(brick);
        }
    }
}

// Crear muro horizontal superior
createWall(-400, -300, 50, 3);

// Crear muro vertical izquierdo
createWall(-400, -200, 2, 30);

const engine = new Engine(scene);
engine.start();
scene.drawScene();
```

---

## 🎯 Ejemplo 8: Detección de Colisiones Personalizada

Verificar colisiones entre tokens específicos.

```typescript
import { Scene, Engine, ColliderToken, Collider } from '@tactics/engine';

const scene = new Scene('gameCanvas');

// Crear objetos con colliders
const box1 = new ColliderToken('box1', 100, 100, 0, './box.png', 50, 50);
const box2 = new ColliderToken('box2', 200, 100, 0, './box.png', 50, 50);

// Añadir sub-colliders para detección más precisa
box1.collider.addSubCollider();
box2.collider.addSubCollider();

scene.arrTokens.push(box1, box2);

// Verificar colisiones manualmente
function checkCollision() {
    if (box1.collider.isCollisioning(box2.collider)) {
        console.log('¡Colisión detectada!');
        box1.config.color = 'red';
        box2.config.color = 'red';
    } else {
        box1.config.color = 'green';
        box2.config.color = 'green';
    }
}

const engine = new Engine(scene);

// Agregar verificación al bucle de juego
setInterval(checkCollision, 100);

engine.start();
scene.drawScene();
```

---

## 🌊 Ejemplo 9: Intersecciones Geométricas

Usar WireToken para detectar intersecciones.

```typescript
import { Scene, Engine, WireToken, Point } from '@tactics/engine';

const scene = new Scene('gameCanvas');

// Crear línea 1 (horizontal)
const line1 = new WireToken('line1', new Point(0, 0));
line1.load(new Point(-200, 0));
line1.load(new Point(200, 0));
line1.config.closed = false;
line1.config.color = 'blue';

// Crear línea 2 (vertical)
const line2 = new WireToken('line2', new Point(0, 0));
line2.load(new Point(0, -200));
line2.load(new Point(0, 200));
line2.config.closed = false;
line2.config.color = 'red';

scene.arrTokens.push(line1, line2);

// Calcular intersecciones
const intersections = line1.getIntersections(line2);

intersections.forEach((point, index) => {
    point.config.color = 'yellow';
    point.id = `intersection_${index}`;
    scene.buffer.intersections.push(point);
    
    console.log(`Intersección en: (${point.x}, ${point.y})`);
});

const engine = new Engine(scene);
engine.start();
scene.drawScene();
```

---

## 📹 Ejemplo 10: Control de Cámara

Centrar la vista en un token en movimiento.

```typescript
import { Scene, Engine, Control, Shooter } from '@tactics/engine';

const scene = new Scene('gameCanvas');

// Crear mundo grande
const worldSize = 2000;
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        const grass = new ImgToken(
            `grass_${i}_${j}`,
            i * 200 - worldSize/2,
            j * 200 - worldSize/2,
            0,
            './grass.png',
            200, 200
        );
        scene.arrTokens.push(grass);
    }
}

// Jugador
const player = new Shooter('player', 0, 0, 0, './player.png', 50, 50);
scene.arrTokens.push(player);
scene.setToken('player');

const engine = new Engine(scene);
const control = new Control(engine);

// La cámara seguirá automáticamente al jugador seleccionado
engine.start();
scene.drawScene();

// Centrar manualmente en un punto
scene.move(100, 100);

// Centrar en el jugador
scene.center();  // Centra en el token seleccionado

// Centrar en un token específico
scene.centerOn(player);
```

---

## 🎨 Ejemplo 11: Configuración Avanzada

Personalizar todos los aspectos de la visualización.

```typescript
import { Scene, Engine, ColliderToken } from '@tactics/engine';

const scene = new Scene('gameCanvas');

// Configurar viewport
scene.config.viewport = {
    enabled: true,
    width: 800,
    height: 600
};

// Configurar debug
scene.config.debug = {
    showIds: true,
    showColliders: true,
    showLines: true,
    showGrid: true,
    showFPS: true
};

// Crear token con configuración personalizada
const token = new ColliderToken('custom', 0, 0, 0, './sprite.png', 100, 50);

token.config = {
    viewName: true,
    selectable: true,
    color: 'cyan',
    position: 'relative',
    enabled: true
};

token.collider.config = {
    visible: true,
    innerColor: 'rgba(0, 255, 0, 0.3)',
    borderColor: 'lime',
    borderWidth: 2
};

scene.arrTokens.push(token);

const engine = new Engine(scene);
engine.start();
scene.drawScene();
```

---

## 🎯 Ejemplo 12: API Completa - Juego Completo

Ejemplo completo con todos los sistemas integrados.

```typescript
import {
    Scene,
    Engine,
    Control,
    Editor,
    Shooter,
    AutoToken,
    ColliderToken,
    ImgToken,
    WireToken,
    Point,
    Effects
} from '@tactics/engine';

// ========== CONFIGURACIÓN ==========
const config = {
    canvas: 'gameCanvas',
    fps: 60,
    debug: false,
    scenes: ['menu', 'game', 'gameover']
};

// ========== CREAR ESCENA ==========
const scene = new Scene(config.canvas, config.scenes);

// ========== JUGADOR ==========
const player = new Shooter('player', 0, 0, 0, './assets/player.png', 100, 50);
player.displ = 5;
player.bulletCount = 100;
player.collider.addSubCollider();
player.config.viewName = true;
player.config.selectable = true;

// ========== ENEMIGOS ==========
const enemies: AutoToken[] = [];

for (let i = 0; i < 5; i++) {
    const enemy = new AutoToken(
        `enemy_${i}`,
        Math.random() * 800 - 400,
        Math.random() * 600 - 300,
        0,
        './assets/enemy.png',
        80, 40
    );
    
    enemy.plan = ['up', 'up', 'right', 'right', 'down', 'down', 'left', 'left'];
    enemy.health = 50;
    enemy.collider.addSubCollider();
    
    enemies.push(enemy);
    scene.arrTokens.push(enemy);
}

// ========== OBSTÁCULOS ==========
function createWall(x: number, y: number, width: number, height: number) {
    const wall = new ColliderToken('wall', x, y, 0, './assets/wall.png', width, height);
    wall.health = 200;
    scene.arrTokens.push(wall);
}

createWall(-300, 0, 50, 400);
createWall(300, 0, 50, 400);
createWall(0, -250, 600, 50);

// ========== BACKGROUND ==========
const background = new ImgToken('bg', 0, 0, 0, './assets/background.png', 1600, 1200);
scene.arrTokens.unshift(background);  // Añadir al principio para renderizar detrás

// ========== AÑADIR JUGADOR ==========
scene.arrTokens.push(player);
scene.setToken('player');

// ========== CONFIGURAR EFECTOS ==========
scene.config.effect = 'damage';

// ========== MOTOR Y CONTROL ==========
const engine = new Engine(scene);
const control = new Control(engine);

// ========== GAME LOGIC ==========
let score = 0;
let gameOver = false;

// Detectar cuando un enemigo es destruido
setInterval(() => {
    enemies.forEach((enemy, index) => {
        if (enemy.health <= 0 && !enemy.delete) {
            enemy.delete = true;
            score += 10;
            console.log(`Enemy destroyed! Score: ${score}`);
            
            // Verificar victoria
            if (enemies.every(e => e.delete)) {
                console.log('¡Victoria! Todos los enemigos eliminados');
                gameOver = true;
            }
        }
    });
    
    // Verificar derrota
    if (player.health <= 0) {
        console.log('Game Over');
        gameOver = true;
    }
}, 100);

// ========== INICIAR ==========
engine.start();
scene.drawScene();

// ========== UI ==========
const scoreElement = document.getElementById('score');
const healthElement = document.getElementById('health');

function updateUI() {
    if (scoreElement) scoreElement.textContent = `Score: ${score}`;
    if (healthElement) healthElement.textContent = `Health: ${player.health}`;
}

setInterval(updateUI, 100);
```

**HTML completo:**
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tactics Game</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            font-family: 'Arial', sans-serif;
        }
        
        #gameContainer {
            position: relative;
            box-shadow: 0 10px 50px rgba(0,0,0,0.5);
        }
        
        canvas {
            display: block;
            border: 3px solid #00ff88;
            border-radius: 10px;
        }
        
        #ui {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: #00ff88;
            padding: 20px;
            border-radius: 10px;
            font-size: 18px;
        }
        
        #controls {
            position: absolute;
            bottom: 20px;
            left: 20px;
            background: rgba(0,0,0,0.7);
            color: #fff;
            padding: 15px;
            border-radius: 10px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div id="gameContainer">
        <canvas id="gameCanvas" width="1024" height="768"></canvas>
        
        <div id="ui">
            <div id="score">Score: 0</div>
            <div id="health">Health: 100</div>
        </div>
        
        <div id="controls">
            <strong>Controls:</strong><br>
            ⬆️ Up | ⬇️ Down | ⬅️ Left | ➡️ Right<br>
            Space: Fire
        </div>
    </div>
    
    <script type="module" src="./game.js"></script>
</body>
</html>
```

---

## 🎓 Mejores Prácticas

### ✅ DO (Hacer)

```typescript
// Usar nombres descriptivos
const player = new Shooter('player', ...);

// Configurar antes de añadir a la escena
player.config.selectable = true;
scene.arrTokens.push(player);

// Limpiar tokens eliminados
token.delete = true;  // Se limpiará automáticamente

// Usar sub-colliders para precisión
player.collider.addSubCollider();
```

### ❌ DON'T (No hacer)

```typescript
// No mutar arrTokens directamente durante el bucle
// ❌ MAL
scene.arrTokens.forEach(token => {
    scene.arrTokens.push(newToken);  // Puede causar bucle infinito
});

// ✅ BIEN
const newTokens = [];
scene.arrTokens.forEach(token => {
    newTokens.push(createToken());
});
scene.arrTokens.push(...newTokens);

// No crear IDs duplicados
// ❌ MAL
new Shooter('player', ...);
new Shooter('player', ...);  // ID duplicado

// ✅ BIEN
new Shooter('player1', ...);
new Shooter('player2', ...);
```

---

## 📦 Recursos Adicionales

- **Documentación completa:** [docs/API.md](./API.md)
- **Arquitectura:** [docs/ARCHITECTURE.md](./ARCHITECTURE.md)
- **Plan de conversión:** [docs/LIBRARY_CONVERSION_PLAN.md](./LIBRARY_CONVERSION_PLAN.md)
- **Dependencias:** [docs/DEPENDENCIES_MATRIX.md](./DEPENDENCIES_MATRIX.md)

---

**¡Listo para crear juegos increíbles con Tactics Engine! 🎮🚀**
