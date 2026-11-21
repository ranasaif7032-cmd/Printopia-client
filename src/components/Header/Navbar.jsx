import { useState } from 'react'
import { useAuth } from '@/context/Auth'
import { useCart } from '@/context/Cart'
import { Badge, Button, Space, Drawer, Avatar } from 'antd'
import { ShoppingCartOutlined, OrderedListOutlined, MenuOutlined, DashboardOutlined, LogoutOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from '@/components/Misc/ThemeToggle'

const Navbar = () => {
  const { isAuth, user, userRole, handleLogout } = useAuth()
  const { cartCount } = useCart()
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const userAvatar = user?.avatar ? (
    <Avatar src={user.avatar} size={32} style={{ cursor: 'pointer', border: '1px solid #0866F5' }} />
  ) : (
    <Avatar src="https://admissions.comsats.edu.pk/content/images/icoperson.jpg" size={32} style={{ cursor: 'pointer', border: '1px solid #0866F5' }} />
  )

  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        backgroundColor: 'var(--bg-header)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 0',
        position: 'relative',
        zIndex: 1020,
        transition: 'background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <div className="container">
        {/* Brand Logo with Electric Blue Highlight */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
          style={{ textDecoration: 'none' }}
        >
          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
            Printopia <span style={{ color: '#0866F5' }}>PK</span>
          </span>
        </Link>

        {/* Mobile Action Controls */}
        <div className="d-flex align-items-center gap-2 d-lg-none ms-auto me-2">
          <ThemeToggle variant="pill" />
          <Badge count={cartCount} showZero={false} offset={[-4, 4]}>
            <Button
              size="middle"
              icon={<ShoppingCartOutlined style={{ color: '#0866F5' }} />}
              onClick={() => navigate('/cart')}
              style={{
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                borderColor: 'var(--border-color)',
                fontWeight: 600,
                borderRadius: 8,
              }}
            />
          </Badge>
          <button
            className="btn p-1"
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Toggle navigation menu"
            style={{
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card)',
              borderRadius: 8,
              width: 38,
              height: 38,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MenuOutlined style={{ fontSize: 18, color: '#0866F5' }} />
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            {[
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/shop' },
              { name: 'About', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map((item) => {
              const active = isActive(item.path)
              return (
                <li className="nav-item" key={item.path}>
                  <Link
                    className="nav-link px-3"
                    to={item.path}
                    style={{
                      color: active ? '#0866F5' : 'var(--text-primary)',
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.94rem',
                      position: 'relative',
                      transition: 'color 0.2s ease',
                      borderRadius: 6,
                    }}
                  >
                    {item.name}
                    {active && (
                      <span
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 12,
                          right: 12,
                          height: 2,
                          backgroundColor: '#0866F5',
                          borderRadius: 2,
                        }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Desktop Actions */}
          <Space size={12} align="center">
            {/* Dark Mode / Light Mode Switcher */}
            <ThemeToggle variant="pill" />

            {/* Cart Button */}
            <Badge count={cartCount} showZero={false} offset={[-4, 4]}>
              <Button
                size="large"
                icon={<ShoppingCartOutlined style={{ color: '#0866F5', fontSize: 18 }} />}
                onClick={() => navigate('/cart')}
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontWeight: 600,
                  borderRadius: 8,
                  height: 40,
                }}
              >
                Cart
              </Button>
            </Badge>

            {/* Auth Buttons */}
            {isAuth ? (
              <>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: 8,
                  }}
                  onClick={() => userRole === 'admin' ? navigate('/dashboard') : navigate('/orders')}
                >
                  {userAvatar}
                  <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: '0.92rem' }}>
                    {user?.fullName || 'User'}
                  </span>
                </span>
                {userRole === 'admin' ? (
                  <Button
                    size="large"
                    icon={<DashboardOutlined style={{ color: '#0866F5' }} />}
                    onClick={() => navigate('/dashboard')}
                    style={{
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      fontWeight: 600,
                      borderRadius: 8,
                      height: 40,
                    }}
                  >
                    Dashboard
                  </Button>
                ) : (
                  <Button
                    icon={<OrderedListOutlined style={{ color: '#0866F5' }} />}
                    size="large"
                    onClick={() => navigate('/orders')}
                    style={{
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)',
                      fontWeight: 600,
                      borderRadius: 8,
                      height: 40,
                    }}
                  >
                    Orders
                  </Button>
                )}
                <Button
                  danger
                  size="large"
                  icon={<LogoutOutlined />}
                  onClick={handleLogout}
                  style={{
                    fontWeight: 600,
                    borderRadius: 8,
                    height: 40,
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="large"
                  onClick={() => navigate('/auth/login')}
                  style={{
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    fontWeight: 600,
                    borderRadius: 8,
                    height: 40,
                  }}
                >
                  Login
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => navigate('/auth/register')}
                  style={{
                    background: '#0866F5',
                    borderColor: '#0866F5',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    borderRadius: 8,
                    height: 40,
                    boxShadow: '0 2px 8px rgba(8, 102, 245, 0.4)',
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Space>
        </div>
      </div>

      {/* Mobile Slide Drawer */}
      <Drawer
        title={
          <span style={{ color: 'var(--text-heading)', fontWeight: 800, fontSize: '1.1rem' }}>
            Printopia <span style={{ color: '#0866F5' }}>Pakistan</span>
          </span>
        }
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        size="default"
        styles={{
          section: { background: 'var(--bg-card)' },
          header: { background: 'var(--bg-card)', borderBottom: '1px solid var(--border-divider)' },
          body: { background: 'var(--bg-card)', padding: '20px 16px' },
        }}
      >
        <div className="d-flex flex-column gap-3">
          {/* Theme Switcher inside Mobile Drawer */}
          <div
            className="p-3 d-flex align-items-center justify-content-between rounded-3"
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
          >
            <span style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Appearance</span>
            <ThemeToggle showLabel variant="pill" />
          </div>

          <ul className="navbar-nav flex-column gap-2 mt-2">
            {[
              { name: 'Home', path: '/' },
              { name: 'Shop', path: '/shop' },
              { name: 'About Us', path: '/about' },
              { name: 'Contact', path: '/contact' },
            ].map((item) => {
              const active = isActive(item.path)
              return (
                <li className="nav-item" key={item.path}>
                  <Link
                    className="nav-link py-2 px-3 rounded-2 fw-semibold"
                    style={{
                      color: active ? '#0866F5' : 'var(--text-primary)',
                      background: active ? 'rgba(8, 102, 245, 0.08)' : 'transparent',
                    }}
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="mt-3">
            <Button
              block
              size="large"
              icon={<ShoppingCartOutlined style={{ color: '#0866F5' }} />}
              onClick={() => { navigate('/cart'); setDrawerOpen(false); }}
              style={{
                border: '1px solid var(--border-color)',
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                fontWeight: 600,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              Cart ({cartCount || 0})
            </Button>
          </div>

          {isAuth ? (
            <div className="d-flex flex-column gap-2 mt-2 pt-2 border-top">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                {userAvatar}
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{user?.fullName || 'User'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email}</div>
                </div>
              </div>
              {userRole === 'admin' ? (
                <Button
                  block
                  icon={<DashboardOutlined style={{ color: '#0866F5' }} />}
                  onClick={() => { navigate('/dashboard'); setDrawerOpen(false); }}
                  style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 600, borderRadius: 8 }}
                >
                  Admin Dashboard
                </Button>
              ) : (
                <Button
                  block
                  icon={<OrderedListOutlined style={{ color: '#0866F5' }} />}
                  onClick={() => { navigate('/orders'); setDrawerOpen(false); }}
                  style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: 600, borderRadius: 8 }}
                >
                  My Orders
                </Button>
              )}
              <Button
                block
                danger
                onClick={handleLogout}
                style={{ fontWeight: 600, borderRadius: 8 }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2 mt-2 pt-2 border-top">
              <Button
                block
                size="large"
                onClick={() => { navigate('/auth/login'); setDrawerOpen(false); }}
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                Login
              </Button>
              <Button
                block
                type="primary"
                size="large"
                onClick={() => { navigate('/auth/register'); setDrawerOpen(false); }}
                style={{
                  background: '#0866F5',
                  borderColor: '#0866F5',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  borderRadius: 8,
                }}
              >
                Create Account
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </nav>
  )
}

export default Navbar
