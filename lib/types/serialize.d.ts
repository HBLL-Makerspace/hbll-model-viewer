import "reflect-metadata";
/**
 * Decorator to take the property in account during the serialize and deserialize function
 * @param {Args} args Arguments to describe the property
 */
export declare function JsonProperty(args?: any): Function;
/**
 * Decorator to make a class Serializable
 *
 * BREAKING CHANGE: Since version 2.0.0 the parameter `baseClassName` is not needed anymore
 */
export declare function Serializable(): Function;
/**
 * Function to deserialize json into a class
 *
 * @param {object} json The json to deserialize
 * @param {new (...params: Array<any>) => T} type The class in which we want to deserialize
 * @returns {T} The instance of the specified type containing all deserialized properties
 */
export declare function deserialize<T>(json: any, type: new (...params: Array<any>) => T): T;
/**
 * Function to serialize a class into json
 *
 * @param {any} instance Instance of the object to deserialize
 * @param {boolean} removeUndefined Indicates if you want to keep or remove undefined values
 * @returns {any} The json object
 */
export declare function serialize(instance: any, removeUndefined?: boolean): any;
