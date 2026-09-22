import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEvents } from '../context/EventsContext'
import './MyEvents.css'

function MyEvents() {
  const { currentUser } = useAuth()
  const { events, loading, error } = useEvents()

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // Only show events this user organized
  const myEvents = events.filter((ev) => ev.organizerEmail === currentUser.email)

  return (
    <div className="my-events">
      <div className="my-events-header">
        <h1 className="my-events-title">My Events</h1>
        <Link to="/events/create" className="my-events-add-link">+ Add Event</Link>
      </div>

      {loading && <p className="my-events-empty">Loading events...</p>}
      {!loading && error && <p className="my-events-empty">Could not load events: {error}</p>}

      {!loading && !error && myEvents.length === 0 && (
        <p className="my-events-empty">You haven't created any events yet.</p>
      )}

      <div className="my-events-list">
        {myEvents.map((ev) => (
          <div key={ev.id} className="my-events-card">
            <img src={ev.image} alt={ev.name} className="my-events-card-img" />
            <div className="my-events-card-body">
              <div className="my-events-card-top">
                <h3 className="my-events-card-name">{ev.name}</h3>
                <span className="my-events-card-category">{ev.category}</span>
              </div>
              <div className="my-events-card-meta">
                <span><i className="fas fa-calendar"></i> {ev.date}</span>
                <span><i className="fas fa-map-marker-alt"></i> {ev.location}</span>
                <span><i className="fas fa-ticket-alt"></i> {ev.slotsBooked}/{ev.totalSlots} booked</span>
              </div>
              <div className="my-events-card-actions">
                <Link to={`/events/${ev.id}`} className="my-events-btn my-events-btn--secondary">
                  View
                </Link>
                <Link to={`/events/${ev.id}/edit`} className="my-events-btn my-events-btn--primary">
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyEvents
