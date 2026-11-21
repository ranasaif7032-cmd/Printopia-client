import { useState, useEffect } from 'react'
import { api } from '@/config/api'
import { useCart } from '@/context/Cart'
import { Button, Col, InputNumber, Row, Spin, Typography, Space } from 'antd'
import {
  ShoppingCartOutlined,
  ArrowLeftOutlined,
  PictureOutlined,
  PlayCircleFilled,
} from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/format'

const { Title, Paragraph } = Typography

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedMediaId, setSelectedMediaId] = useState('img1')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.get(`/products/${id}`)
        setProduct(data)
        const img1 = data?.imageURL || data?.images?.[0]
        const img2 = data?.imageURL2 || data?.images?.[1]
        const vid = data?.videoURL

        if (img1) setSelectedMediaId('img1')
        else if (img2) setSelectedMediaId('img2')
        else if (vid) setSelectedMediaId('video')
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) return <main className="container py-5 text-center"><Spin size="large" /></main>
  if (!product) return <main className="container py-5 text-center"><Paragraph>Product not found.</Paragraph></main>

  const image1 = product.imageURL || product.images?.[0] || null
  const image2 = product.imageURL2 || (product.images?.[1] && product.images[1] !== image1 ? product.images[1] : null)
  const videoUrl = product.videoURL || null

  const mediaList = []
  if (image1) mediaList.push({ id: 'img1', type: 'image', url: image1, label: 'Image 1' })
  if (image2) mediaList.push({ id: 'img2', type: 'image', url: image2, label: 'Image 2' })
  if (videoUrl) mediaList.push({ id: 'video', type: 'video', url: videoUrl, label: 'Video' })

  const activeItem = mediaList.find(m => m.id === selectedMediaId) || mediaList[0]

  return (
    <main className="container py-5">
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="mb-4"
        style={{ color: '#0866F5', fontWeight: 600, paddingLeft: 0 }}
      >
        Back to Products
      </Button>
      <Row gutter={[40, 40]}>
        <Col xs={24} md={12}>
          {/* Quick switcher buttons if multiple media exist */}
          {mediaList.length > 1 && (
            <div style={{ marginBottom: 12 }}>
              <Space size={8} wrap>
                {mediaList.map((item) => (
                  <Button
                    key={item.id}
                    type={activeItem?.id === item.id ? 'primary' : 'default'}
                    icon={item.type === 'video' ? <PlayCircleFilled /> : <PictureOutlined />}
                    onClick={() => setSelectedMediaId(item.id)}
                    size="middle"
                    style={{
                      borderRadius: 8,
                      fontWeight: 600,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Space>
            </div>
          )}

          {/* Main Media Preview */}
          {activeItem?.type === 'video' ? (
            <div
              style={{
                width: '100%',
                aspectRatio: '16/9',
                maxHeight: 460,
                background: '#000000',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <video
                key={activeItem.url}
                src={activeItem.url}
                controls
                autoPlay
                playsInline
                preload="metadata"
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: 460,
                  objectFit: 'contain',
                  outline: 'none',
                }}
              />
            </div>
          ) : activeItem?.type === 'image' ? (
            <div
              style={{
                width: '100%',
                aspectRatio: '4/3',
                maxHeight: 460,
                background: 'var(--bg-secondary)',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={activeItem.url}
                alt={`${product.name} - ${activeItem.label}`}
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: 460,
                  objectFit: 'contain',
                  display: 'block',
                }}
                onError={(e) => {
                  e.target.src = 'https://placehold.co/600x450?text=No+Image'
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                aspectRatio: '4/3',
                maxHeight: 460,
                background: 'var(--bg-secondary)',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="https://placehold.co/600x450?text=No+Media"
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              />
            </div>
          )}

          {/* Clickable Thumbnails Gallery */}
          {mediaList.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginTop: 16,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {mediaList.map((item) => {
                const isSelected = activeItem?.id === item.id
                const isVideo = item.type === 'video'

                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedMediaId(item.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedMediaId(item.id)
                      }
                    }}
                    style={{
                      position: 'relative',
                      width: 80,
                      height: 80,
                      borderRadius: 10,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: isSelected ? '2.5px solid #0866F5' : '1.5px solid var(--border-color)',
                      boxShadow: isSelected ? '0 0 0 3px rgba(8, 102, 245, 0.28)' : 'none',
                      background: '#000',
                      transition: 'all 0.2s ease',
                      transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                      flexShrink: 0,
                    }}
                    title={isVideo ? 'Click to play video with controls' : `Click to view ${item.label}`}
                  >
                    {isVideo ? (
                      <>
                        <video
                          src={item.url}
                          preload="metadata"
                          muted
                          playsInline
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                            pointerEvents: 'none',
                          }}
                        />
                        {/* Play Button Overlay on Video Thumbnail */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: isSelected ? 'rgba(8, 102, 245, 0.35)' : 'rgba(0, 0, 0, 0.45)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            transition: 'background 0.2s ease',
                          }}
                        >
                          <PlayCircleFilled style={{ fontSize: 26, color: '#FFFFFF', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                          <span style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 700, letterSpacing: '0.02em', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                            PLAY
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={item.url}
                          alt={item.label}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                          onError={(e) => {
                            e.target.src = 'https://placehold.co/80x80?text=Image'
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 2,
                            right: 4,
                            background: 'rgba(0,0,0,0.65)',
                            color: '#fff',
                            fontSize: 9,
                            fontWeight: 700,
                            padding: '1px 4px',
                            borderRadius: 4,
                          }}
                        >
                          {item.id === 'img1' ? 'IMG 1' : 'IMG 2'}
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Col>
        <Col xs={24} md={12}>
          <Title level={2}>{product.name}</Title>
          {product.category && (
            <Paragraph style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
              Category: <span style={{ color: '#0866F5' }}>{product.category}{product.subcategory ? ` • ${product.subcategory}` : ''}</span>
            </Paragraph>
          )}
          <Title level={3} style={{ color: '#0866F5', fontWeight: 800 }}>
            Rs {formatCurrency(product.price)} / {product.unit || 'pcs'}
          </Title>
          <Paragraph style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
            {product.description || 'No description available for this item.'}
          </Paragraph>
          {product.stock !== undefined && (
            <Paragraph>
              {product.stock > 0
                ? <span style={{ color: '#22C55E', fontWeight: 700 }}>In Stock ({product.stock} available)</span>
                : <span style={{ color: '#EF4444', fontWeight: 700 }}>Out of Stock</span>}
            </Paragraph>
          )}
          <div className="quantity-control mb-4">
            <span style={{ fontWeight: 600 }}>Quantity:</span>
            <InputNumber
              min={0.1}
              step={product.unit === 'KG' ? 0.1 : 1}
              max={product.stock || 99}
              value={quantity}
              onChange={setQuantity}
              size="large"
            />
          </div>
          <div className="d-flex align-items-center gap-3">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={() => { addToCart(product, quantity); window.toastify('Added to cart!', 'success') }}
              disabled={product.stock === 0}
              style={{
                background: '#0866F5',
                borderColor: '#0866F5',
                height: 46,
                padding: '0 28px',
                fontWeight: 700,
                borderRadius: 8,
              }}
            >
              Add to Cart
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/shop')}
              style={{
                height: 46,
                fontWeight: 600,
                borderRadius: 8,
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
              }}
            >
              Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>
    </main>
  )
}

export default ProductDetails
