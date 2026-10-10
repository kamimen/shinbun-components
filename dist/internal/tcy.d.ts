export interface TcyPart {
    text: string;
    tcy: boolean;
}
/** Splits text into parts; only exactly two ASCII digits become tcy (not 3.14, 1,234 or 3+ digits). */
export declare function splitTcy(text: string): TcyPart[];
/** Wraps two-digit numbers under `root` in `span.sb-tcy`. Idempotent. Returns the number of spans added. */
export declare function autoTcy(root: Node): number;
