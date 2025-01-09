export type TGetArrayReturnType<T> = T extends Array<infer U> ? U : never;
export type TGetObjectReturnType<T> = T extends Record<string, infer U>
  ? U
  : never;
