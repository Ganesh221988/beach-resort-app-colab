"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrefixedId = generatePrefixedId;
function generatePrefixedId(prefix, base, id) {
    return `${prefix}${base + id}`;
}
