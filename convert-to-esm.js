#!/usr/bin/env node

/**
 * Convierte archivos JS de CommonJS a ES Modules
 * Reemplaza: require() -> import
 *            exports. -> export
 */

const fs = require('fs');
const path = require('path');

function convertFile(filePath) {
    console.log(`Convirtiendo: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');

    // Eliminar "use strict"
    content = content.replace(/^"use strict";\s*/gm, '');

    // Eliminar Object.defineProperty(exports, "__esModule...
    content = content.replace(/Object\.defineProperty\(exports,\s*"__esModule",\s*\{\s*value:\s*true\s*\}\);?\s*/g, '');

    // Convertir exports.NombreClase = ...
    content = content.replace(/exports\.(\w+)\s*=/g, 'export const $1 =');

    // Convertir module.exports = ...
    content = content.replace(/module\.exports\s*=\s*(\w+)/g, 'export { $1 }');

    // Convertir var nombre_1 = require("./path");
    content = content.replace(/var\s+(\w+)\s*=\s*require\("([^"]+)"\);?/g, 'import * as $1 from "$2.js";');

    // Guardar
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Convertido: ${filePath}`);
}

// Archivos a convertir
const files = [
    'lib/tactics.js'
];

files.forEach(convertFile);

console.log('\n✅ Conversión completada!');
