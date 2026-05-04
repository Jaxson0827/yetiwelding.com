'use client';

const palette = [
  '#7c2d2d',
  '#8B5A2B',
  '#4f6b3a',
  '#3a5e6b',
  '#5b3a6b',
  '#6b3a4b',
  '#3a4b6b',
  '#6b603a',
];

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export default function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const bg = palette[hash(name) % palette.length];
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full text-white"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.45,
        fontWeight: 600,
      }}
    >
      {initial}
    </span>
  );
}
