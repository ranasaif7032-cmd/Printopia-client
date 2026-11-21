import { Button, Col, Form, Input, Row, Typography } from 'antd'
import { useState } from 'react'
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons'
import { api } from '@/config/api'

const { Title, Paragraph, Text } = Typography
const { Item } = Form
const { TextArea } = Input

const Contact = () => {
  const [state, setState] = useState({ name: '', email: '', subject: '', message: '' })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = async () => {
    const { name, email, subject, message } = state
    if (!name.trim()) { window.toastify('Please enter your name', 'error'); return }
    if (!email.trim()) { window.toastify('Please enter your email', 'error'); return }
    if (!message.trim()) { window.toastify('Please enter your message', 'error'); return }

    setIsProcessing(true)
    try {
      await api.post('/contact', { name, email, subject, message })
      window.toastify('Message sent to Printopia Team!', 'success')
      setState({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      window.toastify(err.message || 'Failed to send message', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <Title level={2}>
          Contact <span style={{ color: '#0866F5' }}>Us</span>
        </Title>
        <Paragraph style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
          Have custom specifications or printing questions? Our experts are ready to assist.
        </Paragraph>
      </div>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <div
            className="p-4 border rounded-3 mb-3"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}
          >
            <Title level={4}><MailOutlined style={{ color: '#0866F5' }} /> Email Us</Title>
            <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
              printopiapk905@gmail.com

            </Paragraph>
          </div>
          <div
            className="p-4 border rounded-3 mb-3"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}
          >
            <Title level={4}><PhoneOutlined style={{ color: '#0866F5' }} /> Call & WhatsApp</Title>
            <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>+92 (328) 006-0010</Paragraph>
            <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>+92 (318) 651-3600</Paragraph>
            {/* <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>+92 (305) 663-3525</Paragraph> */}
          </div>
          <div
            className="p-4 border rounded-3"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}
          >
            <Title level={4}><EnvironmentOutlined style={{ color: '#0866F5' }} /> Studio Location</Title>
            <Paragraph style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
              House number 718F block Al Rehman garden phase2 lhr

            </Paragraph>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div
            className="p-4 border rounded-3"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', boxShadow: 'var(--shadow-card)' }}
          >
            <Title level={4}>Send us a Message</Title>
            <Paragraph style={{ color: 'var(--text-secondary)' }}>
              Fill in your details and we will get back to you with custom packaging rates.
            </Paragraph>
            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Item label="Name" required>
                    <Input size="large" placeholder="Your name" name="name" value={state.name} onChange={handleChange} />
                  </Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Item label="Email" required>
                    <Input size="large" placeholder="Your email" name="email" value={state.email} onChange={handleChange} />
                  </Item>
                </Col>
              </Row>
              <Item label="Subject">
                <Input size="large" placeholder="Subject or Box Dimensions" name="subject" value={state.subject} onChange={handleChange} />
              </Item>
              <Item label="Message" required>
                <TextArea rows={4} size="large" placeholder="Describe your custom packaging or order needs..." name="message" value={state.message} onChange={handleChange} />
              </Item>
              <Button
                type="primary"
                size="large"
                block
                icon={<SendOutlined />}
                loading={isProcessing}
                onClick={handleSubmit}
                style={{
                  background: '#0866F5',
                  borderColor: '#0866F5',
                  height: 46,
                  fontWeight: 700,
                  borderRadius: 8,
                }}
              >
                Send Message
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </main>
  )
}

export default Contact
