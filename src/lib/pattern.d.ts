declare module "@/lib/pattern.js" {
  export class PatternCanvas {
    constructor(
      canvas: HTMLCanvasElement,
      container: HTMLElement,
      options?: { color?: { r: number; g: number; b: number } },
    );
    mount(): void;
    destroy(): void;
  }
}
