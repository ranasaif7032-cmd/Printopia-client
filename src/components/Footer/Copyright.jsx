import { Col, Row, Typography } from "antd"
import { Link } from "react-router-dom"
import ThemeToggle from "@/components/Misc/ThemeToggle"

const { Paragraph, Title } = Typography

const Copyright = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="store-footer">
      <div className="container py-4">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={10}>
            <Title level={4} style={{ color: "var(--text-heading)", marginBottom: 12 }}>
              Printopia <span style={{ color: "#0866F5" }}>Pakistan</span>
            </Title>
            <Paragraph style={{ color: "var(--text-secondary)", maxWidth: 380, lineHeight: 1.7 }}>
              Your premium destination for custom packaging, luxury wedding bid boxes, Hajj & Umrah tabarruk essentials, die-cut branding labels, and everyday merchandise.
            </Paragraph>
            <div className="mt-3 d-flex align-items-center gap-2">
              <span style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Theme:</span>
              <ThemeToggle showLabel variant="button" size="small" />
            </div>
          </Col>
          <Col xs={12} sm={6} md={7}>
            <Title level={5} style={{ color: "var(--text-heading)", marginBottom: 12 }}>Quick Links</Title>
            <div className="d-flex flex-column gap-2">
              <div><Link to="/">Home</Link></div>
              <div><Link to="/shop">Explore Shop</Link></div>
              <div><Link to="/about">About Our Story</Link></div>
              <div><Link to="/contact">Get in Touch</Link></div>
            </div>
          </Col>
          <Col xs={12} sm={6} md={7}>
            <Title level={5} style={{ color: "var(--text-heading)", marginBottom: 12 }}>Customer Care</Title>
            <div className="d-flex flex-column gap-2">
              <div><Link to="/cart">View Cart</Link></div>
              <div><Link to="/orders">Order Tracking</Link></div>
              <div><Link to="/contact">Custom Printing Inquiry</Link></div>
              <div><Link to="/contact">WhatsApp Support</Link></div>
            </div>
          </Col>
        </Row>
        <hr />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 pb-2">
          <Paragraph className="mb-0" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            &copy; {year} PrintopiaPK . All rights reserved.
          </Paragraph>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Engineered with <span style={{ color: "#0866F5" }}>Pure Black & Electric Blue</span> Design
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Copyright
