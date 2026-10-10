/** Splits text into parts; only exactly two ASCII digits become tcy (not 3.14, 1,234 or 3+ digits). */
export function splitTcy(text) {
    const re = /(?<![0-9]|[0-9][.,])([0-9]{2})(?![0-9]|[.,][0-9])/g;
    const out = [];
    let last = 0;
    for (const m of text.matchAll(re)) {
        const index = m.index ?? 0;
        const digits = m[1] ?? "";
        if (index > last)
            out.push({ text: text.slice(last, index), tcy: false });
        out.push({ text: digits, tcy: true });
        last = index + digits.length;
    }
    if (last < text.length)
        out.push({ text: text.slice(last), tcy: false });
    return out;
}
const SKIP = "script,style,textarea,pre,code,.sb-tcy,[data-sb-no-tcy]";
/** Wraps two-digit numbers under `root` in `span.sb-tcy`. Idempotent. Returns the number of spans added. */
export function autoTcy(root) {
    const doc = root.ownerDocument ?? root;
    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            if (!node.nodeValue || !/[0-9]{2}/.test(node.nodeValue))
                return NodeFilter.FILTER_REJECT;
            return node.parentElement?.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        },
    });
    const targets = [];
    while (walker.nextNode())
        targets.push(walker.currentNode);
    let count = 0;
    for (const node of targets) {
        const parts = splitTcy(node.nodeValue ?? "");
        if (!parts.some((p) => p.tcy))
            continue;
        const frag = doc.createDocumentFragment();
        for (const p of parts) {
            if (p.tcy) {
                const span = doc.createElement("span");
                span.className = "sb-tcy";
                span.textContent = p.text;
                frag.append(span);
                count++;
            }
            else {
                frag.append(p.text);
            }
        }
        node.parentNode?.replaceChild(frag, node);
    }
    return count;
}
