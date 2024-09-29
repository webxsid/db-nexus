/**
 * Event decorator to annotate methods that are associated with a specific event.
 * @param {string} event - The name of the event.
 * @returns {MethodDecorator} - The method decorator.
 */
export const Event = (event: string): MethodDecorator => {
  return (
    target: Function, // The prototype of the class
    key: string | symbol, // The name of the method
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    descriptor: PropertyDescriptor, // The Property Descriptor for the method
  ): void => {
    // Get the base event name from the metadata of the class
    const baseEvent = Reflect.getMetadata("baseEvent", target.constructor);
    // If a base event name exists, prepend it to the event name
    const baseEventName = baseEvent ? `${baseEvent}:` : "";
    const eventName = baseEventName.length
      ? `${baseEventName}:${event}`
      : event;
    // Define a new metadata "event" for the method with the event name
    Reflect.defineMetadata("event", eventName, target, key);
  };
};
