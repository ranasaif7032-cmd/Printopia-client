import { Button, Form, Input, Typography } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '@/components/Misc/ThemeToggle'

const { Title, Paragraph } = Typography
const { Item } = Form

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async () => {
    if (!window.isEmailVaild(email)) { window.toastify('Please enter a valid email', 'error'); return }
    setIsProcessing(true)
    try {
      setSent(true)
      window.toastify('Please contact admin to reset your password', 'info')
    } catch {
      window.toastify('Failed to send reset email', 'error')
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
            Reset <span style={{ color: '#0866F5' }}>Password</span>
          </Title>
          {!sent ? (
            <>
              <Paragraph className='text-center' style={{ color: 'var(--text-secondary)' }}>
                Enter your email address and our support team will help you recover your Printopia account.
              </Paragraph>
              <Form layout='vertical' className="mt-3">
                <Item label="Email" required>
                  <Input type="email" size='large' placeholder='Enter your account email' value={email} onChange={e => setEmail(e.target.value)} />
                </Item>
                <Button
                  type='primary'
                  size='large'
                  htmlType='submit'
                  block
                  loading={isProcessing}
                  onClick={handleReset}
                  style={{
                    background: '#0866F5',
                    borderColor: '#0866F5',
                    height: 46,
                    fontWeight: 700,
                    borderRadius: 8,
                    marginTop: 8,
                  }}
                >
                  Send Reset Link
                </Button>
              </Form>
            </>
          ) : (
            <Paragraph className='text-center' style={{ color: 'var(--text-secondary)' }}>
              Please contact admin to reset your password. <Link to="/auth/login" style={{ color: '#0866F5', fontWeight: 600 }}>Back to Login</Link>
            </Paragraph>
          )}
          <Paragraph className='text-center mt-3 mb-0'>
            <Link to="/auth/login" style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              ← Back to Login
            </Link>
          </Paragraph>
        </div>
      </div>
    </main>
  )
}

export default ForgotPassword
