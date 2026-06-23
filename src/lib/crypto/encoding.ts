export function arrayBufferToBase64(buffer: ArrayBuffer | ArrayBufferView): string {
  const view = ArrayBuffer.isView(buffer)
    ? new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength)
    : new Uint8Array(buffer);

  if (typeof window !== 'undefined') {
    let binary = '';
    const len = view.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(view[i]);
    }
    return window.btoa(binary);
  }
  return Buffer.from(view.buffer, view.byteOffset, view.byteLength).toString('base64');
}

export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  if (typeof window !== 'undefined') {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  const buf = Buffer.from(base64, 'base64');
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

export function stringToBuffer(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export function bufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}
