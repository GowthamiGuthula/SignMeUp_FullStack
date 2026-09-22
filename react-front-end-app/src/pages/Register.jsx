import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Register.css'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !email || !password) return
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await register({ username, email, password, displayName })
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="register">
      <h1 className="register-title">Create an Account</h1>

      <form className="register-form" onSubmit={handleSubmit}>
        <label className="register-label">
          Username *
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. jsmith"
            className="register-input"
          />
        </label>

        <label className="register-label">
          Email *
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="register-input"
          />
        </label>

        <label className="register-label">
          Display Name
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="e.g. Jane Smith"
            className="register-input"
          />
        </label>

        <label className="register-label">
          Password *
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            className="register-input"
          />
        </label>

        <label className="register-label">
          Confirm Password *
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            className="register-input"
          />
        </label>

        {error && <p className="register-error">{error}</p>}

        <button type="submit" className="register-btn" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p className="register-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  )
}

export default Register
