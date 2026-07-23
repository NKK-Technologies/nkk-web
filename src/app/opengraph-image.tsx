import { ImageResponse } from 'next/og'

export const alt = 'NKK Tech — Software, Security Systems & Hardware Supply'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A192F',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 68, fontWeight: 800, color: '#ffffff' }}>NKK Tech</div>
          <div style={{ fontSize: 42, color: '#7CC1E8', marginTop: 28, maxWidth: 950, lineHeight: 1.2 }}>
            The Missing Piece in Your Digital Transformation
          </div>
          <div style={{ fontSize: 28, color: '#B8C7DA', marginTop: 28 }}>
            Software · Access control · CCTV · Hardware supply
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 26, color: '#ffffff' }}>nkktech.co.tz</div>
          <div style={{ width: 220, height: 12, backgroundColor: '#0088CC', borderRadius: 6 }} />
        </div>
      </div>
    ),
    size,
  )
}
