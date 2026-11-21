import { Typography, Row, Col } from 'antd'
import { ShopOutlined, SafetyOutlined, StarOutlined, PrinterOutlined, GiftOutlined, RocketOutlined } from '@ant-design/icons'

const { Title, Paragraph } = Typography

const About = () => {
  return (
    <main className="container py-5">
      <div className="text-center mb-5">
        <Title level={2}>
          About <span style={{ color: '#0866F5' }}>PrintopiaPK</span>
        </Title>
        <Paragraph style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 720, margin: '0 auto', lineHeight: 1.8 }}>
          Pakistan’s premier bespoke packaging, custom printing, and corporate branding atelier.
          We transform standard boxes, event favors, and merchandise into extraordinary luxury brand statements.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} className="mb-5">
        {[
          { icon: <PrinterOutlined style={{ fontSize: 40, color: '#0866F5' }} />, title: 'High-Precision Printing', desc: 'State-of-the-art UV coating, gold foiling, embossing, and waterproof vinyl label finishes.' },
          { icon: <GiftOutlined style={{ fontSize: 40, color: '#0866F5' }} />, title: 'Luxury Event Favors', desc: 'Bespoke Hajj & Umrah tabarruk packages, royal wedding bid boxes, and nikkah giveaways.' },
          { icon: <RocketOutlined style={{ fontSize: 40, color: '#0866F5' }} />, title: 'Startup & Corporate Packs', desc: 'Mailer boxes, thank you cards, and product sleeve packaging with no minimum order hurdles.' },
        ].map((item, i) => (
          <Col xs={24} md={8} key={i}>
            <div
              className="text-center p-4 border rounded-3"
              style={{
                height: '100%',
                background: 'var(--bg-card)',
                borderColor: 'var(--border-color)',
                boxShadow: 'var(--shadow-card)',
                borderRadius: 12,
              }}
            >
              <div className="mb-3">{item.icon}</div>
              <Title level={4} style={{ marginBottom: 12 }}>{item.title}</Title>
              <Paragraph style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</Paragraph>
            </div>
          </Col>
        ))}
      </Row>
    </main>
  )
}

export default About
