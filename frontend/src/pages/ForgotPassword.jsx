import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../services/api'
import './ForgotPassword.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !newPassword) return
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await api.forgotPassword({ email, newPassword })
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="forgot-password">
      <h1 className="forgot-password-title">Forgot Password</h1>

      {success ? (
        <div className="forgot-password-success">
          <p>Your password has been reset. You can now log in with your new password.</p>
          <Link to="/login" className="forgot-password-btn">Go to Login</Link>
        </div>
      ) : (
        <>
          <p className="forgot-password-text">
            Enter your account email and choose a new password.
          </p>
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <label className="forgot-password-label">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="forgot-password-input"
              />
            </label>

            <label className="forgot-password-label">
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="forgot-password-input"
              />
            </label>

            <label className="forgot-password-label">
              Confirm New Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="forgot-password-input"
              />
            </label>

            {error && <p className="forgot-password-error">{error}</p>}

            <button type="submit" className="forgot-password-btn" disabled={submitting}>
              {submitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default ForgotPassword
