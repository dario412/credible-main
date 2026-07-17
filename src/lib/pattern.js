const GREEN = { r: 52, g: 91, b: 71 };
const GROUP_SIZE = 6;
const BASE_WIDTH = 1.75;
const INFLUENCE_RADIUS = 200;
const MOBILE_MAX_WIDTH = 768;

const KINK_PROFILES = [
  { enter: 0.37, midTop: 0.49, midBottom: 0.62, exit: 0.74 },
  { enter: 0.04, midTop: 0.16, midBottom: 0.29, exit: 0.41 },
  { enter: 0.52, midTop: 0.64, midBottom: 0.76, exit: 0.87 },
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isMobileViewport() {
  return window.matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`).matches;
}

function fadeAlpha(x, width) {
  return smoothstep(0, width, x);
}

function pointInfluence(px, py, mouseX, mouseY, radius) {
  const dist = Math.hypot(px - mouseX, py - mouseY);
  return smoothstep(radius, radius * 0.15, dist);
}

function buildLines(width, spacing) {
  const count = Math.ceil(width / spacing) + 1;
  const lines = [];

  for (let i = 0; i < count; i += 1) {
    const x = i * spacing;
    const posInGroup = i % GROUP_SIZE;
    const groupIndex = Math.floor(i / GROUP_SIZE);

    if (posInGroup === 3 || posInGroup === 4) {
      lines.push({
        x,
        type: "kink",
        profile: KINK_PROFILES[groupIndex % KINK_PROFILES.length],
        seed: i,
      });
    } else {
      lines.push({ x, type: "straight", seed: i });
    }
  }

  return lines;
}

function drawStraightLine(
  ctx,
  x,
  height,
  alpha,
  width,
  mouseX,
  mouseY,
  interactive,
  time,
  seed,
  color,
) {
  const steps = Math.ceil(height / 10);

  ctx.beginPath();
  for (let s = 0; s <= steps; s += 1) {
    const y = (s / steps) * height;
    let px = x;

    if (interactive) {
      const inf = pointInfluence(x, y, mouseX, mouseY, INFLUENCE_RADIUS);
      const ripple =
        Math.sin(time * 2.8 - y * 0.018 + seed * 0.3) * inf * 3.5;
      px += (mouseX - x) * inf * 0.22 + ripple;
    }

    if (s === 0) ctx.moveTo(px, y);
    else ctx.lineTo(px, y);
  }

  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * fadeAlpha(x, width)})`;
  ctx.stroke();
}

function drawKinkedLine(
  ctx,
  x,
  height,
  spacing,
  profile,
  alpha,
  width,
  mouseX,
  mouseY,
  interactive,
  time,
  seed,
  color,
) {
  const y1 = height * profile.enter;
  const y2 = height * profile.midTop;
  const y3 = height * profile.midBottom;
  const y4 = height * profile.exit;

  const points = [
    [x, 0],
    [x, y1],
    [x + spacing, y2],
    [x + spacing, y3],
    [x, y4],
    [x, height],
  ];

  ctx.beginPath();
  points.forEach(([px, py], index) => {
    let drawX = px;

    if (interactive) {
      const inf = pointInfluence(px, py, mouseX, mouseY, INFLUENCE_RADIUS);
      const ripple =
        Math.sin(time * 2.8 - py * 0.018 + seed * 0.3) * inf * 3;
      drawX += (mouseX - px) * inf * 0.18 + ripple;
    }

    if (index === 0) ctx.moveTo(drawX, py);
    else ctx.lineTo(drawX, py);
  });

  ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * fadeAlpha(x, width)})`;
  ctx.stroke();
}

export class PatternCanvas {
  constructor(canvas, container, options = {}) {
    this.canvas = canvas;
    this.container = container;
    this.color = options.color || GREEN;
    this.ctx = canvas.getContext("2d");
    this.lines = [];
    this.spacing = 14;
    this.width = 0;
    this.height = 0;
    this.mouse = { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false };
    this.reduced = prefersReducedMotion();
    this.isMobile = isMobileViewport();
    this.start = performance.now();
    this.raf = 0;

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onResize = this.onResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  mount() {
    const page = this.container.closest(".page") || document;
    page.addEventListener("pointermove", this.onPointerMove);
    page.addEventListener("pointerleave", this.onPointerLeave);
    window.addEventListener("resize", this.onResize);
    window
      .matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
      .addEventListener("change", this.onResize);
    this.onResize();
    this.raf = requestAnimationFrame(this.animate);
  }

  destroy() {
    const page = this.container.closest(".page") || document;
    page.removeEventListener("pointermove", this.onPointerMove);
    page.removeEventListener("pointerleave", this.onPointerLeave);
    window.removeEventListener("resize", this.onResize);
    window
      .matchMedia(`(max-width: ${MOBILE_MAX_WIDTH}px)`)
      .removeEventListener("change", this.onResize);
    cancelAnimationFrame(this.raf);
  }

  onPointerMove(event) {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
    this.mouse.active = true;
  }

  onPointerLeave() {
    this.mouse.active = false;
  }

  onResize() {
    this.isMobile = isMobileViewport();

    if (this.isMobile) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    const rect = this.container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.width = rect.width;
    this.height = rect.height;
    this.spacing = clamp(this.width / 38, 13, 18);
    this.canvas.width = Math.floor(rect.width * dpr);
    this.canvas.height = Math.floor(rect.height * dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.lines = buildLines(rect.width, this.spacing);
  }

  animate(now) {
    if (this.isMobile) {
      this.raf = requestAnimationFrame(this.animate);
      return;
    }

    const elapsed = (now - this.start) / 1000;
    const smooth = this.reduced ? 1 : 0.07;
    this.mouse.sx = lerp(this.mouse.sx, this.mouse.x, smooth);
    this.mouse.sy = lerp(this.mouse.sy, this.mouse.y, smooth);

    const fieldRect = this.container.getBoundingClientRect();
    const localMouseX = this.mouse.sx - fieldRect.left;
    const localMouseY = this.mouse.sy - fieldRect.top;
    const interactive = this.mouse.active && !this.reduced;

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    for (const line of this.lines) {
      const lineInfluence = interactive
        ? pointInfluence(
            line.x,
            localMouseY,
            localMouseX,
            localMouseY,
            INFLUENCE_RADIUS * 1.1,
          )
        : 0;

      const alpha = 0.82 + lineInfluence * 0.18;
      this.ctx.lineWidth = BASE_WIDTH + lineInfluence * 1.4;

      if (line.type === "kink") {
        drawKinkedLine(
          this.ctx,
          line.x,
          this.height,
          this.spacing,
          line.profile,
          alpha,
          this.width,
          localMouseX,
          localMouseY,
          interactive,
          elapsed,
          line.seed,
          this.color,
        );
      } else {
        drawStraightLine(
          this.ctx,
          line.x,
          this.height,
          alpha,
          this.width,
          localMouseX,
          localMouseY,
          interactive,
          elapsed,
          line.seed,
          this.color,
        );
      }
    }

    if (interactive) {
      const glow = this.ctx.createRadialGradient(
        localMouseX,
        localMouseY,
        0,
        localMouseX,
        localMouseY,
        INFLUENCE_RADIUS,
      );
      const { r, g, b } = this.color;
      glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.1)`);
      glow.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.04)`);
      glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
      this.ctx.fillStyle = glow;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    this.raf = requestAnimationFrame(this.animate);
  }
}
