import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

function Profile() {
  const { currentUser, updateProfile } = useAuth()
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '')
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!displayName) return

    setSubmitting(true)
    setError('')
    try {
      await updateProfile({ displayName })
      setEditing(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="profile">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-card">
        <div className="profile-avatar">
          {currentUser.displayName.charAt(0).toUpperCase()}
        </div>

        {editing ? (
          <form className="profile-form" onSubmit={handleSubmit}>
            <label className="profile-label">
              Display Name
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="profile-input"
              />
            </label>

            {error && <p className="profile-error">{error}</p>}

            <div className="profile-actions">
              <button type="submit" className="profile-btn profile-btn--primary" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                className="profile-btn profile-btn--secondary"
                onClick={() => { setEditing(false); setDisplayName(currentUser.displayName) }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <dl className="profile-details">
              <dt>Display Name</dt>
              <dd>{currentUser.displayName}</dd>

              <dt>Username</dt>
              <dd>{currentUser.username}</dd>

              <dt>Email</dt>
              <dd>{currentUser.email}</dd>
            </dl>

            <button className="profile-btn profile-btn--primary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Profile
