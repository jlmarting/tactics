# 🛠️ Guía de Setup - Arreglar Error de Carga

## 🔍 Problema Detectado

El error que ves:
```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tactics = void 0;
```

**Causa:** TypeScript está compilando a CommonJS (`require`/`exports`) pero el navegador no entiende ese formato.

---

## ✅ Soluciones (3 Opciones)

### **Opción 1: Quick Fix - Instalar npm y Recompilar** ⚡

La más rápida si tienes permisos de sudo:

```bash
# Instalar npm
sudo apt install npm

# Ir al proyecto
cd /home/jl/Proyectos/html/tactics

# Compilar TypeScript con la nueva configuración
npx tsc

# Recargar index.html en el navegador
```

**Resultado:** El código se re-compilará a ES2020 modules y funcionará en el navegador.

---

### **Opción 2: Usar Vite (RECOMENDADO)** 🚀

Setup profesional con hot-reload automático:

```bash
# 1. Instalar npm (si no está)
sudo apt install npm

# 2. Ir al proyecto
cd /home/jl/Proyectos/html/tactics

# 3. Inicializar proyecto
npm init -y

# 4. Instalar Vite y TypeScript
npm install --save-dev vite typescript

# 5. Crear archivo de entrada simple
# (Ya he actualizado tsconfig.json y index.html)

# 6. Agregar script al package.json
# Edita package.json y agrega en "scripts":
#   "dev": "vite",
#   "build": "tsc && vite build"

# 7. Ejecutar servidor de desarrollo
npm run dev
```

Vite abrirá un servidor en `http://localhost:5173` con hot-reload automático.

**Ventajas:**
- ✅ Hot reload (no necesitas recargar manualmente)
- ✅ Compilación automática
- ✅ Fast refresh (cambios instantáneos)
- ✅ Preparado para producción

---

### **Opción 3: Compiación Manual (Sin instalar nada)** 🔧

Si no puedes instalar npm, puedes usar un compilador online temporal:

1. **Usar el TypeScript Playground:**
   - Ve a https://www.typescriptlang.org/play
   - Copia el contenido de `lib/tactics.ts`
   - Configura el target a ES2020
   - Copia el JS generado y guárdalo en `lib/tactics.js`
   - Repite para cada archivo `.ts` 😅 (tedioso pero funciona)

2. **O usar un servicio de CDN:**
   Cargar TypeScript directamente en el navegador (no recomendado para producción):

```html
<!-- En index.html, reemplaza el script tag por esto: -->
<script src="https://unpkg.com/typescript@latest/lib/typescript.js"></script>
<script>
    // Cargar y compilar TypeScript en tiempo real
    // (LENTO y no recomendado, solo para emergencias)
</script>
```

---

## 📋 Archivos Ya Actualizados

He actualizado estos archivos para ti:

### ✅ **tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",  // ← Cambiado de "commonjs"
    "lib": ["ES2020", "DOM"],
    ...
  }
}
```

### ✅ **index.html**
```html
<!-- Cambiado a ES6 module -->
<script type="module" src="lib/tactics.js"></script>
```

---

## 🎯 Próximos Pasos Recomendados

### Si tienes permisos de sudo:

**Recomiendo fuertemente la Opción 2 (Vite)** porque:

1. Ya estás pensando en convertir esto en librería
2. Vite es el estándar moderno (usado en Vue, React, etc.)
3. Hot-reload te ahorrará MUCHO tiempo
4. Es lo que usaremos en la refactorización de todos modos

### Si NO tienes permisos:

1. Pide que instalen `npm` (es estándar en desarrollo web moderno)
2. O temporalmente usa la Opción 3 para un archivo específico

---

## 🛠️ Setup Completo con Vite (Paso a Paso)

Si decides ir con Vite, aquí están TODOS los pasos:

```bash
# 1. Instalar npm (una sola vez
)
sudo apt update
sudo apt install npm

# 2. Verificar instalación
npm --version
node --version

# 3. Ir al proyecto
cd /home/jl/Proyectos/html/tactics

# 4. Inicializar package.json
npm init -y

# 5. Instalar dependencias de desarrollo
npm install --save-dev vite typescript

# 6. (Opcional) Instalar tipos de DOM
npm install --save-dev @types/node

# 7. Crear vite.config.ts (opcional, para configuración avanzada)
```

**vite.config.ts** (crear este archivo):
```typescript
import { defineConfig } from 'vite';

export default defineConfig({
    root: './',
    publicDir: 'img',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: './index.html'
            }
        }
    },
    server: {
        port: 3000,
        open: true
    }
});
```

**package.json** (actualizar la sección "scripts"):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

**Luego ejecutar:**
```bash
npm run dev
```

Abrirá `http://localhost:3000` con tu juego funcionando.

---

## ❓ ¿Qué Opción Prefieres?

Dime cuál opción te va mejor y te ayudo a completar el setup:

1. **Opción 1**: Instalar npm y compilar (5 minutos)
2. **Opción 2**: Setup completo con Vite (10 minutos, recomendado)
3. **Opción 3**: Manual/temporal (variable)

---

## 🚨 Nota Importante

Una vez que tengamos esto funcionando, podremos:
- ✅ Ver el juego en el navegador sin errores
- ✅ Identificar otros bugs si existen
- ✅ Empezar la refactorización con confianza
- ✅ Tener un entorno de desarrollo profesional

**La configuración inicial es clave para un desarrollo eficiente.** 💪
