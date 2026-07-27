declare module "@/lib/pattern.js" {
  export class PatternCanvas {
    constructor(
      canvas: HTMLCanvasElement,
      container: HTMLElement,
      options?: {
        color?: { r: number; g: number; b: number };
        lineCount?: number | null;
        drawOnMobile?: boolean;
        baseWidth?: number;
        edgeFade?: boolean;
      },
    );
    mount(): void;
    destroy(): void;
  }
}
