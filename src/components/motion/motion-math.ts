// Small number helpers used by the pointer and scroll effects.

// Moves `current` a fraction of the way toward `target`. Called every frame, this gives smooth trailing motion.
export function ease(current: number, target: number, fraction: number): number {
  return current + (target - current) * fraction;
}

export function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

// 1 when the two points touch, fading to 0 once they are `radius` pixels apart.
// Squared so the effect stays gentle until the pointer is really close.
export function closeness(
  from: { x: number; y: number },
  x: number,
  y: number,
  radius: number,
): number {
  const linear = Math.max(0, 1 - Math.hypot(from.x - x, from.y - y) / radius);
  return linear * linear;
}
