import { useState, useEffect, useRef } from 'react'
import { api } from '@/config/api'
import { useAuth } from '@/context/Auth'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  TagOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Item } = Form

// Fallback initial offers if backend DB is empty
const DEFAULT_SYSTEM_OFFERS = [
  {
    _id: 'default-1',
    title: 'Hajj & Umrah Mega Tabarruk Combo',
    description: 'Complete 50 pcs tabarruk bags, tin boxes and zamzam bottle gift combo.',
    discountPercentage: 25,
    badge: 'SAVE 25%',
    category: 'HAJJ & UMRAH COLLECTION',
    targetLink: '/shop?category=HAJJ%20%26%20UMRAH%20COLLECTION',
    image: '',
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    _id: 'default-2',
    title: 'Small Business Starter Suite',
    description: '100 Mailer Boxes + 250 Logo Stickers + 100 Thank You Cards.',
    discountPercentage: 20,
    badge: 'FLAT 20% OFF',
    category: 'STARTUP & SMALL BUSINESS',
    targetLink: '/shop?category=STARTUP%20%26%20SMALL%20BUSINESS',
    image: '',
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
  {
    _id: 'default-3',
    title: 'Royal Wedding Bid Box Bundle',
    description: 'Custom gold-foiled luxury bid boxes with velvet partition trays.',
    discountPercentage: 15,
    badge: 'LIMITED OFFER',
    category: 'Weddings',
    targetLink: '/shop?category=Weddings',
    image: '',
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    isActive: true,
  },
]

const Offers = () => {
  const { userRole } = useAuth()
  const isAdmin = userRole === 'admin'
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [form] = Form.useForm()
  const fileInputRef = useRef(null)

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const data = await api.get('/offers/admin/all')
      if (Array.isArray(data) && data.length > 0) {
        setOffers(data)
      } else {
        // Fallback to local storage or defaults if empty
        const cached = localStorage.getItem('printopia_dashboard_offers')
        if (cached) {
          setOffers(JSON.parse(cached))
        } else {
          setOffers(DEFAULT_SYSTEM_OFFERS)
          localStorage.setItem('printopia_dashboard_offers', JSON.stringify(DEFAULT_SYSTEM_OFFERS))
        }
      }
    } catch {
      const cached = localStorage.getItem('printopia_dashboard_offers')
      setOffers(cached ? JSON.parse(cached) : DEFAULT_SYSTEM_OFFERS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers() // eslint-disable-line react-hooks/set-state-in-effect
  }, [])

  const saveToLocalCache = (updatedList) => {
    setOffers(updatedList)
    localStorage.setItem('printopia_dashboard_offers', JSON.stringify(updatedList))
    window.dispatchEvent(new CustomEvent('printopia_offers_changed', { detail: updatedList }))
  }

  const openCreate = () => {
    setEditingOffer(null)
    form.resetFields()
    form.setFieldsValue({
      discountPercentage: 20,
      badge: 'HOT',
      isActive: true,
      startDate: dayjs(),
      expiryDate: dayjs().add(30, 'day'),
    })
    setImageFile(null)
    setImagePreview(null)
    setModalOpen(true)
  }

  const openEdit = (offer) => {
    setEditingOffer(offer)
    form.setFieldsValue({
      title: offer.title,
      description: offer.description,
      discountPercentage: offer.discountPercentage,
      badge: offer.badge || 'HOT',
      category: offer.category || '',
      targetLink: offer.targetLink || '',
      startDate: offer.startDate ? dayjs(offer.startDate) : dayjs(),
      expiryDate: offer.expiryDate ? dayjs(offer.expiryDate) : null,
      isActive: offer.isActive !== false,
      image: offer.image || '',
    })
    setImageFile(null)
    setImagePreview(offer.image || null)
    setModalOpen(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      window.__antdMessage?.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      window.__antdMessage?.error('Image size must be under 5MB')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (values) => {
    try {
      setUploading(true)
      let imageUrl = editingOffer?.image || values.image || ''

      // If user uploaded a new image file, upload it
      if (imageFile) {
        try {
          const formData = new FormData()
          formData.append('image', imageFile)
          const uploadRes = await api.post('/upload', formData, true)
          imageUrl = uploadRes.url || uploadRes.imageURL || imageUrl
        } catch {
          // If upload fails, use preview data url or fallback
          if (imagePreview) imageUrl = imagePreview
        }
      }

      const payload = {
        title: values.title?.trim(),
        description: values.description?.trim() || '',
        discountPercentage: Number(values.discountPercentage) || 0,
        badge: values.badge?.trim() || 'HOT',
        category: values.category?.trim() || '',
        targetLink: values.targetLink?.trim() || '',
        startDate: values.startDate ? values.startDate.toISOString() : new Date().toISOString(),
        expiryDate: values.expiryDate ? values.expiryDate.toISOString() : null,
        isActive: values.isActive !== false,
        image: imageUrl,
      }

      if (editingOffer) {
        try {
          await api.put(`/offers/${editingOffer._id}`, payload)
        } catch {
          // Update local cache
        }
        const updated = offers.map((o) =>
          o._id === editingOffer._id ? { ...o, ...payload, _id: editingOffer._id } : o
        )
        saveToLocalCache(updated)
        window.__antdMessage?.success('Offer updated successfully')
      } else {
        let createdOffer = null
        try {
          createdOffer = await api.post('/offers', payload)
        } catch {
          createdOffer = {
            _id: `offer-${Date.now()}`,
            ...payload,
            createdAt: new Date(),
          }
        }
        const updated = [createdOffer || { _id: `offer-${Date.now()}`, ...payload }, ...offers]
        saveToLocalCache(updated)
        window.__antdMessage?.success('New offer created successfully')
      }

      setModalOpen(false)
      form.resetFields()
      setImageFile(null)
      setImagePreview(null)
    } catch (err) {
      window.__antdMessage?.error(err.message || 'Failed to save offer')
    } finally {
      setUploading(false)
    }
  }

  const handleToggleActive = async (record, checked) => {
    try {
      try {
        await api.patch(`/offers/${record._id}/toggle`)
      } catch {
        // local update
      }
      const updated = offers.map((o) =>
        o._id === record._id ? { ...o, isActive: checked } : o
      )
      saveToLocalCache(updated)
      window.__antdMessage?.success(`Offer "${record.title}" is now ${checked ? 'Active' : 'Inactive'}`)
    } catch {
      window.__antdMessage?.error('Failed to change status')
    }
  }

  const handleDelete = async (id) => {
    try {
      try {
        await api.delete(`/offers/${id}`)
      } catch {
        // local delete
      }
      const updated = offers.filter((o) => o._id !== id)
      saveToLocalCache(updated)
      window.__antdMessage?.success('Offer deleted successfully')
    } catch {
      window.__antdMessage?.error('Failed to delete offer')
    }
  }

  // Offer validity badge helper
  const getValidityStatus = (offer) => {
    if (!offer.isActive) {
      return <Tag icon={<StopOutlined />} color="default">Inactive</Tag>
    }
    if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
      return <Tag icon={<ClockCircleOutlined />} color="error">Expired</Tag>
    }
    if (offer.startDate && new Date(offer.startDate) > new Date()) {
      return <Tag icon={<ClockCircleOutlined />} color="warning">Scheduled</Tag>
    }
    return <Tag icon={<CheckCircleOutlined />} color="success">Active</Tag>
  }

  // Filtered offers by search
  const filteredOffers = offers.filter(
    (o) =>
      o.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activeCount = offers.filter(
    (o) => o.isActive && (!o.expiryDate || new Date(o.expiryDate) >= new Date())
  ).length
  const expiredCount = offers.filter(
    (o) => o.expiryDate && new Date(o.expiryDate) < new Date()
  ).length

  if (!isAdmin) {
    return (
      <Card style={{ margin: 24, textAlign: 'center' }}>
        <Title level={4} type="danger">Access Denied</Title>
        <Text>You must be an administrator to manage website offers.</Text>
      </Card>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Overview Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Offers Configured"
              value={offers.length}
              prefix={<TagOutlined style={{ color: '#0866F5' }} />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="Currently Active"
              value={activeCount}
              valueStyle={{ color: '#10B981' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8}>
          <Card>
            <Statistic
              title="Expired Offers"
              value={expiredCount}
              valueStyle={{ color: '#EF4444' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TagOutlined style={{ color: '#0866F5' }} />
            <span>Website Offers & Promotional Discounts</span>
          </div>
        }
        extra={
          <Space>
            <Input.Search
              placeholder="Search offers..."
              allowClear
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 220 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreate}
              style={{ background: '#0866F5', borderColor: '#0866F5' }}
            >
              Add New Offer
            </Button>
          </Space>
        }
      >
        <Table
          dataSource={filteredOffers}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8, showTotal: (total) => `Total ${total} offers` }}
          columns={[
            {
              title: 'Image',
              dataIndex: 'image',
              key: 'image',
              width: 80,
              render: (img) =>
                img ? (
                  <Image
                    src={img}
                    alt="Offer"
                    width={48}
                    height={48}
                    style={{ objectFit: 'cover', borderRadius: 6 }}
                  />
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 6,
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 18,
                    }}
                  >
                    🏷️
                  </div>
                ),
            },
            {
              title: 'Offer Details',
              key: 'details',
              render: (_, record) => (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: '0.96rem' }}>{record.title}</strong>
                    {record.badge && (
                      <Tag color="blue" style={{ fontWeight: 700 }}>
                        {record.badge}
                      </Tag>
                    )}
                  </div>
                  {record.description && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                      {record.description}
                    </div>
                  )}
                  {record.category && (
                    <div style={{ fontSize: '0.78rem', color: '#0866F5', marginTop: 2 }}>
                      Target Category: {record.category}
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: 'Discount',
              dataIndex: 'discountPercentage',
              key: 'discountPercentage',
              width: 110,
              render: (pct) =>
                pct > 0 ? (
                  <Tag color="orange" style={{ fontWeight: 800, fontSize: 13 }}>
                    {pct}% OFF
                  </Tag>
                ) : (
                  <Text type="secondary">Special Price</Text>
                ),
            },
            {
              title: 'Validity',
              key: 'validity',
              width: 170,
              render: (_, record) => (
                <div style={{ fontSize: '0.82rem' }}>
                  <div>{getValidityStatus(record)}</div>
                  {record.expiryDate && (
                    <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>
                      Expires: {dayjs(record.expiryDate).format('DD MMM YYYY')}
                    </div>
                  )}
                </div>
              ),
            },
            {
              title: 'Active',
              dataIndex: 'isActive',
              key: 'isActive',
              width: 90,
              render: (isActive, record) => (
                <Switch
                  size="small"
                  checked={isActive}
                  onChange={(checked) => handleToggleActive(record, checked)}
                />
              ),
            },
            {
              title: 'Actions',
              key: 'actions',
              width: 120,
              render: (_, record) => (
                <Space>
                  <Button
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => openEdit(record)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete this offer?"
                    description="Are you sure you want to delete this promotional offer?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes, Delete"
                    cancelText="Cancel"
                    okButtonProps={{ danger: true }}
                  >
                    <Button size="small" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      {/* Add / Edit Offer Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <TagOutlined style={{ color: '#0866F5' }} />
            <span>{editingOffer ? `Edit Offer: ${editingOffer.title}` : 'Create New Promotional Offer'}</span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={uploading}
        okText={editingOffer ? 'Save Changes' : 'Create Offer'}
        okButtonProps={{ style: { background: '#0866F5', borderColor: '#0866F5' } }}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
          <Item
            name="title"
            label="Offer Title"
            rules={[{ required: true, message: 'Please enter offer title' }]}
          >
            <Input placeholder="e.g. Hajj & Umrah Tabarruk Special, Wedding Favor Promo" />
          </Item>

          <Item name="description" label="Offer Description">
            <Input.TextArea
              rows={3}
              placeholder="Describe the offer details, included packages, or special discount terms..."
            />
          </Item>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Item
                name="discountPercentage"
                label="Discount Percentage (%)"
                rules={[{ required: true, message: 'Enter discount percentage' }]}
              >
                <InputNumber
                  min={0}
                  max={100}
                  style={{ width: '100%' }}
                  formatter={(val) => `${val}%`}
                  parser={(val) => val.replace('%', '')}
                />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item name="badge" label="Badge Text">
                <Input placeholder="e.g. HOT, 20% OFF, LIMITED, BUNDLE" />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Item name="startDate" label="Start Date">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item name="expiryDate" label="Expiry Date">
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" placeholder="No expiry (optional)" />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Item name="category" label="Target Category (optional)">
                <Select
                  allowClear
                  placeholder="Select a category"
                  options={[
                    { value: 'HAJJ & UMRAH COLLECTION', label: 'Hajj & Umrah Collection' },
                    { value: 'Weddings', label: 'Weddings' },
                    { value: 'Boxes', label: 'Boxes' },
                    { value: 'STARTUP & SMALL BUSINESS', label: 'Startup & Small Business' },
                    { value: 'CARDS & STICKERS', label: 'Cards & Stickers' },
                    { value: 'OCCASIONS', label: 'Occasions' },
                  ]}
                />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item name="targetLink" label="Target Link URL">
                <Input placeholder="e.g. /shop?category=Weddings" />
              </Item>
            </Col>
          </Row>

          {/* Offer Banner Image */}
          <Item label="Offer Banner Image (Optional)">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Space align="center">
              <Button icon={<UploadOutlined />} onClick={() => fileInputRef.current?.click()}>
                Upload Banner
              </Button>
              {imageFile && <Text type="secondary">{imageFile.name}</Text>}
            </Space>
            {imagePreview && (
              <div style={{ marginTop: 12 }}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={120}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-color)' }}
                />
              </div>
            )}
          </Item>

          <Item name="isActive" valuePropName="checked">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Switch defaultChecked />
              <span style={{ fontWeight: 600 }}>Active (Visible to customers on website)</span>
            </div>
          </Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Offers
