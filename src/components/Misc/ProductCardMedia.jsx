import { useState } from 'react'
import { PlayCircleFilled, PictureOutlined, VideoCameraOutlined } from '@ant-design/icons'

const ProductCardMedia = ({ product }) => {
  const image1 = product?.imageURL || product?.images?.[0] || null
  const image2 = product?.imageURL2 || (product?.images?.[1] && product.images[1] !== image1 ? product.images[1] : null)
  const videoUrl = product?.videoURL || null

  const mediaList = []
  if (image1) mediaList.push({ id: 'img1', type: 'image', url: image1, label: 'Photo 1' })
  if (image2) mediaList.push({ id: 'img2', type: 'image', url: image2, label: 'Photo 2' })
  if (videoUrl) mediaList.push({ id: 'video', type: 'video', url: videoUrl, label: 'Video' })

  const [activeMediaId, setActiveMediaId] = useState(mediaList[0]?.id || 'none')

  const activeMedia = mediaList.find(m => m.id === activeMediaId) || mediaList[0] || null
  const isOutOfStock = product?.stock !== undefined && product.stock <= 0

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '4/3',
        background: '#050505',
        overflow: 'hidden',
      }}
    >
      {/* Media Switcher Badge if multiple media exist */}
      {mediaList.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 10,
            display: 'flex',
            gap: 4,
            background: 'rgba(0, 0, 0, 0.72)',
            backdropFilter: 'blur(8px)',
            padding: '3px 6px',
            borderRadius: 20,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {mediaList.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setActiveMediaId(m.id)
              }}
              style={{
                border: 'none',
                background: activeMedia?.id === m.id ? '#0866F5' : 'transparent',
                color: '#FFFFFF',
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 14,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.2s ease',
              }}
            >
              {m.type === 'video' ? (
                <VideoCameraOutlined style={{ fontSize: 11 }} />
              ) : (
                <PictureOutlined style={{ fontSize: 11 }} />
              )}
              {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Media Content */}
      {activeMedia?.type === 'video' ? (
        <div
          style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}
          onClick={(e) => e.stopPropagation()}
        >
          <video
            src={activeMedia.url}
            controls
            playsInline
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              background: '#000',
              outline: 'none',
            }}
          />
        </div>
      ) : activeMedia?.type === 'image' ? (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <img
            alt={product?.name || 'Product'}
            src={activeMedia.url}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => {
              e.target.src = 'https://placehold.co/400x300?text=No+Image'
            }}
          />
          {/* Quick Play Trigger Overlay if Video is available and in image mode */}
          {videoUrl && (
            <div
              onClick={(e) => {
                e.stopPropagation()
                setActiveMediaId('video')
              }}
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                background: 'rgba(8, 102, 245, 0.92)',
                color: '#FFFFFF',
                borderRadius: 20,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
                transition: 'transform 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
            >
              <PlayCircleFilled style={{ fontSize: 13 }} /> Play Video
            </div>
          )}
        </div>
      ) : (
        /* Fallback No Media */
        <img
          alt={product?.name || 'Product'}
          src="https://placehold.co/400x300?text=No+Media"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 15,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              border: '2px solid #FFFFFF',
              padding: '6px 16px',
              borderRadius: 6,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Out of Stock
          </span>
        </div>
      )}
    </div>
  )
}

export default ProductCardMedia

