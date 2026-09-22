import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventsContext'
import * as api from '../services/api'
import './MyRSVPs.css'

const STATUS_OPTIONS = ['Attending', 'Maybe', 'Not Attending']

function MyRSVPs() {
  const { currentUser } = useAuth()
  const { events, updateRsvpStatus, cancelRsvp } = useEvents()

  const [rsvps, setRsvps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    if (!currentUser) return
    let cancelled = false

    async function loadRsvps() {
      try {
        const data = await api.fetchRsvpsByEmail(currentUser.email)
        if (!cancelled) setRsvps(data)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadRsvps()
    return () => {
      cancelled = true
    }
  }, [currentUser])

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  const handleStatusChange = async (rsvp, newDisplayStatus) => {
    const newStatus = api.toBackendStatus(newDisplayStatus)
    setSavingId(rsvp.id)
    setError('')
    try {
      await updateRsvpStatus(rsvp.eventId, rsvp.email, {
        firstName: rsvp.firstName,
        lastName: rsvp.lastName,
        email: rsvp.email,
        phone: rsvp.phone,
        status: newStatus,
      })
      setRsvps((prev) => prev.map((r) => (r.id === rsvp.id ? { ...r, status: newStatus } : r)))
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  const handleCancel = async (rsvp) => {
    setSavingId(rsvp.id)
    setError('')
    try {
      await cancelRsvp(rsvp.eventId, rsvp.email)
      setRsvps((prev) => prev.filter((r) => r.id !== rsvp.id))
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="my-rsvps">
      <h1 className="my-rsvps-title">My RSVPs</h1>

      {loading && <p className="my-rsvps-empty">Loading your RSVPs...</p>}
      {!loading && error && <p className="my-rsvps-error">{error}</p>}
      {!loading && !error && rsvps.length === 0 && (
        <p className="my-rsvps-empty">You haven't RSVP'd to any events yet.</p>
      )}

      <div className="my-rsvps-list">
        {rsvps.map((rsvp) => {
          const event = events.find((ev) => ev.id === rsvp.eventId)
          if (!event) return null

          const displayStatus = api.toDisplayStatus(rsvp.status)
          const isSaving = savingId === rsvp.id

          return (
            <div key={rsvp.id} className="my-rsvps-card">
              <img src={event.image} alt={event.name} className="my-rsvps-card-img" />
              <div className="my-rsvps-card-body">
                <div className="my-rsvps-card-top">
                  <Link to={`/events/${event.id}`} className="my-rsvps-card-name">
                    {event.name}
                  </Link>
                  <span className={`my-rsvps-status my-rsvps-status--${rsvp.status.toLowerCase()}`}>
                    {displayStatus}
                  </span>
                </div>

                <div className="my-rsvps-card-meta">
                  <span><i className="fas fa-calendar"></i> {event.date}</span>
                  <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                </div>

                <div className="my-rsvps-card-actions">
                  <label className="my-rsvps-select-label">
                    Response:
                    <select
                      className="my-rsvps-select"
                      value={displayStatus}
                      onChange={(e) => handleStatusChange(rsvp, e.target.value)}
                      disabled={isSaving}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="my-rsvps-btn my-rsvps-btn--danger"
                    onClick={() => handleCancel(rsvp)}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Cancel RSVP'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyRSVPs
