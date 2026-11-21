import { SIDEBAR_CATEGORIES } from '../pages/Frontend/Home/sidebarCategories.js'

/**
 * Standard subcategory map for categories with predefined subcategories.
 */
export const PARENT_SUBCATEGORY_MAP = {

  Weddings: [
    { value: 'Wedding Bid Boxes', label: 'Wedding Bid Boxes' },
    { value: 'Nikkah Nama & Pens', label: 'Nikkah Nama & Pens' },
    { value: 'Luxury Velvet Shadi Card Boxes', label: 'Luxury Velvet Shadi Card Boxes' },
    { value: 'Wedding Favor Bags & Pouches', label: 'Wedding Favor Bags & Pouches' },
    { value: 'Mithai & Sweet Gift Boxes', label: 'Mithai & Sweet Gift Boxes' },
    { value: 'Bridesmaid & Groomsmen Proposal Boxes', label: 'Bridesmaid & Groomsmen Proposal Boxes' },
  ],
  Boxes: [
    { value: 'Custom Rigid Gift Boxes', label: 'Custom Rigid Gift Boxes' },
    { value: 'Corrugated Mailer Boxes', label: 'Corrugated Mailer Boxes' },
    { value: 'Clear Window Pillow Boxes', label: 'Clear Window Pillow Boxes' },
    { value: 'Die-Cut Tuck Top Boxes', label: 'Die-Cut Tuck Top Boxes' },
    { value: 'Luxury Magnetic Closure Boxes', label: 'Luxury Magnetic Closure Boxes' },
    { value: 'Tin Metal Boxes', label: 'Tin Metal Boxes' },
  ],
  'Birth Announcement Boxes': [
    { value: 'Baby Announcement Boxes', label: 'Baby Announcement Boxes' },
    { value: 'New Born Welcome Cards & Badges', label: 'New Born Welcome Cards & Badges' },
    { value: 'Baby Milestone Cards & Props', label: 'Baby Milestone Cards & Props' },
    { value: 'Baby Shower Favors & Bags', label: 'Baby Shower Favors & Bags' },
    { value: 'Hospital Door Banners & Badges', label: 'Hospital Door Banners & Badges' },
    { value: 'Gender Reveal Confetti & Favors', label: 'Gender Reveal Confetti & Favors' },
  ],
}

/**
 * Get subcategory options based on selected parent category.
 */
export function getSubcategoryOptions(parentCategory) {
  if (!parentCategory) return []
  const norm = String(parentCategory).trim().toLowerCase()

  // Check explicit map first
  for (const [key, options] of Object.entries(PARENT_SUBCATEGORY_MAP)) {
    if (key.toLowerCase() === norm) {
      return options
    }
  }

  // Look up in SIDEBAR_CATEGORIES
  const found = SIDEBAR_CATEGORIES.find(
    (c) =>
      c.id.toLowerCase() === norm ||
      c.name.toLowerCase() === norm ||
      c.name.toLowerCase().includes(norm) ||
      norm.includes(c.name.toLowerCase())
  )

  if (found && Array.isArray(found.subcategories)) {
    return found.subcategories.map((sub) => {
      const name = typeof sub === 'string' ? sub : sub.name
      return { value: name, label: name }
    })
  }

  return []
}

/**
 * Normalize string for safe category comparison.
 */
export function normalizeCategory(str) {
  if (!str) return ''
  return String(str).trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ')
}

/**
 * Determines whether a given product matches the category filter.
 * Supports:
 * - Case-insensitive and normalized matching
 * - Backward compatibility with legacy products and slugs
 */
export function matchesCategoryFilter(product, filter) {
  if (!filter) return true
  const normFilter = normalizeCategory(filter)
  if (!normFilter || normFilter === 'all') return true

  const productCat = normalizeCategory(product?.category || '')
  const productParent = normalizeCategory(product?.parentCategory || '')
  const productSub = normalizeCategory(product?.subcategory || '')
  const productName = normalizeCategory(product?.name || '')


  // Weddings Parent Category
  if (normFilter === 'weddings' || normFilter === 'wedding') {
    return productCat.includes('wedding') || productParent.includes('wedding') || productCat === 'testing'
  }

  // Boxes Parent Category
  if (normFilter === 'boxes' || normFilter === 'box') {
    return productCat.includes('box') || productParent.includes('box') || productSub.includes('box') || productName.includes('box')
  }

  // Birth Announcement Boxes
  if (normFilter === 'birth announcement boxes' || normFilter === 'baby announcement boxes' || normFilter === 'birth-announcement' || normFilter === 'first-moments') {
    return productCat.includes('birth') || productCat.includes('baby') || productCat.includes('first-moments') || productParent.includes('birth') || productParent.includes('baby') || productSub.includes('baby') || productSub.includes('birth')
  }

  // 6. Direct Subcategory match
  if (productSub && (productSub === normFilter || normFilter.includes(productSub) || productSub.includes(normFilter))) {
    return true
  }

  // 7. Direct Category or ParentCategory match
  if (productCat === normFilter || productParent === normFilter) {
    return true
  }

  // 8. Support legacy slugs (e.g. slug "2" for Hajj & Umrah, "testing" for Weddings)
  if (productCat === '2' && (normFilter.includes('hajj') || normFilter.includes('umrah'))) {
    return true
  }
  if (productCat === 'testing' && normFilter.includes('wedding')) {
    return true
  }

  return false
}
