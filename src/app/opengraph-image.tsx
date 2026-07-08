import { ImageResponse } from 'next/og';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Karthik S — Software Developer';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background:
            'linear-gradient(135deg, #0f172a 0%, #172554 55%, #2e1065 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '96px',
              height: '96px',
              borderRadius: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '56px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #2563eb, #9333ea)',
            }}
          >
            K
          </div>
          <div style={{ fontSize: '36px', color: '#cbd5e1' }}>karthiks360.com</div>
        </div>
        <div style={{ fontSize: '84px', fontWeight: 700, lineHeight: 1.05 }}>
          Karthik S
        </div>
        <div
          style={{
            fontSize: '52px',
            fontWeight: 600,
            marginTop: '12px',
            background: 'linear-gradient(90deg, #60a5fa, #c084fc)',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          Software Developer
        </div>
        <div
          style={{
            fontSize: '32px',
            color: '#94a3b8',
            marginTop: '28px',
            maxWidth: '900px',
          }}
        >
          Backend · REST APIs · AWS Cloud · DevOps Automation
        </div>
      </div>
    ),
    { ...size },
  );
}
