import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Login.css'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!usernameOrEmail || !password) return

    setSubmitting(true)
    setError('')
    try {
      await login({ usernameOrEmail, password })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <h1 className="login-title">Log In</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">
          Username or Email
          <input
            type="text"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="jsmith or you@example.com"
            className="login-input"
          />
        </label>

        <label className="login-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            className="login-input"
          />
        </label>

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="login-btn" disabled={submitting}>
          {submitting ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p className="login-footer">
        <Link to="/forgot-password">Forgot your password?</Link>
      </p>
      <p className="login-footer">
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default Login
