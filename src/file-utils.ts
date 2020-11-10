/**
 * Use this type when you need to store safe object URLs. And then when you need
 * the actual url, just access the .url member.
 */
export class SafeObjectUrl {
  constructor(readonly url: string) {}
  get unsafeUrl(): string {
    return this.url;
  }
}

/**
 * Use this type when you need to store safe object URLs. And then when you need
 * the actual url, just access the .url member.
 */
export class ZippedFileStructure {
  constructor(
    readonly src: string,
    readonly skybox: string,
    readonly annotations: any
  ) {}
}

/**
 * Returns a SafeUrl, for google3-specific lit-html checks which require them.
 */
export function createSafeObjectURL(blob: Blob): SafeObjectUrl {
  return new SafeObjectUrl(URL.createObjectURL(blob));
}

/** Returns true if the given raw URL is an object URL. */
export function isObjectUrl(url: string): boolean {
  try {
    return new URL(url).protocol === "blob:";
  } catch (_) {
    return false;
  }
}

/**
 * Sanitizes an unsafe URI into a safe one, assuming it points to a supported
 * type (such as an image).
 */
export async function createSafeObjectUrlFromUnsafe(
  unsafeUri: string
): Promise<SafeObjectUrl> {
  return new SafeObjectUrl(unsafeUri);
}

/**
 * This should only be used when you don't care what the blob type is. For
 * example, when loading GLBs directly via modelviewer.src.
 */
export function urlFromArrayBuffer(contents: ArrayBuffer) {
  return createSafeObjectURL(new Blob([new Uint8Array(contents)]));
}

export async function urlFromUnzippedFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const safeObjectUrl = urlFromArrayBuffer(arrayBuffer);
  const unsafeUrl = file.name.match(/\.(hdr)$/i)
    ? safeObjectUrl.unsafeUrl + "#.hdr"
    : safeObjectUrl.unsafeUrl;
  return unsafeUrl;
}

// export async function urlFromZippedFile(file: File) {
//   let src: string;
//   let skybox: string;
//   let annotations: any;
// }

export async function jsonFromFile(file: File) {
  return JSON.parse((await file.text()).toString());
}

export async function getJsonFromUrl(url: string): Promise<any> {
  console.log("Getting: " + url);
  let json = await fetch(url);
  console.log(json);
  if (json.ok) {
    return await json.json();
  } else return undefined;
}

export async function gettextFromFile(
  url: string
): Promise<string | undefined> {
  let file = await fetch(url);
  if (file.ok) {
    return await file.text();
  }
  return undefined;
}
