/* eslint-disable @typescript-eslint/no-explicit-any */
export const Singleton = <T extends new (...args: any[]) => any>(
  constructor: T,
): { new(...args: any[]): ({} & any); prototype: {} } => {
  let instance: InstanceType<T>;

  return class extends constructor {
    constructor(...args: any[]) {
      super(...args);
      if (instance) {
        return instance;
      }
      instance = this as InstanceType<T>;
    }
  };
};
