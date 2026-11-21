import { useState, useEffect } from 'react'
import { api } from '@/config/api'
import { Card, Col, Input, Row, Select, Spin, Typography } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { formatCurrency } from '@/utils/format'
import { matchesCategoryFilter } from '@/utils/categoryHelper'
import ProductCardMedia from '@/components/Misc/ProductCardMedia'

const { Title, Paragraph } = Typography
const { Meta } = Card
const { Search } = Input

const Shop = () => {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const navigate = useNavigate()

  const categoryFilter = searchParams.get('category')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.get('/products')
        setProducts(data)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    let result = [...products]

    if (categoryFilter) {
      result = result.filter(p => matchesCategoryFilter(p, categoryFilter))
    }

    if (searchTerm) {
      result = result.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price)
    else result.sort((a, b) => {
      const pa = a.position || 0
      const pb = b.position || 0
      if (pa !== pb) return pa - pb
      const da = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const db2 = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return db2 - da
    })

    setFiltered(result)
  }, [products, categoryFilter, searchTerm, sortBy])

  return (
    <main className="container py-5">
      <Title level={2} className="mb-4">
        {categoryFilter ? (
          <span>Category: <span style={{ color: '#0866F5' }}>{categoryFilter}</span></span>
        ) : (
          <span>Explore All <span style={{ color: '#0866F5' }}>Products</span></span>
        )}
      </Title>

      <Row gutter={[16, 16]} className="mb-4">
        <Col xs={24} sm={12} md={8}>
          <Search
            placeholder="Search products..."
            onChange={e => setSearchTerm(e.target.value)}
            allowClear
            size="large"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Select
            size="large"
            value={sortBy}
            onChange={setSortBy}
            style={{ width: '100%' }}
            options={[
              { value: 'newest', label: 'Sort: Newest' },
              { value: 'price-asc', label: 'Price: Low to High' },
              { value: 'price-desc', label: 'Price: High to Low' },
            ]}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5"><Spin size="large" /></div>
      ) : filtered.length === 0 ? (
        <Paragraph className="text-center" style={{ color: 'var(--text-secondary)' }}>No products found.</Paragraph>
      ) : (
        <Row gutter={[20, 20]}>
          {filtered.map(product => (
            <Col xs={24} sm={12} md={6} key={product._id}>
              <div
                className="product-card"
                onClick={() => { if (product.stock > 0) navigate(`/shop/${product._id}`) }}
              >
                <Card
                  hoverable
                  cover={<ProductCardMedia product={product} />}
                >
                  <Meta
                    title={product.name}
                    description={
                      <>
                        <div style={{ fontWeight: 700, color: '#0866F5', fontSize: '1.05rem' }}>
                          Rs {formatCurrency(product.price)} / {product.unit || 'pcs'}
                        </div>
                        {product.category && (
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                            {product.category}{product.subcategory ? ` • ${product.subcategory}` : ''}
                          </div>
                        )}
                      </>
                    }
                  />
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </main>
  )
}

export default Shop
