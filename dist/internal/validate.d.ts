export declare const PLACEMENT_RANGE: {
    readonly span: {
        readonly min: 1;
        readonly max: 15;
    };
    readonly y: {
        readonly min: 1;
        readonly max: 15;
    };
    readonly x: {
        readonly min: 1;
        readonly max: 60;
    };
    readonly w: {
        readonly min: 1;
        readonly max: 60;
    };
};
export type PlacementName = keyof typeof PLACEMENT_RANGE;
export interface IntRange {
    min: number;
    max: number;
}
export declare function parseIntInRange(value: string | null, { min, max }: IntRange): number | null;
export declare function parsePositiveInt(value: string | null): number | null;
export declare function parseLength(value: string | null): string | null;
export declare function parseRatio(value: string | null): string | null;
export declare function parseEnum<T extends string>(value: string | null, allowed: readonly T[]): T | null;
