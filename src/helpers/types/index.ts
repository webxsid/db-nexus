export type GetArrayReturnType<T> = T extends Array<infer U> ? U : never;
export type GetObjectReturnType<T> = T extends Record<string, infer U>
  ? U
  : never;
