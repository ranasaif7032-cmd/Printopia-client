import { Button, Form, Input, Typography } from 'antd'
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/Auth'
import { CameraOutlined } from '@ant-design/icons'
import ThemeToggle from '@/components/Misc/ThemeToggle'

const { Title, Paragraph } = Typography
const { Item } = Form

const initialState = { fullName: '', email: '', password: '', confirmPassword: '' }

const Register = () => {
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const navigate = useNavigate()
  const { handleRegister } = useAuth()
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      const url = URL.createObjectURL(file)
      setAvatarPreview(url)
    }
  }

  const handleRegisterSubmit = async () => {
    let { fullName, email, password, confirmPassword } = state
    fullName = fullName ? fullName.trim() : ''
    const cleanEmail = email ? email.trim().toLowerCase() : ''
    if (fullName.length < 3) { window.toastify('Full name must be at least 3 characters', 'error'); return }
    if (!cleanEmail || !window.isEmailValid(cleanEmail)) { window.toastify('Please enter a valid email address', 'error'); return }
    if (password.length < 6) { window.toastify('Password must be at least 6 characters', 'error'); return }
    if (password !== confirmPassword) { window.toastify('Passwords do not match', 'error'); return }

    setIsProcessing(true)
    try {
      await handleRegister(fullName, cleanEmail, password, avatarFile)
      window.toastify('Registration successful! Welcome to Printopia.', 'success')
      navigate('/')
    } catch (err) {
      window.toastify(err.message || 'Registration failed. Please try again.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <main className='auth'>
      <div className="container">
        <div className="card p-4 mx-auto shadow" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 20, right: 20 }}>
            <ThemeToggle variant="pill" />
          </div>
          <Title level={1} className='text-center mt-2'>
            Join <span style={{ color: '#0866F5' }}>Printopia</span>
          </Title>
          <Paragraph className='text-center' style={{ color: 'var(--text-secondary)' }}>
            Already have an account? <Link className='text-decoration-none' to="/auth/login" style={{ color: '#0866F5', fontWeight: 600 }}>Login</Link>
          </Paragraph>
          <Form layout='vertical' className="mt-3">
            <div className="text-center mb-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: 90, height: 90, borderRadius: '50%',
                  border: '2px dashed var(--border-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', overflow: 'hidden', margin: '0 auto',
                  background: avatarPreview ? 'transparent' : 'var(--bg-secondary)',
                }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <CameraOutlined style={{ fontSize: 28, color: '#0866F5' }} />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
              <Paragraph type="secondary" style={{ fontSize: 12, marginTop: 8, color: 'var(--text-secondary)' }}>
                Upload profile photo (optional)
              </Paragraph>
            </div>
            <Item label="Full Name" required>
              <Input size='large' placeholder='Enter your full name' name='fullName' onChange={handleChange} />
            </Item>
            <Item label="Email" required>
              <Input type="email" size='large' placeholder='Enter your email' name='email' onChange={handleChange} />
            </Item>
            <Item label="Password" required>
              <Input.Password size='large' placeholder='Enter password (min. 6 characters)' name='password' onChange={handleChange} />
            </Item>
            <Item label="Confirm Password" required>
              <Input.Password size='large' placeholder='Re-enter password' name='confirmPassword' onChange={handleChange} />
            </Item>
            <Button
              type='primary'
              size='large'
              htmlType='submit'
              block
              loading={isProcessing}
              onClick={handleRegisterSubmit}
              style={{
                background: '#0866F5',
                borderColor: '#0866F5',
                height: 46,
                fontWeight: 700,
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              Create Account
            </Button>
            <div className="text-center mt-3">
              <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                ← Return to Store
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </main>
  )
}

export default Register
