import { useState, useEffect } from 'react'
import { useAuth } from '@/context/Auth'
import { api } from '@/config/api'
import { Card, Col, Empty, Row, Spin, Tag, Typography, Popconfirm, Button } from 'antd'
import { ShoppingOutlined, DeleteOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { formatDate, formatCurrency } from '@/utils/format'

const { Title, Text } = Typography

const statusColors = {
  pending: 'orange', confirmed: 'blue', shipped: 'purple',
  delivered: 'green', cancelled: 'red'
}

const Orders = () => {
  const { user, isAuth } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) { navigate('/auth/login'); return }
    const fetchOrders = async () => {
      try {
        const data = await api.get('/orders')
        setOrders(data)
      } catch {
        setOrders([])
        window.toastify?.('Failed to load orders', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [user, isAuth, navigate])

  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}`, { status: 'cancelled' })
      setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: 'cancelled' } : o))
      window.toastify?.('Order cancelled. Stock has been restored.', 'success')
    } catch {
      window.toastify?.('Failed to cancel order', 'error')
    }
  }

  if (loading) return <main className="container py-5 text-center"><Spin size="large" /></main>

  return (
    <main className="container py-5">
      <div className="d-flex align-items-center gap-3 mb-4">
        <ShoppingOutlined style={{ fontSize: 28, color: '#0866F5' }} />
        <Title level={2} style={{ margin: 0 }}>
          My <span style={{ color: '#0866F5' }}>Orders</span>
        </Title>
      </div>
      {orders.length === 0 ? (
        <Card style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', borderRadius: 12 }}>
          <Empty description="No orders placed yet">
            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/shop')}
              style={{ background: '#0866F5', borderColor: '#0866F5', borderRadius: 8 }}
            >
              Start Shopping
            </Button>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[20, 20]} justify="center">
          {orders.map(order => (
            <Col xs={24} sm={22} md={18} lg={14} key={order._id || order.id}>
              <Card
                style={{
                  borderRadius: 12,
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-card)',
                  fontFamily: "'Courier New', Courier, monospace",
                }}
                styles={{ body: { padding: '28px 32px' } }}
              >
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <Title level={3} style={{ margin: 0, color: 'var(--text-heading)', fontFamily: 'inherit' }}>
                    Printopia <span style={{ color: '#0866F5' }}>Pakistan</span>
                  </Title>
                  <Text type="secondary" style={{ fontFamily: 'inherit', fontSize: 13 }}>Order Receipt</Text>
                </div>

                <div style={{ borderTop: '2px dashed var(--border-divider)', borderBottom: '2px dashed var(--border-divider)', padding: '12px 0', marginBottom: 16 }}>
                  <Row justify="space-between">
                    <Col>
                      <Text style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--text-primary)' }}>
                        Bill No: BILL-{(order._id || order.id).slice(-8).toUpperCase()}
                      </Text>
                    </Col>
                    <Col>
                      <Tag color={statusColors[order.status]} style={{ fontFamily: 'inherit', borderRadius: 4, fontSize: 11 }}>
                        {order.status.toUpperCase()}
                      </Tag>
                    </Col>
                  </Row>
                  <Row justify="space-between" style={{ marginTop: 4 }}>
                    <Text style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--text-secondary)' }}>
                      Date: {formatDate(order.createdAt)}
                    </Text>
                    <Text style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--text-secondary)' }}>
                      Items: {order.items?.length || 0}
                    </Text>
                  </Row>
                </div>

                <div style={{ marginBottom: 16, fontSize: 13 }}>
                  <Text style={{ fontFamily: 'inherit', color: 'var(--text-primary)' }}><strong>Customer:</strong> {order.shipping?.fullName || order.userEmail || 'N/A'}</Text><br />
                  <Text style={{ fontFamily: 'inherit', color: 'var(--text-secondary)' }}><strong>Address:</strong> {order.shipping?.address}, {order.shipping?.city}</Text><br />
                  <Text style={{ fontFamily: 'inherit', color: 'var(--text-secondary)' }}><strong>Phone:</strong> {order.shipping?.phone || 'N/A'}</Text>
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
                    {order.items?.map((item, i) => (
                      <tr key={item.id || i} style={{ borderBottom: '1px dotted var(--border-divider)' }}>
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
                    Grand Total: Rs {formatCurrency(order.total)}
                  </Text>
                </div>

                <div style={{ textAlign: 'center', marginTop: 24, borderTop: '2px dashed var(--border-divider)', paddingTop: 16 }}>
                  <Text type="secondary" style={{ fontFamily: 'inherit', fontSize: 12, display: 'block', marginBottom: 12 }}>
                    Thank you for trusting PrintopiaPK!
                  </Text>
                  {order.status !== 'delivered' && order.status !== 'cancelled' && (
                    <Popconfirm
                      title="Cancel this order?"
                      description="Stock will be restored for all items."
                      onConfirm={() => handleCancelOrder(order._id || order.id)}
                      okText="Cancel Order"
                      cancelText="Keep Order"
                      okButtonProps={{ danger: true }}
                    >
                      <button style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 18px', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, borderRadius: 6 }}>
                        <DeleteOutlined /> Cancel Order
                      </button>
                    </Popconfirm>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </main>
  )
}

export default Orders
