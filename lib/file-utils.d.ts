/**
 * Use this type when you need to store safe object URLs. And then when you need
 * the actual url, just access the .url member.
 */
export declare class SafeObjectUrl {
    readonly url: string;
    constructor(url: string);
    get unsafeUrl(): string;
}
/**
 * Use this type when you need to store safe object URLs. And then when you need
 * the actual url, just access the .url member.
 */
export declare class ZippedFileStructure {
    readonly src: string;
    readonly skybox: string;
    readonly annotations: any;
    constructor(src: string, skybox: string, annotations: any);
}
/**
 * Returns a SafeUrl, for google3-specific lit-html checks which require them.
 */
export declare function createSafeObjectURL(blob: Blob): SafeObjectUrl;
/** Returns true if the given raw URL is an object URL. */
export declare function isObjectUrl(url: string): boolean;
/**
 * Sanitizes an unsafe URI into a safe one, assuming it points to a supported
 * type (such as an image).
 */
export declare function createSafeObjectUrlFromUnsafe(unsafeUri: string): Promise<SafeObjectUrl>;
/**
 * This should only be used when you don't care what the blob type is. For
 * example, when loading GLBs directly via modelviewer.src.
 */
export declare function urlFromArrayBuffer(contents: ArrayBuffer): SafeObjectUrl;
export declare function urlFromUnzippedFile(file: File): Promise<string>;
export declare function jsonFromFile(file: File): Promise<any>;
