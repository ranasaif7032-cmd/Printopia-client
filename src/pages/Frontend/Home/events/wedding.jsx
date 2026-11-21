import { ArrowRightOutlined, CrownOutlined } from '@ant-design/icons'

const WEDDING_ITEMS = [
  {
    title: 'Luxury Boxed Wedding Cards',
    desc: 'Rigid hardboard invitation boxes with velvet lining and gold hot-foil.',
    tag: 'Bestseller',
  },
  {
    title: 'Custom Mithai & Sweets Boxes',
    desc: 'Partitioned luxury boxes designed for laddoo, barfi, and dry fruits.',
    tag: 'Popular',
  },
  {
    title: 'Wedding Favor Bags & Pouches',
    desc: 'Customized fabric and paper favor bags with ribbon handles.',
    tag: 'Trending',
  },
  {
    title: 'Salami Envelopes & Wax Seals',
    desc: 'Metallic textured cash envelopes with customized family crests.',
    tag: 'Exclusive',
  },
]

const Wedding = ({ onItemClick }) => {
  return (
    <div className="event-collection-section wedding-section">
      <div className="event-section-header">
        <div>
          <h4 className="event-section-title">
            <span className="event-icon">👑</span> Wedding & Shadi Collection
          </h4>
          <p className="event-section-subtitle">
            Royal invitations, sweet boxes, and guest return favors
          </p>
        </div>
        <span className="event-pill-badge">
          <CrownOutlined style={{ marginRight: 4 }} /> Signature Wedding
        </span>
      </div>

      <div className="event-grid">
        {WEDDING_ITEMS.map((item, index) => (
          <div
            key={index}
            className="event-card-item"
            onClick={() => onItemClick && onItemClick('Wedding', item.title)}
          >
            <div className="event-card-top">
              <span className="event-item-tag">{item.tag}</span>
              <ArrowRightOutlined className="event-card-arrow" />
            </div>
            <h5 className="event-item-title">{item.title}</h5>
            <p className="event-item-desc">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wedding
