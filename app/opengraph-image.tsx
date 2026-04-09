import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#FDFAF5',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          fontFamily: 'Georgia, serif',
          position: 'relative',
        }}
      >
        {/* Top accent line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <div style={{ width: 40, height: 2, background: '#B45309' }} />
          <span style={{ color: '#B45309', fontSize: 15, letterSpacing: 6, textTransform: 'uppercase', fontFamily: 'Georgia, serif' }}>
            Personal Travel Journal
          </span>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 40 }}>
          <span style={{ fontSize: 100, fontWeight: 700, color: '#1C1410', lineHeight: 1, fontFamily: 'Georgia, serif' }}>
            The Atlas
          </span>
          <span style={{ fontSize: 100, fontWeight: 400, color: '#B45309', fontStyle: 'italic', lineHeight: 1, fontFamily: 'Georgia, serif' }}>
            of VB
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 64, height: 2, background: '#DDD4C0', marginBottom: 36 }} />

        {/* Tagline */}
        <span style={{ fontSize: 26, color: '#7C6D5A', fontFamily: 'Georgia, serif', maxWidth: 560, lineHeight: 1.5 }}>
          A living record of adventures, one destination at a time.
        </span>

        {/* Compass rose — bottom right */}
        <svg
          width="180"
          height="180"
          viewBox="0 0 32 32"
          style={{ position: 'absolute', bottom: 60, right: 80, opacity: 0.18 }}
        >
          <circle cx="16" cy="16" r="12.5" fill="none" stroke="#B45309" strokeWidth="0.6" />
          <path d="M16 3.5 L19 13.5 L16 12 L13 13.5 Z" fill="#92400E" />
          <path d="M16 28.5 L13 18.5 L16 20 L19 18.5 Z" fill="#92400E" />
          <path d="M28.5 16 L18.5 13 L20 16 L18.5 19 Z" fill="#92400E" />
          <path d="M3.5 16 L13.5 19 L12 16 L13.5 13 Z" fill="#92400E" />
          <circle cx="16" cy="16" r="2.8" fill="#B45309" />
          <circle cx="16" cy="16" r="1.4" fill="#FDFAF5" />
        </svg>

        {/* Bottom border accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #B45309, #D97706)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
