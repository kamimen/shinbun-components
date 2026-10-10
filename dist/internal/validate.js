export const PLACEMENT_RANGE = {
    span: { min: 1, max: 15 },
    y: { min: 1, max: 15 },
    x: { min: 1, max: 60 },
    w: { min: 1, max: 60 },
};
export function parseIntInRange(value, { min, max }) {
    if (value === null)
        return null;
    const text = value.trim();
    if (!/^[0-9]+$/.test(text))
        return null;
    const n = Number(text);
    return n >= min && n <= max ? n : null;
}
export function parsePositiveInt(value) {
    return parseIntInRange(value, { min: 1, max: 1000 });
}
const LENGTH = /^(?:[0-9]+|[0-9]*\.[0-9]+)(?:px|rem|em|pt|vw|vh|ch|cqw)$/;
export function parseLength(value) {
    if (value === null)
        return null;
    const text = value.trim();
    return LENGTH.test(text) && Number.parseFloat(text) > 0 ? text : null;
}
const RATIO = /^(?:[0-9]+|[0-9]*\.[0-9]+)(?:\s*\/\s*(?:[0-9]+|[0-9]*\.[0-9]+))?$/;
export function parseRatio(value) {
    if (value === null)
        return null;
    const text = value.trim();
    if (!RATIO.test(text))
        return null;
    const parts = text.split("/").map((p) => Number.parseFloat(p));
    return parts.every((n) => n > 0) ? text : null;
}
export function parseEnum(value, allowed) {
    if (value === null)
        return null;
    const text = value.trim();
    return allowed.includes(text) ? text : null;
}
