/**
 * Event decorator to annotate methods that are associated with a specific event.
 * @param {string} event - The name of the event.
 * @returns {MethodDecorator} - The method decorator.
 */
export const Event = (event: string): MethodDecorator => {
  return (
    target: Object, // The prototype of the class
    key: string | symbol, // The name of the method
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    descriptor: PropertyDescriptor, // The Property Descriptor for the method
  ): void => {
    Reflect.defineMetadata("event", event, target, key);
  };
};
