declare module 'opencv4nodejs' {
  export class Mat {
    matMul(pixel: any) {
      throw new Error('Method not implemented.');
    }
    rows: number;
    cols: number;
    type: number;
    channels: number;
    empty: boolean;

    constructor(rows: number, cols: number, type: number);
    getDataAsArray(): number[][][];
    set(row: number, col: number, value: number[]): void;
  }

  export function imdecode(buffer: Buffer): Mat;
  export function imencode(ext: string, mat: Mat): Buffer;
  
  // Constants
  export const CV_8UC3: number;
  export const CV_32FC3: number;
  export const COLOR_BGR2RGB: number;
  export const COLOR_RGB2BGR: number;
} 