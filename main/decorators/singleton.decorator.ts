/* eslint-disable @typescript-eslint/no-explicit-any */
export const Singleton = <T extends new (...args: any[]) => any>(
  constructor: T,
): T => {
  let instance: InstanceType<T>;

  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      if (instance) {
        return instance;
      }
      instance = this;
    }
  };
};
