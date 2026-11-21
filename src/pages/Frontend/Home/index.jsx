import { useState, useEffect } from 'react'
import { api } from '@/config/api'
import { Card, Col, Row, Spin, Typography, Button, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/format'
import { ShoppingOutlined } from '@ant-design/icons'
import HomeSidebar from './HomeSidebar'
import { matchesCategoryFilter } from '@/utils/categoryHelper'
import ProductCardMedia from '@/components/Misc/ProductCardMedia'

const { Title, Paragraph } = Typography
const { Meta } = Card

const Home = () => {
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, catData] = await Promise.all([
          api.get('/products?featured=true'),
          api.get('/categories'),
        ])
        setAllProducts(
          (Array.isArray(prodData) ? prodData : []).sort(
            (a, b) => (a.featuredOrder || 0) - (b.featuredOrder || 0)
          )
        )
        setCategories(
          (Array.isArray(catData) ? catData : [])
            .filter((c) => !c.isDeleted)
            .sort((a, b) => a.name.localeCompare(b.name))
        )
      } catch {
        setAllProducts([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    const handleCategoryFilterEvent = (e) => {
      if (e.detail) {
        setSelectedCategory(e.detail)
      }
    }
    window.addEventListener('printopia_filter_category', handleCategoryFilterEvent)
    return () => window.removeEventListener('printopia_filter_category', handleCategoryFilterEvent)
  }, [])

  const filteredProducts = selectedCategory
    ? allProducts.filter((p) => matchesCategoryFilter(p, selectedCategory))
    : allProducts

  const displayProducts = filteredProducts.slice(0, 8)

  return (
    <>
      {/* Printopia Top Category Bar & Mega Menu Navigation */}
      <HomeSidebar
        onCategorySelect={(cat) => setSelectedCategory(cat)}
      />

      {/* Hero Section */}
      <section className="home-hero-grid-section">
        <div className="home-hero-container">
          {/* Hero Banner Card */}
          <div className="home-hero-banner-card">
            <div className="hero-banner-content">
              <div className="hero-banner-tag">
                <span>✦</span> Premium Custom Printing & Packaging
              </div>
              <h1 className="hero-banner-heading">
                Personalized <span className="text-electric-blue">Packaging</span>, Favors & Event <span className="text-electric-blue">Essentials</span>
              </h1>
              <p className="hero-banner-subtext">
                Explore our signature Hajj & Umrah tabarruk sets, luxury wedding bid
                boxes, die-cut logo stickers, and bespoke corporate branding.
              </p>
              <div className="hero-banner-actions">
                <button
                  type="button"
                  className="hero-btn-primary"
                  onClick={() => navigate('/shop')}
                >
                  <ShoppingOutlined /> Start Shopping
                </button>
                <button
                  type="button"
                  className="hero-btn-secondary"
                  onClick={() =>
                    navigate(
                      `/shop?category=${encodeURIComponent('HAJJ & UMRAH COLLECTION')}`
                    )
                  }
                >
                  Explore Hajj & Umrah Collection →
                </button>
              </div>
            </div>
            <div className="hero-banner-decorative-circle" />
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      {categories.length > 0 && (
        <section className="container py-5">
          <Title level={2} className="text-center mb-4">
            Shop by <span style={{ color: '#0866F5' }}>Category</span>
          </Title>
          <Row gutter={[20, 20]} justify="center">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name
              return (
                <Col xs={12} sm={8} md={6} lg={4} key={cat._id}>
                  <div
                    className="category-card"
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.name ? null : cat.name
                      )
                    }
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #0866F5' : '1px solid var(--border-color)',
                      boxShadow: isSelected ? '0 4px 16px rgba(8, 102, 245, 0.4)' : 'none',
                    }}
                  >
                    <Card
                      hoverable
                      style={{
                        textAlign: 'center',
                        background: 'transparent',
                        border: 'none',
                      }}
                    >
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={cat.name}
                          style={{
                            width: 64,
                            height: 64,
                            objectFit: 'contain',
                            margin: '0 auto 8px',
                          }}
                        />
                      ) : (
                        <div className="category-icon">{cat.icon || '📦'}</div>
                      )}
                      <Meta title={cat.name} />
                    </Card>
                  </div>
                </Col>
              )
            })}
          </Row>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="container py-5">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 28,
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            {selectedCategory ? (
              <span>Category: <span style={{ color: '#0866F5' }}>{selectedCategory}</span></span>
            ) : (
              <span>Featured <span style={{ color: '#0866F5' }}>Products</span></span>
            )}
          </Title>
          {selectedCategory && (
            <Tag
              closable
              onClose={(e) => {
                e.preventDefault()
                setSelectedCategory(null)
              }}
              style={{
                fontSize: 14,
                padding: '4px 12px',
                background: 'rgba(8, 102, 245, 0.15)',
                color: '#0866F5',
                borderColor: '#0866F5',
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              Clear Filter
            </Tag>
          )}
        </div>
        {loading ? (
          <div className="text-center py-5">
            <Spin size="large" />
          </div>
        ) : displayProducts.length === 0 ? (
          <Paragraph className="text-center" style={{ color: 'var(--text-secondary)' }}>
            {selectedCategory
              ? `No featured products in "${selectedCategory}" category.`
              : 'No products yet. Check back soon!'}
          </Paragraph>
        ) : (
          <Row gutter={[20, 20]}>
            {displayProducts.map((product) => (
              <Col xs={24} sm={12} md={6} key={product._id}>
                <div
                  className="product-card"
                  onClick={() => navigate(`/shop/${product._id}`)}
                >
                  <Card
                    hoverable
                    cover={<ProductCardMedia product={product} />}
                  >
                    <Meta
                      title={product.name}
                      description={`Rs ${formatCurrency(product.price)} / ${product.unit || 'pcs'}`}
                    />
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        )}
        {selectedCategory && displayProducts.length > 0 && (
          <div className="text-center mt-4">
            <Button
              type="link"
              style={{ color: '#0866F5', fontWeight: 700, fontSize: '0.95rem' }}
              onClick={() =>
                navigate(
                  `/shop?category=${encodeURIComponent(selectedCategory)}`
                )
              }
            >
              View all ${selectedCategory} products →
            </Button>
          </div>
        )}
      </section>
    </>
  )
}

export default Home
