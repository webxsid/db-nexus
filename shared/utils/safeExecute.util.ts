export const safeExecute = async <T>(
  fn: () => T | Promise<T>,
): Promise<[Awaited<T>, null] | [null, Error]> => {
  try {
    const res = await fn();
    return [res, null];
  } catch (error) {
    return [null, error instanceof Error ? error : new Error(String(error))];
  }
};
