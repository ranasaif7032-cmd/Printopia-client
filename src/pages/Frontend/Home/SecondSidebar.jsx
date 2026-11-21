import { ArrowRightOutlined, ArrowLeftOutlined, TagOutlined, ShoppingOutlined } from '@ant-design/icons'

const SecondSidebar = ({
  category,
  onSelectSubcategory,
  onBack,
  isMobile = false,
}) => {
  if (!category) return null

  return (
    <div className={`second-sidebar-panel ${isMobile ? 'is-mobile' : ''}`}>
      {/* Mobile Header with Back Button */}
      {isMobile && (
        <div className="second-sidebar-header-mobile">
          <button
            type="button"
            className="second-sidebar-back-btn"
            onClick={onBack}
            aria-label="Back to main categories"
          >
            <ArrowLeftOutlined /> Back to Categories
          </button>
        </div>
      )}

      {/* Category Heading */}
      <div className="second-sidebar-header">
        <div className="category-title-wrap">
          <span className="category-icon">{category.icon}</span>
          <div>
            <h3 className="category-title">{category.name}</h3>
            <span className="category-subtitle">
              {category.subcategories?.length || 0} Products & Collections
            </span>
          </div>
        </div>
        {category.badge && (
          <span className="category-highlight-badge">{category.badge}</span>
        )}
      </div>

      {/* Subcategory List */}
      <div className="second-sidebar-body">
        <ul className="subcategory-list">
          {category.subcategories?.map((sub, index) => {
            const subName = typeof sub === 'string' ? sub : sub.name
            const badge = typeof sub === 'object' ? sub.badge : null

            return (
              <li
                key={index}
                className="subcategory-item"
                onClick={() => onSelectSubcategory && onSelectSubcategory(category, subName)}
              >
                <div className="subcategory-info">
                  <span className="subcategory-bullet" />
                  <span className="subcategory-name">{subName}</span>
                  {badge && (
                    <span className="subcategory-badge">
                      <TagOutlined style={{ fontSize: 10, marginRight: 3 }} />
                      {badge}
                    </span>
                  )}
                </div>
                <ArrowRightOutlined className="subcategory-arrow" />
              </li>
            )
          })}
        </ul>

        {/* Featured Mini Showcase Card */}
        {category.featured && (
          <div className="second-sidebar-featured-card">
            <div className="featured-badge">{category.featured.tag}</div>
            <h4 className="featured-title">{category.featured.title}</h4>
            <p className="featured-desc">{category.featured.description}</p>
            <button
              type="button"
              className="featured-shop-btn"
              onClick={() => onSelectSubcategory && onSelectSubcategory(category, category.name)}
            >
              <ShoppingOutlined style={{ marginRight: 6 }} /> Explore All {category.name}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SecondSidebar
