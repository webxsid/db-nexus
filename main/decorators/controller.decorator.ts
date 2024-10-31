import "reflect-metadata";

export const Controller = (baseEvent: string): ClassDecorator => {
  return (target: Function): void => {
    Reflect.defineMetadata("baseEvent", baseEvent, target.prototype);
  };
};
