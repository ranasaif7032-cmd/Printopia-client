import { useCart } from '@/context/Cart'
import { Button, Col, InputNumber, Row, Typography, Divider, Empty } from 'antd'
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/format'

const { Title, Text } = Typography

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart()
  const navigate = useNavigate()

  if (cart.length === 0) {
    return (
      <main className="empty-cart">
        <Empty
          image={<ShoppingOutlined style={{ fontSize: 80, color: '#0866F5' }} />}
          description={<Title level={4}>Your cart is empty</Title>}
        >
          <Button
            type="primary"
            size="large"
            onClick={() => navigate('/shop')}
            style={{
              background: '#0866F5',
              borderColor: '#0866F5',
              borderRadius: 8,
              fontWeight: 600,
            }}
          >
            Start Shopping
          </Button>
        </Empty>
      </main>
    )
  }

  return (
    <main className="container py-5">
      <Title level={2} className="mb-4">
        Shopping <span style={{ color: '#0866F5' }}>Cart</span> ({cartCount} {cartCount === 1 ? 'item' : 'items'})
      </Title>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          {cart.map(item => (
            <div
              key={item._id}
              className="mb-3 p-3 border rounded-3"
              style={{
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <Row gutter={[16, 16]} align="middle">
                <Col xs={6} sm={4}>
                  <img
                    className="cart-item-img"
                    src={item.imageURL || item.images?.[0] || 'https://placehold.co/80x80?text=No+Img'}
                    alt={item.name}
                  />
                </Col>
                <Col xs={10} sm={10}>
                  <Text strong style={{ fontSize: '1rem', color: 'var(--text-heading)' }}>{item.name}</Text>
                  <div style={{ color: '#0866F5', fontWeight: 700, marginTop: 2 }}>
                    Rs {formatCurrency(item.price)} / {item.unit || 'pcs'}
                  </div>
                </Col>
                <Col xs={4} sm={5}>
                  <InputNumber
                    min={0.1}
                    step={item.unit === 'KG' ? 0.1 : 1}
                    max={item.stock || 99}
                    value={item.quantity}
                    onChange={v => updateQuantity(item._id, v)}
                  />
                </Col>
                <Col xs={4} sm={3} className="text-end">
                  <Text strong style={{ color: 'var(--text-heading)' }}>
                    Rs {formatCurrency(item.price * item.quantity)}
                  </Text>
                </Col>
                <Col xs={2} sm={2} className="text-end">
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => removeFromCart(item._id)}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </Col>
        <Col xs={24} lg={8}>
          <div
            className="p-4 border rounded-3"
            style={{
              position: 'sticky',
              top: 24,
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <Title level={4}>Order Summary</Title>
            <Divider style={{ borderColor: 'var(--border-divider)' }} />
            <Row justify="space-between" className="mb-2">
              <Text style={{ color: 'var(--text-secondary)' }}>Subtotal ({cartCount} items)</Text>
              <Text strong style={{ color: 'var(--text-heading)' }}>Rs {formatCurrency(cartTotal)}</Text>
            </Row>
            <Row justify="space-between" className="mb-3">
              <Text style={{ color: 'var(--text-secondary)' }}>Shipping</Text>
              <Text strong style={{ color: '#22C55E' }}>Free Delivery</Text>
            </Row>
            <Divider style={{ borderColor: 'var(--border-divider)' }} />
            <Row justify="space-between" className="mb-4">
              <Text strong style={{ fontSize: '1.15rem' }}>Total</Text>
              <Text strong style={{ fontSize: '1.25rem', color: '#0866F5' }}>Rs {formatCurrency(cartTotal)}</Text>
            </Row>
            <Button
              type="primary"
              size="large"
              block
              onClick={() => navigate('/checkout')}
              style={{
                background: '#0866F5',
                borderColor: '#0866F5',
                height: 46,
                fontWeight: 700,
                borderRadius: 8,
              }}
            >
              Proceed to Checkout
            </Button>
            <Button
              size="large"
              block
              className="mt-2"
              onClick={() => navigate('/shop')}
              style={{
                height: 46,
                fontWeight: 600,
                borderRadius: 8,
                background: 'var(--bg-secondary)',
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

export default Cart
