'use client';

interface Props {
  value: number; // 0-5, can be fractional
  size?: number;
  className?: string;
}

export default function StarRating({ value, size = 16, className = '' }: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value} out of 5`}>
      {stars.map((s) => {
        const filled = value >= s;
        const half = !filled && value >= s - 0.5;
        return (
          <span key={s} className="relative inline-block" style={{ width: size, height: size }}>
            <svg
              width={size}
              height={size}
              viewBox="0 0 20 20"
              className="absolute inset-0 text-white/15"
              fill="currentColor"
            >
              <path d="M10 1.5l2.7 5.5 6 .9-4.4 4.3 1 6-5.4-2.8L4.5 18.2l1-6L1.1 7.9l6-.9z" />
            </svg>
            <svg
              width={size}
              height={size}
              viewBox="0 0 20 20"
              className="absolute inset-0 text-accent-gold"
              style={{
                clipPath: filled
                  ? 'inset(0 0 0 0)'
                  : half
                  ? 'inset(0 50% 0 0)'
                  : 'inset(0 100% 0 0)',
              }}
              fill="currentColor"
            >
              <path d="M10 1.5l2.7 5.5 6 .9-4.4 4.3 1 6-5.4-2.8L4.5 18.2l1-6L1.1 7.9l6-.9z" />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
