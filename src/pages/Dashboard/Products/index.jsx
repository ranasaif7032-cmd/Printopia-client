import { useState, useEffect, useRef } from 'react'
import { api } from '@/config/api'
import {
  Button, Card, Col, Form, Image, Input, InputNumber, Modal, Row,
  Select, Space, Table, Tag, Typography, Popconfirm, Switch, Tooltip
} from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined,
  PictureOutlined, VideoCameraOutlined, PlayCircleOutlined,
  CloseCircleOutlined, EyeOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { formatCurrency } from '@/utils/format'
import { useAuth } from '@/context/Auth'
import { getSubcategoryOptions } from '@/utils/categoryHelper'

const { Title } = Typography
const { Item } = Form
const { TextArea } = Input

const Products = () => {
  const navigate = useNavigate()
  const { userRole } = useAuth()
  const isAdmin = userRole === 'admin'
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedParentCategory, setSelectedParentCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form] = Form.useForm()

  // Image 1 Upload States
  const [image1File, setImage1File] = useState(null)
  const [image1Preview, setImage1Preview] = useState(null)
  const [removeImage1, setRemoveImage1] = useState(false)
  const image1InputRef = useRef(null)
  const preview1UrlRef = useRef(null)

  // Image 2 Upload States
  const [image2File, setImage2File] = useState(null)
  const [image2Preview, setImage2Preview] = useState(null)
  const [removeImage2, setRemoveImage2] = useState(false)
  const image2InputRef = useRef(null)
  const preview2UrlRef = useRef(null)

  // Video Upload States
  const [videoFile, setVideoFile] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [removeVideo, setRemoveVideo] = useState(false)
  const videoInputRef = useRef(null)
  const videoPreviewUrlRef = useRef(null)

  // Table Video Player Modal
  const [tableVideoModalOpen, setTableVideoModalOpen] = useState(false)
  const [activeTableVideoUrl, setActiveTableVideoUrl] = useState(null)

  const [uploading, setUploading] = useState(false)

  const fetchData = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ])
      setProducts(Array.isArray(prodData) ? prodData : [])
      setCategories(Array.isArray(catData) ? catData : [])
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const resetMediaStates = () => {
    if (preview1UrlRef.current) {
      URL.revokeObjectURL(preview1UrlRef.current)
      preview1UrlRef.current = null
    }
    if (preview2UrlRef.current) {
      URL.revokeObjectURL(preview2UrlRef.current)
      preview2UrlRef.current = null
    }
    if (videoPreviewUrlRef.current) {
      URL.revokeObjectURL(videoPreviewUrlRef.current)
      videoPreviewUrlRef.current = null
    }
    setImage1File(null)
    setImage1Preview(null)
    setRemoveImage1(false)
    setImage2File(null)
    setImage2Preview(null)
    setRemoveImage2(false)
    setVideoFile(null)
    setVideoPreview(null)
    setRemoveVideo(false)
    if (image1InputRef.current) image1InputRef.current.value = ''
    if (image2InputRef.current) image2InputRef.current.value = ''
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const openCreate = () => {
    setEditingProduct(null)
    form.resetFields()
    form.setFieldValue('featured', false)
    setSelectedParentCategory(null)
    resetMediaStates()
    setModalOpen(true)
  }

  const openEdit = (product) => {
    setEditingProduct(product)
    const parentCat = product.parentCategory || product.category || ''
    setSelectedParentCategory(parentCat)
    form.setFieldsValue({
      ...product,
      category: parentCat,
      subcategory: product.subcategory || '',
      featured: product.featured || false,
    })
    resetMediaStates()
    const img1 = product.imageURL || product.images?.[0] || null
    const img2 = product.imageURL2 || product.images?.[1] || null
    setImage1Preview(img1)
    setImage2Preview(img2)
    setVideoPreview(product.videoURL || null)
    setModalOpen(true)
  }

  const handleImage1Select = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      window.toastify?.('Invalid image format. Supported formats: JPG, JPEG, PNG, WEBP.', 'error') || alert('Invalid image format.')
      e.target.value = ''
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      window.toastify?.('Image file size exceeds 15MB limit.', 'error') || alert('Image exceeds 15MB limit.')
      e.target.value = ''
      return
    }

    if (preview1UrlRef.current) {
      URL.revokeObjectURL(preview1UrlRef.current)
    }
    const url = URL.createObjectURL(file)
    preview1UrlRef.current = url
    setImage1File(file)
    setImage1Preview(url)
    setRemoveImage1(false)
  }

  const handleRemoveImage1 = () => {
    if (preview1UrlRef.current) {
      URL.revokeObjectURL(preview1UrlRef.current)
      preview1UrlRef.current = null
    }
    setImage1File(null)
    setImage1Preview(null)
    setRemoveImage1(true)
    if (image1InputRef.current) image1InputRef.current.value = ''
  }

  const handleImage2Select = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      window.toastify?.('Invalid image format. Supported formats: JPG, JPEG, PNG, WEBP.', 'error') || alert('Invalid image format.')
      e.target.value = ''
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      window.toastify?.('Image file size exceeds 15MB limit.', 'error') || alert('Image exceeds 15MB limit.')
      e.target.value = ''
      return
    }

    if (preview2UrlRef.current) {
      URL.revokeObjectURL(preview2UrlRef.current)
    }
    const url = URL.createObjectURL(file)
    preview2UrlRef.current = url
    setImage2File(file)
    setImage2Preview(url)
    setRemoveImage2(false)
  }

  const handleRemoveImage2 = () => {
    if (preview2UrlRef.current) {
      URL.revokeObjectURL(preview2UrlRef.current)
      preview2UrlRef.current = null
    }
    setImage2File(null)
    setImage2Preview(null)
    setRemoveImage2(true)
    if (image2InputRef.current) image2InputRef.current.value = ''
  }

  const handleVideoSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      window.toastify?.('Invalid video format. Supported formats: MP4, WEBM.', 'error') || alert('Invalid video format.')
      e.target.value = ''
      return
    }

    if (file.size > 100 * 1024 * 1024) {
      window.toastify?.('Video file size exceeds 100MB limit.', 'error') || alert('Video exceeds 100MB limit.')
      e.target.value = ''
      return
    }

    if (videoPreviewUrlRef.current) {
      URL.revokeObjectURL(videoPreviewUrlRef.current)
    }
    const url = URL.createObjectURL(file)
    videoPreviewUrlRef.current = url
    setVideoFile(file)
    setVideoPreview(url)
    setRemoveVideo(false)
  }

  const handleRemoveVideo = () => {
    if (videoPreviewUrlRef.current) {
      URL.revokeObjectURL(videoPreviewUrlRef.current)
      videoPreviewUrlRef.current = null
    }
    setVideoFile(null)
    setVideoPreview(null)
    setRemoveVideo(true)
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`)
      window.toastify?.('Product moved to Recycle Bin', 'success')
      fetchData()
    } catch (err) {
      window.toastify?.(err.message || 'Failed to delete', 'error')
    }
  }

  const handleRestore = async (id) => {
    try {
      await api.put(`/products/${id}/restore`)
      window.toastify?.('Product restored', 'success')
      fetchData()
    } catch (err) {
      window.toastify?.(err.message || 'Failed to restore', 'error')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setUploading(true)

      const formData = new FormData()
      formData.append('name', values.name)
      const catVal = values.category || ''
      formData.append('category', catVal)
      formData.append('parentCategory', catVal)
      if (values.subcategory) {
        formData.append('subcategory', values.subcategory)
      }
      formData.append('unit', values.unit || (catVal === 'groceries' ? 'KG' : 'pcs'))
      formData.append('price', Number(values.price))
      formData.append('costPrice', Number(values.costPrice || 0))
      formData.append('stock', Number(values.stock))
      formData.append('featured', values.featured || false)
      formData.append('description', values.description || '')

      // Handle Image 1 data
      if (image1File) {
        formData.append('image1', image1File)
      } else if (removeImage1) {
        formData.append('removeImage1', 'true')
      } else if (editingProduct && (editingProduct.imageURL || editingProduct.images?.[0])) {
        formData.append('imageURL', editingProduct.imageURL || editingProduct.images[0])
      }

      // Handle Image 2 data
      if (image2File) {
        formData.append('image2', image2File)
      } else if (removeImage2) {
        formData.append('removeImage2', 'true')
      } else if (editingProduct && (editingProduct.imageURL2 || editingProduct.images?.[1])) {
        formData.append('imageURL2', editingProduct.imageURL2 || editingProduct.images[1])
      }

      // Handle Video data
      if (videoFile) {
        formData.append('video', videoFile)
      } else if (removeVideo) {
        formData.append('removeVideo', 'true')
      } else if (editingProduct && editingProduct.videoURL) {
        formData.append('videoURL', editingProduct.videoURL)
      }

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData, true)
        window.toastify?.('Product updated successfully', 'success')
      } else {
        await api.post('/products', formData, true)
        window.toastify?.('Product created successfully', 'success')
      }

      setModalOpen(false)
      setSelectedParentCategory(null)
      resetMediaStates()
      fetchData()
    } catch (err) {
      window.toastify?.(err?.message || 'Failed to save product', 'error')
    } finally {
      setUploading(false)
    }
  }

  const columns = [
    {
      title: 'Media',
      key: 'media',
      render: (_, r) => {
        const img1 = r.imageURL || r.images?.[0]
        const img2 = r.imageURL2 || r.images?.[1]
        const hasVideo = Boolean(r.videoURL)
        return (
          <Space size={6} align="center">
            <Image.PreviewGroup>
              {img1 && (
                <Tooltip title="Image 1">
                  <Image
                    width={40}
                    height={40}
                    src={img1}
                    style={{ objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }}
                    fallback="https://placehold.co/40x40?text=Img1"
                  />
                </Tooltip>
              )}
              {img2 && (
                <Tooltip title="Image 2">
                  <Image
                    width={40}
                    height={40}
                    src={img2}
                    style={{ objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }}
                    fallback="https://placehold.co/40x40?text=Img2"
                  />
                </Tooltip>
              )}
            </Image.PreviewGroup>
            {!img1 && !img2 && (
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>No img</span>
            )}
            {hasVideo && (
              <Tooltip title="Preview Video">
                <Button
                  size="small"
                  type="primary"
                  ghost
                  icon={<PlayCircleOutlined />}
                  onClick={() => {
                    setActiveTableVideoUrl(r.videoURL)
                    setTableVideoModalOpen(true)
                  }}
                  style={{ borderRadius: 6, fontSize: 11, padding: '0 6px' }}
                >
                  Video
                </Button>
              </Tooltip>
            )}
          </Space>
        )
      },
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (v, r) => (
        <Space size={4} wrap>
          <Tag color="blue">{v || r.parentCategory || '-'}</Tag>
          {r.subcategory && <Tag color="cyan">{r.subcategory}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Sale Price',
      dataIndex: 'price',
      key: 'price',
      render: (v, r) => `Rs ${formatCurrency(v)} / ${r.unit || 'pcs'}`
    },
    {
      title: 'Cost Price',
      dataIndex: 'costPrice',
      key: 'costPrice',
      render: (v) => v ? `Rs ${formatCurrency(v)}` : '-',
    },
    {
      title: 'Profit',
      key: 'profit',
      render: (_, r) => {
        const profit = (r.price || 0) - (r.costPrice || 0)
        const margin = r.price > 0 ? ((profit / r.price) * 100).toFixed(1) : 0
        return profit > 0
          ? <span style={{ color: '#2a9d8f', fontWeight: 600 }}>Rs {formatCurrency(profit)} ({margin}%)</span>
          : <span style={{ color: '#e63946', fontWeight: 600 }}>Rs {formatCurrency(profit)}</span>
      },
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (v) => v ?? '-',
    },
    {
      title: 'Featured',
      dataIndex: 'featured',
      key: 'featured',
      render: (v) => <Tag color={v ? 'gold' : 'default'}>{v ? '⭐ Yes' : 'No'}</Tag>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        if (!isAdmin) return null
        if (record.isDeleted) {
          return (
            <Space>
              <Popconfirm title="Restore this product?" onConfirm={() => handleRestore(record._id)}>
                <Button icon={<ReloadOutlined />} type="primary">Restore</Button>
              </Popconfirm>
            </Space>
          )
        }
        return (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
            <Popconfirm title="Move to Recycle Bin?" onConfirm={() => handleDelete(record._id)}>
              <Button icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const categoryOptions = [
    { value: 'Hajj & Umrah', label: 'Hajj & Umrah' },
    ...categories
      .filter((c) => c.name?.toLowerCase() !== 'hajj & umrah')
      .map((c) => ({ value: c.name, label: c.name })),
  ]

  const subOptions = getSubcategoryOptions(selectedParentCategory)

  return (
    <>
      <Row justify="space-between" align="middle" className="mb-3">
        <Col><Title level={3}>Products</Title></Col>
        <Col>
          <Space>
            {isAdmin && <Button icon={<ReloadOutlined />} onClick={() => navigate('/dashboard/recycle-bin')}>Recycle Bin</Button>}
            {isAdmin && <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add Product</Button>}
          </Space>
        </Col>
      </Row>

      <Card>
        <Table
          dataSource={products}
          columns={columns}
          rowKey="_id"
          loading={loading}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      {/* Table Video Preview Modal */}
      <Modal
        title="Product Video Preview"
        open={tableVideoModalOpen}
        onCancel={() => {
          setTableVideoModalOpen(false)
          setActiveTableVideoUrl(null)
        }}
        footer={[
          <Button key="close" onClick={() => { setTableVideoModalOpen(false); setActiveTableVideoUrl(null) }}>
            Close
          </Button>
        ]}
        width={640}
        destroyOnHidden
      >
        {activeTableVideoUrl && (
          <div style={{ borderRadius: 8, overflow: 'hidden', background: '#000', display: 'flex', justifyContent: 'center' }}>
            <video
              src={activeTableVideoUrl}
              controls
              playsInline
              preload="metadata"
              style={{ width: '100%', maxHeight: 420, outline: 'none' }}
            />
          </div>
        )}
      </Modal>

      {/* Add / Edit Product Modal */}
      <Modal
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false)
          resetMediaStates()
          setSelectedParentCategory(null)
        }}
        confirmLoading={uploading}
        okText={uploading ? 'Uploading & Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
        width={Math.min(760, window.innerWidth - 32)}
        style={{ maxWidth: 'calc(100vw - 32px)' }}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Item label="Product Name" name="name" rules={[{ required: true, message: 'Please enter product name' }]}>
                <Input placeholder="e.g. Hajj & Umrah Tabarruk Box" />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item label="Parent Category" name="category" rules={[{ required: true, message: 'Please select parent category' }]}>
                <Select
                  options={categoryOptions}
                  placeholder="Select parent category"
                  showSearch
                  optionFilterProp="label"
                  onChange={(val) => {
                    setSelectedParentCategory(val)
                    form.setFieldValue('subcategory', undefined)
                    if (!editingProduct) form.setFieldValue('unit', val === 'groceries' ? 'KG' : 'pcs')
                  }}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Item label="Subcategory" name="subcategory">
                <Select
                  options={subOptions}
                  placeholder={subOptions.length > 0 ? "Select subcategory (e.g. Bags, Cards, Bottles)" : "Select parent category first"}
                  showSearch
                  allowClear
                  optionFilterProp="label"
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Item label="Sale Price" name="price" rules={[{ required: true, message: 'Please enter sale price' }]}>
                <InputNumber min={0} step={0.01} precision={2} prefix="Rs" style={{ width: '100%' }} />
              </Item>
            </Col>
            <Col xs={24} sm={8}>
              <Item label="Cost Price" name="costPrice" rules={[{ required: true, message: 'Please enter cost price' }]}>
                <InputNumber min={0} step={0.01} precision={2} prefix="Rs" style={{ width: '100%' }} />
              </Item>
            </Col>
            <Col xs={24} sm={8}>
              <Item label="Unit" name="unit">
                <Select
                  options={[
                    { value: 'pcs', label: 'pcs' },
                    { value: 'KG', label: 'KG' },
                    { value: 'L', label: 'L' },
                    { value: 'dozen', label: 'dozen' },
                    { value: 'pack', label: 'pack' },
                  ]}
                />
              </Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Item label="Stock" name="stock" rules={[{ required: true, message: 'Please enter stock quantity' }]}>
                <InputNumber min={0} step={1} precision={0} style={{ width: '100%' }} />
              </Item>
            </Col>
            <Col xs={24} sm={8}>
              <Item label="Featured Product" name="featured" valuePropName="checked">
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Item>
            </Col>
          </Row>

          <Item label="Description" name="description">
            <TextArea rows={3} placeholder="Enter detailed product description, specifications, and dimensions..." />
          </Item>

          {/* Media Upload Fields (2 Images + 1 Video) */}
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Title level={5} style={{ margin: 0, fontSize: '0.95rem' }}>
                Product Media <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>(Up to 2 Images + 1 Video)</span>
              </Title>
            </div>
            <Row gutter={[16, 16]}>
              {/* Image 1 Upload Field */}
              <Col xs={24} sm={12} md={8}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    Image 1 (Primary) <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>JPG, PNG</span>
                  </label>
                  <input
                    ref={image1InputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleImage1Select}
                    style={{ display: 'none' }}
                  />

                  {image1Preview ? (
                    <div style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 10,
                      padding: 10,
                      background: 'var(--bg-secondary)',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 125, maxHeight: 135, overflow: 'hidden' }}>
                        <Image
                          src={image1Preview}
                          alt="Image 1 Preview"
                          style={{ maxHeight: 125, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 }}
                        />
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <Button size="small" icon={<PictureOutlined />} onClick={() => image1InputRef.current?.click()}>
                          Replace
                        </Button>
                        <Button size="small" danger icon={<CloseCircleOutlined />} onClick={handleRemoveImage1}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => image1InputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--border-color)',
                        borderRadius: 10,
                        padding: '24px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'var(--bg-secondary)',
                        transition: 'all 0.2s ease',
                        minHeight: 165,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0866F5' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)' }}
                    >
                      <PictureOutlined style={{ fontSize: 26, color: '#0866F5', marginBottom: 6 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                        Select Image 1
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Up to 15MB
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              {/* Image 2 Upload Field */}
              <Col xs={24} sm={12} md={8}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    Image 2 (Secondary) <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>JPG, PNG</span>
                  </label>
                  <input
                    ref={image2InputRef}
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={handleImage2Select}
                    style={{ display: 'none' }}
                  />

                  {image2Preview ? (
                    <div style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 10,
                      padding: 10,
                      background: 'var(--bg-secondary)',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 125, maxHeight: 135, overflow: 'hidden' }}>
                        <Image
                          src={image2Preview}
                          alt="Image 2 Preview"
                          style={{ maxHeight: 125, maxWidth: '100%', objectFit: 'contain', borderRadius: 6 }}
                        />
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <Button size="small" icon={<PictureOutlined />} onClick={() => image2InputRef.current?.click()}>
                          Replace
                        </Button>
                        <Button size="small" danger icon={<CloseCircleOutlined />} onClick={handleRemoveImage2}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => image2InputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--border-color)',
                        borderRadius: 10,
                        padding: '24px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'var(--bg-secondary)',
                        transition: 'all 0.2s ease',
                        minHeight: 165,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0866F5' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)' }}
                    >
                      <PictureOutlined style={{ fontSize: 26, color: '#0866F5', marginBottom: 6 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                        Select Image 2
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Up to 15MB (Optional)
                      </div>
                    </div>
                  )}
                </div>
              </Col>

              {/* Video Upload Field */}
              <Col xs={24} sm={24} md={8}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: 6, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                    Product Video <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>MP4, WEBM</span>
                  </label>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept=".mp4,.webm,video/mp4,video/webm"
                    onChange={handleVideoSelect}
                    style={{ display: 'none' }}
                  />

                  {videoPreview ? (
                    <div style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 10,
                      padding: 10,
                      background: 'var(--bg-secondary)',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 125, maxHeight: 135, overflow: 'hidden', background: '#000', borderRadius: 6 }}>
                        <video
                          src={videoPreview}
                          controls
                          playsInline
                          preload="metadata"
                          style={{ maxHeight: 125, width: '100%', outline: 'none' }}
                        />
                      </div>
                      <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <Button size="small" icon={<VideoCameraOutlined />} onClick={() => videoInputRef.current?.click()}>
                          Replace
                        </Button>
                        <Button size="small" danger icon={<CloseCircleOutlined />} onClick={handleRemoveVideo}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => videoInputRef.current?.click()}
                      style={{
                        border: '2px dashed var(--border-color)',
                        borderRadius: 10,
                        padding: '24px 8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: 'var(--bg-secondary)',
                        transition: 'all 0.2s ease',
                        minHeight: 165,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0866F5' }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)' }}
                    >
                      <VideoCameraOutlined style={{ fontSize: 26, color: '#0866F5', marginBottom: 6 }} />
                      <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                        Select Video
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Up to 100MB (Optional)
                      </div>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default Products
