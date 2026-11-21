import { ArrowRightOutlined, StarOutlined } from '@ant-design/icons'

const NIKKAH_ITEMS = [
  {
    title: 'Nikkah Nama Certificate & Folder',
    desc: 'Luxury velvet certificate folder with golden Arabic calligraphy.',
    tag: 'Trending',
  },
  {
    title: 'Custom Nikkah Signature Pen',
    desc: 'Ostrich feather and metallic pens with personalized bride & groom tags.',
    tag: 'Bestseller',
  },
  {
    title: 'Mirror Nikkah Tray & Thali',
    desc: 'Handcrafted mirrored ring and sweet platters with floral borders.',
    tag: 'Luxury',
  },
  {
    title: 'Nikkah Bid & Dry Fruit Boxes',
    desc: 'Compact gold foiled favor boxes for badam, pista and sweets.',
    tag: 'Popular',
  },
]

const Nikkah = ({ onItemClick }) => {
  return (
    <div className="event-collection-section nikkah-section">
      <div className="event-section-header">
        <div>
          <h4 className="event-section-title">
            <span className="event-icon">💍</span> Nikkah Ceremony Essentials
          </h4>
          <p className="event-section-subtitle">
            Curated signatures, certificates, mirror plates and keepsake favors
          </p>
        </div>
        <span className="event-pill-badge">
          <StarOutlined style={{ marginRight: 4 }} /> Royal Wedding Series
        </span>
      </div>

      <div className="event-grid">
        {NIKKAH_ITEMS.map((item, index) => (
          <div
            key={index}
            className="event-card-item"
            onClick={() => onItemClick && onItemClick('Nikkah', item.title)}
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

export default Nikkah
