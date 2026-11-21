import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/config/api'
import {
  MenuOutlined,
  DownOutlined,
  RightOutlined,
  CloseOutlined,
  FireOutlined,
  WhatsAppOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import SecondSidebar from './SecondSidebar'
import Events from './Events'
import Boxes from './boxes'
import { SIDEBAR_CATEGORIES, TOP_NAV_ITEMS } from './sidebarCategories'
import './HomeSidebar.css'

const DEALS_DATA = [
  {
    title: 'Hajj & Umrah Mega Tabarruk Pack',
    desc: 'Complete 50 pcs tabarruk bag, tin box, and zamzam bottle gift combo.',
    badge: 'SAVE 25%',
    category: 'Hajj & Umrah',
  },
  {
    title: 'Small Business Starter Suite',
    desc: '100 Mailer Boxes + 250 Logo Stickers + 100 Thank You Cards.',
    badge: 'FLAT 20% OFF',
    category: 'Startup & Small Business',
  },
  {
    title: 'Royal Wedding Bid Box Bundle',
    desc: 'Custom gold foiled luxury bid boxes with velvet partition trays.',
    badge: 'LIMITED OFFER',
    category: 'Weddings',
  },
  {
    title: 'Custom Die-Cut Sticker Roll Pack',
    desc: '1,000 waterproof vinyl labels with glossy UV finish.',
    badge: 'BESTSELLER DEAL',
    category: 'Cards & Stickers',
  },
]

const HomeSidebar = ({ onCategorySelect }) => {
  const navigate = useNavigate()

  // State: Sidebar MUST stay closed by default on load, refresh, or normal navigation
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [activeTopMenu, setActiveTopMenu] = useState(null) // 'events' | 'boxes' | 'deals' | null
  const [hoveredCategory, setHoveredCategory] = useState(SIDEBAR_CATEGORIES[0] || null)
  const [deals, setDeals] = useState(DEALS_DATA)

  // Mobile State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [mobileActiveTab, setMobileActiveTab] = useState('categories')
  const [mobileSelectedCategory, setMobileSelectedCategory] = useState(null)

  // Expandable Category Accordion State for inline views
  const [expandedCategories, setExpandedCategories] = useState({})

  // Fetch active customer-facing offers for Deals panel
  useEffect(() => {
    const fetchActiveOffers = async () => {
      try {
        const data = await api.get('/offers')
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((o) => ({
            title: o.title,
            desc: o.description,
            badge: o.badge || `${o.discountPercentage}% OFF`,
            category: o.category || 'Special Offers',
            link: o.targetLink || '',
          }))
          setDeals(mapped)
          return
        }
      } catch {
        // ignore
      }
      const cached = localStorage.getItem('printopia_dashboard_offers')
      if (cached) {
        try {
          const list = JSON.parse(cached)
          const activeOnly = list.filter((o) => o.isActive)
          if (activeOnly.length > 0) {
            setDeals(
              activeOnly.map((o) => ({
                title: o.title,
                desc: o.description,
                badge: o.badge || `${o.discountPercentage}% OFF`,
                category: o.category || 'Special Offers',
                link: o.targetLink || '',
              }))
            )
          }
        } catch {
          // ignore error
        }
      }
    }
    fetchActiveOffers()
  }, [])

  // Close all sidebar and dropdown menus
  const closeSidebar = useCallback(() => {
    setIsCategoriesOpen(false)
    setActiveTopMenu(null)
    setMobileDrawerOpen(false)
    setMobileSelectedCategory(null)
  }, [])

  // Keyboard support: Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeSidebar()
      }
    }

    if (isCategoriesOpen || mobileDrawerOpen || activeTopMenu) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCategoriesOpen, mobileDrawerOpen, activeTopMenu, closeSidebar])

  // Toggle categories menu explicitly on user click only
  const handleToggleCategories = useCallback(() => {
    setIsCategoriesOpen((prev) => {
      const next = !prev
      if (next && !hoveredCategory && SIDEBAR_CATEGORIES.length > 0) {
        setHoveredCategory(SIDEBAR_CATEGORIES[0])
      }
      return next
    })
    setActiveTopMenu(null)
  }, [hoveredCategory])

  // Support global custom event to toggle sidebar
  useEffect(() => {
    const handleToggleEvent = () => handleToggleCategories()
    window.addEventListener('printopia_toggle_sidebar', handleToggleEvent)
    return () => window.removeEventListener('printopia_toggle_sidebar', handleToggleEvent)
  }, [handleToggleCategories])

  // Toggle top menu items (EVENTS, BOXES, DEALS) on click
  const handleToggleTopMenu = (menuId) => {
    if (activeTopMenu === menuId) {
      setActiveTopMenu(null)
    } else {
      setActiveTopMenu(menuId)
      setIsCategoriesOpen(false)
    }
  }

  // Toggle inline accordion for mobile or inline lists
  const toggleExpandCategory = (catId, e) => {
    if (e) e.stopPropagation()
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }))
  }

  // Handle navigation to Shop with filtered category/subcategory
  const handleItemNavigation = (categoryName, subcategoryName) => {
    if (onCategorySelect) {
      onCategorySelect(subcategoryName || categoryName)
    }

    closeSidebar()

    const targetFilter = subcategoryName || categoryName
    navigate(`/shop?category=${encodeURIComponent(targetFilter)}`)
  }

  // Render Deals Mega Menu Content
  const renderDealsPanel = () => (
    <div className="mega-menu-panel deals-panel">
      <div className="deals-panel-header">
        <h3 className="events-main-title">
          <FireOutlined style={{ color: '#ea580c', marginRight: 8 }} />
          Exclusive Hot Deals & Value Bundles
        </h3>
        <p className="events-main-subtitle">
          Save more with our curated packaging bundles and bulk discount packages
        </p>
      </div>
      <div className="deals-grid">
        {deals.map((deal, idx) => (
          <div
            key={idx}
            className="deal-card"
            onClick={() => handleItemNavigation(deal.category, deal.title)}
          >
            <span className="deal-badge">{deal.badge}</span>
            <h4 className="deal-title">{deal.title}</h4>
            <p className="deal-desc">{deal.desc}</p>
            <div className="deal-cta">
              Claim Deal <ArrowRightOutlined style={{ fontSize: 11 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  // Render categories list (with modern typography and clean spacing)
  const renderCategoriesList = (isMobile = false) => (
    <ul className="sidebar-categories-list">
      {SIDEBAR_CATEGORIES.map((cat) => {
        const isSelected =
          (isMobile && mobileSelectedCategory?.id === cat.id) ||
          (!isMobile && hoveredCategory?.id === cat.id)
        const isExpanded = !!expandedCategories[cat.id]
        const hasSubcategories = cat.subcategories && cat.subcategories.length > 0

        return (
          <li key={cat.id} className="sidebar-category-wrapper">
            <div
              className={`sidebar-category-item ${isSelected ? 'is-selected' : ''}`}
              onMouseEnter={() => {
                if (!isMobile) setHoveredCategory(cat)
              }}
              onClick={() => {
                if (isMobile) {
                  setMobileSelectedCategory(cat)
                } else {
                  setHoveredCategory(cat)
                  handleItemNavigation(cat.name)
                }
              }}
            >
              <div className="category-item-left">
                <span className="category-emoji">{cat.icon}</span>
                <span className="category-name-text">{cat.name}</span>
              </div>
              <div className="category-item-right">
                {cat.badge && (
                  <span className="category-badge-pill">{cat.badge}</span>
                )}
                {hasSubcategories && (
                  <button
                    type="button"
                    className={`category-expand-btn ${isExpanded ? 'expanded' : ''}`}
                    title={isExpanded ? 'Collapse subcategories' : 'Expand subcategories'}
                    onClick={(e) => toggleExpandCategory(cat.id, e)}
                    aria-label={isExpanded ? `Collapse ${cat.name}` : `Expand ${cat.name}`}
                  >
                    {isExpanded ? (
                      <DownOutlined className="category-arrow-icon" />
                    ) : (
                      <RightOutlined className="category-arrow-icon" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Nested Subcategories for Mobile or Accordion view */}
            {hasSubcategories && isExpanded && isMobile && (
              <ul className="sidebar-nested-subcategories">
                {cat.subcategories.map((sub, sIdx) => {
                  const subName = typeof sub === 'string' ? sub : sub.name
                  const subBadge = typeof sub === 'object' ? sub.badge : null

                  return (
                    <li
                      key={sIdx}
                      className="sidebar-nested-item"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleItemNavigation(cat.name, subName)
                      }}
                    >
                      <div className="nested-item-left">
                        <span className="nested-bullet" />
                        <span className="nested-name">{subName}</span>
                      </div>
                      {subBadge && (
                        <span className="nested-badge-pill">{subBadge}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )
      })}
    </ul>
  )

  return (
    <>
      {/* Desktop Main Navigation Bar */}
      <nav className="printasy-nav-wrapper" aria-label="Main Store Navigation">
        <div className="printasy-nav-container">
          <div className="printasy-nav-left">
            {/* Category Trigger Button - Opens only on click */}
            <button
              type="button"
              className={`categories-trigger-btn ${isCategoriesOpen ? 'is-active' : ''}`}
              onClick={handleToggleCategories}
              aria-expanded={isCategoriesOpen}
              aria-haspopup="true"
              id="browse-categories-trigger"
            >
              <MenuOutlined className="trigger-hamburger" />
              <span>Browse Categories</span>
              <DownOutlined className={`trigger-arrow ${isCategoriesOpen ? 'is-rotated' : ''}`} />
            </button>

            {/* Top Navigation Items: EVENTS, BOXES, DEALS */}
            <ul className="main-nav-links">
              {TOP_NAV_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className={`main-nav-item ${activeTopMenu === item.id ? 'active' : ''}`}
                  onClick={() => handleToggleTopMenu(item.id)}
                >
                  <button type="button" className="main-nav-link-btn">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`main-nav-badge ${item.id === 'events'
                          ? 'hot'
                          : item.id === 'boxes'
                            ? 'popular'
                            : 'sale'
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <DownOutlined style={{ fontSize: 10, marginLeft: 2 }} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right quick customer assistance */}
          <div className="printasy-nav-right">
            <a
              href="https://wa.me/923186513600"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-whatsapp-chip"
            >
              <WhatsAppOutlined /> Custom Orders: 0318 6513600
            </a>
            <span
              className="nav-help-link"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/contact')}
            >
              Packaging Guide
            </span>
          </div>
        </div>

        {/* Backdrop Overlay when Category Sidebar is Open */}
        {isCategoriesOpen && (
          <div
            className="sidebar-backdrop-overlay"
            onClick={closeSidebar}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Desktop Multi-Level Sidebar Drawer (Printasy.pk Two-Column Style) */}
        {isCategoriesOpen && (
          <div className="sidebar-multi-panel-wrap">
            {/* Sidebar Top Header with Working Close (X) Button */}
            <div className="sidebar-panel-header">
              <div className="sidebar-header-title-wrap">
                <MenuOutlined className="sidebar-header-icon" />
                <span className="sidebar-header-title">Categories & Collections</span>
              </div>
              <button
                type="button"
                className="sidebar-close-btn"
                onClick={closeSidebar}
                aria-label="Close categories sidebar"
                title="Close (Esc)"
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Multi-Panel Body */}
            <div className="sidebar-panels-container">
              {/* Level 1: Categories List */}
              <div className="first-sidebar-panel">
                {renderCategoriesList(false)}
              </div>

              {/* Level 2: Subcategories SecondSidebar */}
              <div className="second-sidebar-container">
                <SecondSidebar
                  category={hoveredCategory || SIDEBAR_CATEGORIES[0]}
                  onSelectSubcategory={(cat, subName) =>
                    handleItemNavigation(cat.name, subName)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Top Menu Dropdowns (EVENTS, BOXES, DEALS) */}
        {activeTopMenu && (
          <>
            <div className="sidebar-backdrop-overlay" onClick={closeSidebar} />
            <div className="desktop-menu-overlay-container">
              <div className="desktop-menu-wrapper">
                <div className="mega-menu-dropdown">
                  {activeTopMenu === 'events' && (
                    <Events onSelectItem={(cat, item) => handleItemNavigation(cat, item)} />
                  )}
                  {activeTopMenu === 'boxes' && (
                    <Boxes onSelectItem={(cat, item) => handleItemNavigation(cat, item)} />
                  )}
                  {activeTopMenu === 'deals' && renderDealsPanel()}
                </div>
              </div>
            </div>
          </>
        )}
      </nav>

      {/* Mobile Responsive Trigger Bar */}
      <div className="mobile-nav-toggle-bar">
        <button
          type="button"
          className="mobile-menu-open-btn"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open categories menu"
        >
          <span>
            <MenuOutlined style={{ marginRight: 8 }} /> Browse Categories & Collections
          </span>
          <RightOutlined style={{ fontSize: 12 }} />
        </button>
      </div>

      {/* Mobile Slide-Over Drawer with Working Close (X) Button */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={closeSidebar}
          aria-label="Close mobile menu backdrop"
        >
          <div
            className="mobile-drawer-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header with Working Close (X) button */}
            <div className="mobile-drawer-header">
              <h3 className="mobile-drawer-title">
                <MenuOutlined style={{ marginRight: 8, color: '#0866F5' }} /> Store Menu
              </h3>
              <button
                type="button"
                className="mobile-drawer-close-btn"
                onClick={closeSidebar}
                aria-label="Close menu"
                title="Close"
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Drawer Navigation Tabs */}
            <div className="mobile-drawer-tabs">
              <button
                type="button"
                className={`mobile-tab-btn ${mobileActiveTab === 'categories' ? 'active' : ''
                  }`}
                onClick={() => {
                  setMobileActiveTab('categories')
                  setMobileSelectedCategory(null)
                }}
              >
                Categories
              </button>
              <button
                type="button"
                className={`mobile-tab-btn ${mobileActiveTab === 'events' ? 'active' : ''
                  }`}
                onClick={() => setMobileActiveTab('events')}
              >
                Events
              </button>
              <button
                type="button"
                className={`mobile-tab-btn ${mobileActiveTab === 'boxes' ? 'active' : ''
                  }`}
                onClick={() => setMobileActiveTab('boxes')}
              >
                Boxes
              </button>
              <button
                type="button"
                className={`mobile-tab-btn ${mobileActiveTab === 'deals' ? 'active' : ''
                  }`}
                onClick={() => setMobileActiveTab('deals')}
              >
                Deals
              </button>
            </div>

            {/* Drawer Content */}
            <div className="mobile-drawer-body">
              {mobileActiveTab === 'categories' && (
                <>
                  {!mobileSelectedCategory ? (
                    renderCategoriesList(true)
                  ) : (
                    <SecondSidebar
                      category={mobileSelectedCategory}
                      isMobile={true}
                      onBack={() => setMobileSelectedCategory(null)}
                      onSelectSubcategory={(cat, subName) =>
                        handleItemNavigation(cat.name, subName)
                      }
                    />
                  )}
                </>
              )}

              {mobileActiveTab === 'events' && (
                <Events onSelectItem={(cat, item) => handleItemNavigation(cat, item)} />
              )}

              {mobileActiveTab === 'boxes' && (
                <Boxes onSelectItem={(cat, item) => handleItemNavigation(cat, item)} />
              )}

              {mobileActiveTab === 'deals' && renderDealsPanel()}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HomeSidebar
