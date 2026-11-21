import { ArrowRightOutlined, HeartOutlined } from '@ant-design/icons'

const AQEEQA_ITEMS = [
  {
    title: 'Baby Announcement Box',
    desc: 'Gold foiled luxury box with custom baby name and prayer.',
    tag: 'Bestseller',
  },
  {
    title: 'Aqeeqa Sweets & Mithai Pouch',
    desc: 'Velvet & organza pouches with metallic calligraphic tags.',
    tag: 'Popular',
  },
  {
    title: 'Baby Welcome & Dua Cards',
    desc: 'Premium textured cards customized with date and birth details.',
    tag: 'Customized',
  },
  {
    title: 'Mini Honey & Zamzam Favors',
    desc: 'Decorative glass bottles with custom ribbons and seal.',
    tag: 'Trending',
  },
]

const Aqeeqa = ({ onItemClick }) => {
  return (
    <div className="event-collection-section aqeeqa-section">
      <div className="event-section-header">
        <div>
          <h4 className="event-section-title">
            <span className="event-icon">👶</span> Aqeeqa & New Born Collection
          </h4>
          <p className="event-section-subtitle">
            Cherish your blessing with personalized announcement gifts & packaging
          </p>
        </div>
        <span className="event-pill-badge">
          <HeartOutlined style={{ marginRight: 4 }} /> New Born Essentials
        </span>
      </div>

      <div className="event-grid">
        {AQEEQA_ITEMS.map((item, index) => (
          <div
            key={index}
            className="event-card-item"
            onClick={() => onItemClick && onItemClick('Aqeeqa', item.title)}
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

export default Aqeeqa
