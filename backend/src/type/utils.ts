/** Remove readonly modifiers from object properties */
export type Writable<T extends object> = {
    -readonly [K in keyof T]: T[K];
};
