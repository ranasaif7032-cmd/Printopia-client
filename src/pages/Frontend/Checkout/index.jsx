import { useState, useEffect } from 'react'
import { useAuth } from '@/context/Auth'
import { useCart } from '@/context/Cart'
import { api } from '@/config/api'
import { Button, Col, Form, Input, Row, Typography, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/format'

const { Title, Text } = Typography
const { Item } = Form

const Checkout = () => {
  const { user } = useAuth()
  const { cart, cartTotal, clearCart } = useCart()
  const [state, setState] = useState({ fullName: '', phone: '', address: '', city: '', zip: '' })
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setState(prev => ({ ...prev, fullName: prev.fullName || user.fullName || '' }))
    }
  }, [user])

  useEffect(() => {
    if (!user) { navigate('/auth/login'); return }
    if (cart.length === 0) { navigate('/cart'); return }
  }, [user, cart, navigate])

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handlePlaceOrder = async () => {
    const { fullName, phone, address, city, zip } = state
    if (!fullName || !phone || !address || !city) {
      window.toastify('Please fill in all required fields', 'error')
      return
    }

    setIsProcessing(true)
    try {
      await api.post('/orders', {
        items: cart.map(item => ({
          id: item._id || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit || 'pcs',
          category: item.category || '',
          images: item.images || [item.imageURL, item.imageURL2].filter(Boolean),
          imageURL: item.imageURL || item.images?.[0] || '',
          imageURL2: item.imageURL2 || item.images?.[1] || '',
          videoURL: item.videoURL || '',
        })),
        total: cartTotal,
        shipping: { fullName, phone, address, city, zip },
      })
      clearCart()
      window.toastify('Order placed successfully!', 'success')
      navigate('/orders')
    } catch {
      window.toastify('Failed to place order. Please try again.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="container py-5">
      <Row justify="space-between" align="middle" className="mb-4">
        <Col><Title level={2}>Order <span style={{ color: '#0866F5' }}>Checkout</span></Title></Col>
      </Row>
      <Row gutter={[32, 32]}>
        <Col xs={24} lg={14}>
          <div
            className="p-4 border rounded-3"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <Title level={4} style={{ marginBottom: 20 }}>Shipping Information</Title>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Item label="Full Name" required>
                    <Input name="fullName" size="large" placeholder="John Doe" defaultValue={user?.fullName || ''} onChange={handleChange} />
                  </Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Item label="Phone" required>
                    <Input name="phone" size="large" placeholder="+92 300 1234567" onChange={handleChange} />
                  </Item>
                </Col>
              </Row>
              <Item label="Address" required>
                <Input name="address" size="large" placeholder="Street Address / House No" onChange={handleChange} />
              </Item>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Item label="City" required>
                    <Input name="city" size="large" placeholder="Faisalabad / Lahore / Karachi" onChange={handleChange} />
                  </Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Item label="Postal / ZIP Code">
                    <Input name="zip" size="large" placeholder="38000" onChange={handleChange} />
                  </Item>
                </Col>
              </Row>
            </Form>
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <div
            className="p-4 border rounded-3"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
              boxShadow: 'var(--shadow-card)',
              fontFamily: "'Courier New', Courier, monospace",
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Title level={3} style={{ margin: 0, color: 'var(--text-heading)', fontFamily: 'inherit' }}>
                Printopia <span style={{ color: '#0866F5' }}>Pakistan</span>
              </Title>
              <Text type="secondary" style={{ fontFamily: 'inherit', fontSize: 13 }}>Invoice & Order Review</Text>
            </div>

            <div style={{ borderTop: '2px dashed var(--border-divider)', borderBottom: '2px dashed var(--border-divider)', padding: '12px 0', marginBottom: 16 }}>
              <Row justify="space-between">
                <Col>
                  <Text style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--text-primary)' }}>
                    Bill No: BILL-{Date.now().toString().slice(-8).toUpperCase()}
                  </Text>
                </Col>
                <Col>
                  <Tag color="blue" style={{ fontFamily: 'inherit', borderRadius: 4, fontSize: 11, background: 'rgba(8, 102, 245, 0.15)', color: '#0866F5', borderColor: '#0866F5' }}>
                    PENDING
                  </Tag>
                </Col>
              </Row>
              <Row justify="space-between" style={{ marginTop: 4 }}>
                <Text style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--text-secondary)' }}>
                  Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}
                </Text>
                <Text style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--text-secondary)' }}>Items: {cart.length}</Text>
              </Row>
            </div>

            <div style={{ marginBottom: 16, fontSize: 13 }}>
              <Text style={{ fontFamily: 'inherit', color: 'var(--text-primary)' }}><strong>Customer:</strong> {state.fullName || user?.fullName || 'N/A'}</Text><br />
              <Text style={{ fontFamily: 'inherit', color: 'var(--text-secondary)' }}><strong>Address:</strong> {state.address ? `${state.address}, ${state.city}` : 'Pending'}</Text><br />
              <Text style={{ fontFamily: 'inherit', color: 'var(--text-secondary)' }}><strong>Phone:</strong> {state.phone || 'Pending'}</Text>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 16 }}>
              <thead>
                <tr style={{ borderTop: '1px solid var(--border-divider)', borderBottom: '1px solid var(--border-divider)' }}>
                  <th style={{ padding: '6px 4px', textAlign: 'left', fontFamily: 'inherit', color: 'var(--text-heading)' }}>#</th>
                  <th style={{ padding: '6px 4px', textAlign: 'left', fontFamily: 'inherit', color: 'var(--text-heading)' }}>Item</th>
                  <th style={{ padding: '6px 4px', textAlign: 'center', fontFamily: 'inherit', color: 'var(--text-heading)' }}>Qty</th>
                  <th style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'inherit', color: 'var(--text-heading)' }}>Price</th>
                  <th style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'inherit', color: 'var(--text-heading)' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, i) => (
                  <tr key={item._id || i} style={{ borderBottom: '1px dotted var(--border-divider)' }}>
                    <td style={{ padding: '6px 4px', fontFamily: 'inherit', color: 'var(--text-primary)' }}>{i + 1}</td>
                    <td style={{ padding: '6px 4px', fontFamily: 'inherit', color: 'var(--text-primary)' }}>{item.name}</td>
                    <td style={{ padding: '6px 4px', textAlign: 'center', fontFamily: 'inherit', color: 'var(--text-secondary)' }}>{item.quantity} {item.unit || 'pcs'}</td>
                    <td style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'inherit', color: 'var(--text-secondary)' }}>Rs {formatCurrency(item.price)}</td>
                    <td style={{ padding: '6px 4px', textAlign: 'right', fontFamily: 'inherit', color: 'var(--text-heading)', fontWeight: 'bold' }}>Rs {formatCurrency(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ borderTop: '2px dashed var(--border-divider)', paddingTop: 12, textAlign: 'right' }}>
              <Text style={{ fontFamily: 'inherit', fontSize: 18, fontWeight: 'bold', color: '#0866F5' }}>
                Grand Total: Rs {formatCurrency(cartTotal)}
              </Text>
            </div>

            <div style={{ textAlign: 'center', marginTop: 24, borderTop: '2px dashed var(--border-divider)', paddingTop: 16 }}>
              <Text type="secondary" style={{ fontFamily: 'inherit', fontSize: 12, display: 'block', marginBottom: 12 }}>
                Thank you for ordering with PrintopiaPK!
              </Text>
              <Button
                type="primary"
                size="large"
                block
                loading={isProcessing}
                onClick={handlePlaceOrder}
                style={{
                  background: '#0866F5',
                  borderColor: '#0866F5',
                  fontFamily: 'inherit',
                  width: '100%',
                  fontWeight: 700,
                  borderRadius: 8,
                  height: 46,
                }}
              >
                Place Order
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </main>
  )
}

export default Checkout
