import { useState } from 'react'
import { Route, Routes, Link, useLocation } from "react-router-dom"
import { Button, Drawer, Layout, Menu, Avatar, Space } from "antd"
import {
  DashboardOutlined, ShoppingOutlined, ShoppingCartOutlined,
  AppstoreOutlined, LogoutOutlined, ShopOutlined, MenuOutlined,
  DollarOutlined, FileTextOutlined, StockOutlined, TeamOutlined,
  MessageOutlined, SafetyOutlined, TagOutlined
} from "@ant-design/icons"
import Home from "./Home"
import Products from "./Products"
import Orders from "./Orders"
import Categories from "./Categories"
import Sales from "./Sales"
import Bills from "./Bills"
import Stock from "./Stock"
import Users from "./Users"
import Chat from "./Chat"
import Offers from "./Offers"
import ProductRecycleBin from "./Products/RecycleBin"
import RecycleBin from "./RecycleBin"
import NoPage from "@/components/Misc/NoPage"
import { useAuth } from "@/context/Auth"
import { useTheme } from "@/context/Theme"
import ThemeToggle from "@/components/Misc/ThemeToggle"

const { Sider, Content, Header } = Layout

const Dashboard = () => {
  const { user, handleLogout } = useAuth()
  const { isDarkMode } = useTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const selectedKey = location.pathname === '/dashboard' || location.pathname === '/dashboard/'
    ? '/dashboard'
    : "/" + location.pathname.split("/").slice(1, 3).join("/")

  const getPageTitle = () => {
    switch (selectedKey) {
      case '/dashboard': return 'Dashboard Overview'
      case '/dashboard/products': return 'Product Catalog'
      case '/dashboard/recycle-bin': return 'Recycle Bin'
      case '/dashboard/stock': return 'Inventory & Stock'
      case '/dashboard/orders': return 'Customer Orders'
      case '/dashboard/sales': return 'Sales Analytics'
      case '/dashboard/bills': return 'Invoicing & Bills'
      case '/dashboard/offers':
      case '/dashboard/add-offer': return 'Add & Manage Offers'
      case '/dashboard/chat': return 'Customer Chat Support'
      case '/dashboard/categories': return 'Product Categories'
      case '/dashboard/users': return 'User Management'
      default: return 'Admin Console'
    }
  }

  const menuItems = [
    { key: "/dashboard", icon: <DashboardOutlined />, label: <Link to="/dashboard">Dashboard</Link> },
    { key: "/dashboard/products", icon: <ShoppingOutlined />, label: <Link to="/dashboard/products">Products</Link> },
    { key: "/dashboard/recycle-bin", icon: <SafetyOutlined />, label: <Link to="/dashboard/recycle-bin">Recycle Bin</Link> },
    { key: "/dashboard/stock", icon: <StockOutlined />, label: <Link to="/dashboard/stock">Stock</Link> },
    { key: "/dashboard/orders", icon: <ShoppingCartOutlined />, label: <Link to="/dashboard/orders">Orders</Link> },
    { key: "/dashboard/sales", icon: <DollarOutlined />, label: <Link to="/dashboard/sales">Sales Records</Link> },
    { key: "/dashboard/bills", icon: <FileTextOutlined />, label: <Link to="/dashboard/bills">Bill Records</Link> },
    { key: "/dashboard/offers", icon: <TagOutlined />, label: <Link to="/dashboard/offers">Offers (Add Offer)</Link> },
    { key: "/dashboard/chat", icon: <MessageOutlined />, label: <Link to="/dashboard/chat">Chat Support</Link> },
    { key: "/dashboard/categories", icon: <AppstoreOutlined />, label: <Link to="/dashboard/categories">Categories</Link> },
    { key: "/dashboard/users", icon: <TeamOutlined />, label: <Link to="/dashboard/users">Users</Link> },
    { type: "divider" },
    { key: "/", icon: <ShopOutlined />, label: <Link to="/">View Store</Link> },
    { key: "logout", icon: <LogoutOutlined />, label: <span onClick={handleLogout}>Logout</span> },
  ]

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      {/* Desktop Sider */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        trigger={null}
        width={250}
        style={{
          background: 'var(--bg-card)',
          borderRight: '1px solid var(--border-color)',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div className="sider-logo-container">
          <Link to="/" className="sider-brand-title">
            Printopia <span>Admin</span>
          </Link>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          <Menu
            theme={isDarkMode ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ background: 'transparent', borderRight: 'none' }}
          />
        </div>
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-divider)' }}>
          <div className="d-flex align-items-center justify-content-between">
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Theme Mode
            </span>
            <ThemeToggle variant="pill" />
          </div>
        </div>
      </Sider>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <span style={{ color: 'var(--text-heading)', fontWeight: 800 }}>
            Printopia <span style={{ color: '#0866F5' }}>Admin</span>
          </span>
        }
        placement="left"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        styles={{
          section: { background: 'var(--bg-card)' },
          header: { background: 'var(--bg-card)', borderBottom: '1px solid var(--border-divider)' },
          body: { padding: 0, background: 'var(--bg-card)' },
        }}
        size="default"
      >
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Theme</span>
          <ThemeToggle showLabel variant="pill" />
        </div>
        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={() => setMobileOpen(false)}
          style={{ background: 'transparent' }}
        />
      </Drawer>

      {/* Main Content Area */}
      <Layout style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
        {/* Sleek Top Navigation Bar for Dashboard */}
        <Header
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
            transition: 'background-color 0.3s ease, border-color 0.3s ease',
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: 18, color: '#0866F5' }} />}
              onClick={() => setMobileOpen(true)}
              className="d-lg-none"
              style={{ color: 'var(--text-primary)' }}
            />
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-heading)' }}>
              {getPageTitle()}
            </h2>
          </div>

          <Space size={16} align="center">
            {/* Theme Toggle Button */}
            <ThemeToggle showLabel variant="pill" />

            {/* Quick Link to Store */}
            <Link to="/" style={{ textDecoration: 'none' }} className="d-none d-sm-inline-block">
              <Button
                icon={<ShopOutlined style={{ color: '#0866F5' }} />}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                View Store
              </Button>
            </Link>

            {/* User Profile Info */}
            <div className="d-flex align-items-center gap-2">
              <Avatar
                src={user?.avatar || "https://admissions.comsats.edu.pk/content/images/icoperson.jpg"}
                size={34}
                style={{ border: '2px solid #0866F5' }}
              />
              <span className="d-none d-md-inline" style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.9rem' }}>
                {user?.fullName || 'Administrator'}
              </span>
            </div>
          </Space>
        </Header>

        {/* Dashboard Content */}
        <Content style={{ margin: 0, padding: 24, flex: 1, overflowY: 'auto', background: 'var(--bg-primary)' }}>
          <div className="dashboard">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/recycle-bin" element={<ProductRecycleBin />} />
              <Route path="/recycle-bin" element={<RecycleBin />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/bills" element={<Bills />} />
              <Route path="/offers" element={<Offers />} />
              <Route path="/add-offer" element={<Offers />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="*" element={<NoPage />} />
            </Routes>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default Dashboard
