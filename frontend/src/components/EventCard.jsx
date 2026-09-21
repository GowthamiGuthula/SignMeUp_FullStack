import { Link } from 'react-router-dom'
import { formatAttendeeName } from '../utils/attendeeHelpers'
import './EventCard.css'

function EventCard({ event, isPast }) {
  const slotsLeft = event.totalSlots - event.slotsBooked
  
  const displayAttendees = event.attendees.slice(0, 3).map(formatAttendeeName)
  const hasMoreAttendees = event.attendees.length > 3

  return (
    <Link to={`/events/${event.id}`} className={`event-card ${isPast ? 'event-card--past' : ''}`}>
      <img src={event.image} alt={event.name} className="event-card-img" />
      <div className="event-card-body">
        <div className="event-card-top">
          <h3 className="event-card-name">{event.name}</h3>
          <span className="event-card-category">{event.category}</span>
        </div>
        <p className="event-card-desc">{event.description}</p>
        <div className="event-card-meta">
          <span><i className="fas fa-calendar"></i> {event.date}</span>
          <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
          <span><i className="fas fa-ticket-alt"></i> {slotsLeft} slots left</span>
        </div>
        {event.attendees.length > 0 && (
          <div className="event-card-attendees">
            <span className="event-card-attendees-label">Attendees:</span>
            <div className="event-card-attendees-list">
              {displayAttendees.map((name, i) => (
                <span key={i} className="event-card-attendee-name">{name}</span>
              ))}
              {hasMoreAttendees && (
                <span className="event-card-attendees-more">+{event.attendees.length - 3} more</span>
              )}
            </div>
          </div>
        )}
        {isPast && <span className="event-card-past-label">Event Ended</span>}
      </div>
    </Link>
  )
}

export default EventCard
