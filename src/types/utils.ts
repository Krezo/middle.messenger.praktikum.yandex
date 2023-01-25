export type Nullable<T> = { [K in keyof T]: null | T[K] }
