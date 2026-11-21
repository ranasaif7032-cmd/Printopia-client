import { Button, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/Auth'
import ThemeToggle from '@/components/Misc/ThemeToggle'

const { Title, Paragraph } = Typography
const { Item } = Form

const initialState = { email: '', password: '' }

const Login = () => {
  const [state, setState] = useState(initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate()
  const { handleLogin } = useAuth()

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = async () => {
    const { email, password } = state
    const cleanEmail = email?.trim().toLowerCase()
    if (!cleanEmail) { window.toastify('Please enter your email', 'error'); return }
    if (!password) { window.toastify('Please enter your password', 'error'); return }

    setIsProcessing(true)
    try {
      await handleLogin(cleanEmail, password)
      window.toastify('Login successful', 'success')
      navigate('/')
    } catch (err) {
      window.toastify(err.message || 'Login failed. Please try again.', 'error')
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
            Login to <span style={{ color: '#0866F5' }}>Printopia</span>
          </Title>
          <Paragraph className='text-center' style={{ color: 'var(--text-secondary)' }}>
            Don't have an account? <Link className='text-decoration-none' to="/auth/register" style={{ color: '#0866F5', fontWeight: 600 }}>Register</Link>
          </Paragraph>
          <Form layout='vertical' className="mt-3">
            <Item label="Email" required>
              <Input type="email" size='large' placeholder='Enter your email' name='email' onChange={handleChange} />
            </Item>
            <Item label="Password" required>
              <Input.Password size='large' placeholder='Enter your password' name='password' onChange={handleChange} />
            </Item>
            <Button
              type='primary'
              size='large'
              htmlType='submit'
              block
              loading={isProcessing}
              onClick={handleLoginSubmit}
              style={{
                background: '#0866F5',
                borderColor: '#0866F5',
                height: 46,
                fontWeight: 700,
                borderRadius: 8,
                marginTop: 8,
              }}
            >
              Sign In
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

export default Login
