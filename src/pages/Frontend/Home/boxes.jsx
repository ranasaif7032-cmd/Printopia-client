import { ArrowRightOutlined, InboxOutlined, CheckCircleOutlined } from '@ant-design/icons'

const BOX_CATEGORIES = [
  {
    title: 'Luxury Rigid Boxes',
    desc: 'Heavy hardboard boxes with magnetic closures, ribbons, or custom partitions.',
    badge: 'Luxury',
    icon: '🎁',
  },
  {
    title: 'Goody & Favor Boxes',
    desc: 'Lightweight cardboard boxes with die-cut handles for party & event favors.',
    badge: 'Bestseller',
    icon: '🛍️',
  },
  {
    title: 'Tin & Metal Gift Boxes',
    desc: 'Rust-resistant decorative metal tins ideal for tabarruk, sweets, and dry fruits.',
    badge: 'Durable',
    icon: '🥫',
  },
  {
    title: 'Flap Style Box-Bags',
    desc: 'Hybrid foldable boxes with secure button flaps and rope or ribbon handles.',
    badge: 'Popular',
    icon: '💼',
  },
  {
    title: 'Corrugated Mailer Boxes',
    desc: 'Crash-lock and tuck-top corrugated shipping cartons for safe parcel delivery.',
    badge: 'E-commerce',
    icon: '📦',
  },
  {
    title: 'Food & Bakery Boxes',
    desc: 'Food-grade certified paper boxes with transparent PET display windows.',
    badge: 'Food Safe',
    icon: '🍰',
  },
]

const BOX_FEATURES = [
  'Custom Dimensions & Die-Cuts',
  'Foil Stamping (Gold/Silver/Rose)',
  'UV Spot & Velvet Lamination',
  'Sample Orders Before Bulk Production',
]

const Boxes = ({ onSelectItem }) => {
  const handleBoxClick = (boxTitle) => {
    if (onSelectItem) {
      onSelectItem('Boxes', boxTitle)
    }
  }

  return (
    <div className="mega-menu-panel boxes-panel">
      <div className="boxes-panel-header">
        <div className="boxes-title-wrap">
          <span className="boxes-icon-badge">
            <InboxOutlined />
          </span>
          <div>
            <h3 className="boxes-main-title">Custom Packaging & Gift Boxes</h3>
            <p className="boxes-main-subtitle">
              From premium rigid wedding boxes to bulk e-commerce mailers, crafted to perfection
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Box Types */}
      <div className="boxes-grid">
        {BOX_CATEGORIES.map((box, index) => (
          <div
            key={index}
            className="box-card-item"
            onClick={() => handleBoxClick(box.title)}
          >
            <div className="box-card-top">
              <span className="box-type-icon">{box.icon}</span>
              <span className="box-item-badge">{box.badge}</span>
            </div>
            <h4 className="box-card-title">{box.title}</h4>
            <p className="box-card-desc">{box.desc}</p>
            <div className="box-card-footer">
              <span className="box-explore-link">
                View Designs <ArrowRightOutlined style={{ fontSize: 11, marginLeft: 4 }} />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Box Customization Feature Strip */}
      <div className="boxes-features-strip">
        <div className="features-strip-title">Why Choose Our Packaging:</div>
        <div className="features-list">
          {BOX_FEATURES.map((feat, i) => (
            <div key={i} className="feature-pill">
              <CheckCircleOutlined style={{ color: '#2563eb', marginRight: 6 }} />
              <span>{feat}</span>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="custom-box-quote-btn"
          onClick={() => handleBoxClick('Custom Box Order')}
        >
          Request Custom Size Quote
        </button>
      </div>
    </div>
  )
}

export default Boxes
