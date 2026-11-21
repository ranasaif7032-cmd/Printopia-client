import { useState } from 'react'
import Wedding from './events/wedding'
import Nikkah from './events/nikkah'
import Aqeeqa from './events/aqeeqa'
import { ArrowRightOutlined, CalendarOutlined, FireOutlined } from '@ant-design/icons'

const EVENT_TABS = [
  { id: 'all', label: 'All Events', icon: '✨' },
  { id: 'wedding', label: 'Wedding & Shadi', icon: '👑' },
  { id: 'nikkah', label: 'Nikkah Ceremony', icon: '💍' },
  { id: 'aqeeqa', label: 'Aqeeqa & Baby', icon: '👶' },
]

const QUICK_EVENT_LINKS = [
  'Bridal Shower Favors',
  'Birthday Theme Packs',
  'Anniversary Frames',
  'Hajj & Umrah Welcome Sets',
  'Corporate Dinner Gifts',
  'Graduation Cap Souvenirs',
]

const Events = ({ onSelectItem }) => {
  const [activeTab, setActiveTab] = useState('all')

  const handleItemClick = (category, itemTitle) => {
    if (onSelectItem) {
      onSelectItem(category, itemTitle)
    }
  }

  return (
    <div className="mega-menu-panel events-panel">
      <div className="events-panel-header">
        <div className="events-title-wrap">
          <span className="events-icon-badge">
            <CalendarOutlined />
          </span>
          <div>
            <h3 className="events-main-title">Special Events & Celebrations</h3>
            <p className="events-main-subtitle">
              Customized invitations, favor packaging, and ceremony keepsakes for every milestone
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="events-tab-nav">
          {EVENT_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`events-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="events-panel-content">
        {/* Render Tab Specific or All */}
        {(activeTab === 'all' || activeTab === 'wedding') && (
          <Wedding onItemClick={handleItemClick} />
        )}

        {(activeTab === 'all' || activeTab === 'nikkah') && (
          <Nikkah onItemClick={handleItemClick} />
        )}

        {(activeTab === 'all' || activeTab === 'aqeeqa') && (
          <Aqeeqa onItemClick={handleItemClick} />
        )}
      </div>

      {/* Footer with quick links */}
      <div className="events-panel-footer">
        <div className="quick-events-label">
          <FireOutlined style={{ color: '#2563eb', marginRight: 6 }} /> More Occasions:
        </div>
        <div className="quick-events-tags">
          {QUICK_EVENT_LINKS.map((link, idx) => (
            <span
              key={idx}
              className="quick-event-tag"
              onClick={() => handleItemClick('Events', link)}
            >
              {link} <ArrowRightOutlined style={{ fontSize: 9, marginLeft: 4 }} />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Events
