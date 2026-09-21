import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAttendees } from '../utils/useAttendees'
import { formatAttendeeName, getAttendeeAvatarLetter } from '../utils/attendeeHelpers'
import RSVPForm from '../components/RSVPForm'
import './EventDetail.css'


function EventDetail() {
  // Get event ID from URL parameters
  const { id } = useParams()

  // Use custom hook for attendee management
  const {
    event,
    findDuplicateAttendee,
    isAlreadyAttending,
    rsvpToEvent,
    cancelRsvp,
    slotsLeft
  } = useAttendees(Number(id))

  // Consolidated state management using single object
  const [rsvpForm, setRsvpForm] = useState({
    // Form fields
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rsvp: '',
    
    // State flags
    hasRsvped: false,
    
    // Saved user information
    savedUserInfo: {
      firstName: '',
      lastName: '',
      email: '',
      fullName: ''
    },
    
    // Validation errors
    errors: {},
    
    // Duplicate handling
    existingAttendee: null
  })

  const handleInputChange = (field, value) => {
    setRsvpForm(prev => ({
      ...prev,
      [field]: value,
      // Clear validation errors for this field
      errors: {
        ...prev.errors,
        [field]: '',
        contact: field === 'email' || field === 'phone' ? '' : prev.errors.contact
      }
    }))
  }

  // If event not found, show a message
  if (!event) {
    return (
      <div className="detail">
        <p className="detail-empty">Event not found.</p>
        <Link to="/events">Back to Events</Link>
      </div>
    )
  }

  // Calculate event metadata
  const isPast = new Date(event.date) < new Date(new Date().toDateString())
  const fullName = `${rsvpForm.firstName} ${rsvpForm.lastName}`.trim()
  
  // Use custom hook for duplicate checking
  const alreadyAttending = isAlreadyAttending(rsvpForm.savedUserInfo)

  const handleRSVPFormSubmit = async (formData) => {
    // Check for duplicate attendee only for "Attending" RSVP
    if (formData.rsvp === 'Attending') {
      const existing = findDuplicateAttendee(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone
      )

      if (existing) {
        setRsvpForm(prev => ({
          ...prev,
          existingAttendee: existing,
          errors: { duplicate: 'Participant already in the list' }
        }))
        return
      }
    }

    // Create user info object
    const userInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone
    }

    // Process RSVP if attending and not already registered
    if (formData.rsvp === 'Attending' && !alreadyAttending) {
      try {
        await rsvpToEvent(event.id, userInfo)
      } catch (err) {
        setRsvpForm(prev => ({
          ...prev,
          errors: { duplicate: err.message }
        }))
        return
      }
    }

    // Save user information and update state
    setRsvpForm(prev => ({
      ...prev,
      savedUserInfo: {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        fullName: `${userInfo.firstName} ${userInfo.lastName}`
      },
      hasRsvped: true,
      rsvp: formData.rsvp
    }))
  }

  const handleCancel = async () => {
    if (alreadyAttending && rsvpForm.savedUserInfo.email) {
      await cancelRsvp(event.id, rsvpForm.savedUserInfo.email)
    }

    // Reset form state
    setRsvpForm(prev => ({
      ...prev,
      rsvp: '',
      hasRsvped: false,
      savedUserInfo: { firstName: '', lastName: '', email: '', fullName: '' }
    }))
  }

  const handleEdit = async () => {
    if (alreadyAttending && rsvpForm.savedUserInfo.email) {
      await cancelRsvp(event.id, rsvpForm.savedUserInfo.email)
    }

    // Reset to form state
    setRsvpForm(prev => ({
      ...prev,
      hasRsvped: false,
      savedUserInfo: { firstName: '', lastName: '', email: '', fullName: '' }
    }))
  }

  const handleCancelExisting = async () => {
    if (rsvpForm.existingAttendee?.email) {
      await cancelRsvp(event.id, rsvpForm.existingAttendee.email)
    }

    // Reset form completely
    setRsvpForm(prev => ({
      ...prev,
      rsvp: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      errors: {},
      existingAttendee: null
    }))
  }

  const handleEditExisting = async () => {
    if (rsvpForm.existingAttendee) {
      const existing = rsvpForm.existingAttendee

      // Remove existing attendee first
      if (existing.email) {
        await cancelRsvp(event.id, existing.email)
      }

      // Populate form with existing data
      setRsvpForm(prev => ({
        ...prev,
        firstName: existing.firstName || '',
        lastName: existing.lastName || '',
        email: existing.email || '',
        phone: existing.phone || '',
        rsvp: 'Attending',
        errors: {},
        existingAttendee: null
      }))
    }
  }

  return (
    <div className="detail">
      <Link to="/events" className="detail-back">&larr; Back to Events</Link>

      {/* Event image */}
      <img src={event.image} alt={event.name} className="detail-image" />

      {/* Event info card */}
      <div className="detail-card">
        <div className="detail-header">
          <h1 className="detail-title">{event.name}</h1>
          <span className="detail-category">{event.category}</span>
        </div>

        <div className="detail-info">
          {/* <p>📅 <strong>Date:</strong> {event.date}</p>
          <p>🕐 <strong>Time:</strong> {event.time}</p>
          <p>📍 <strong>Location:</strong> {event.location}</p>
          <p>🎟️ <strong>Slots:</strong> {slotsLeft} of {event.totalSlots} available</p> */}

          <span><i className="fas fa-calendar"></i> {event.date}</span>
          <span><i className="fas fa-clock"></i> {event.time}</span>
          <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
          <span><i className="fas fa-ticket-alt"></i> {slotsLeft} of {event.totalSlots} available</span>
        </div>

        {/* Slots progress bar */}
        <div className="detail-slots-bar">
          <div
            className="detail-slots-fill"
            style={{ width: `${(event.slotsBooked / event.totalSlots) * 100}%` }}
          />
        </div>

        <h2 className="detail-section-title">About this Event</h2>
        <p className="detail-desc">{event.description}</p>
      </div>

      {/* RSVP section */}
      <div className="detail-card">
        <h2 className="detail-section-title">RSVP</h2>

        {isPast ? (
          <p className="detail-muted">This event has ended. RSVP is closed.</p>
        ) : rsvpForm.hasRsvped ? (
          // Submitted state - show RSVP done with edit/cancel options
          <div className="detail-rsvp-submitted">
            <div className="detail-rsvp-success">
              <span className="detail-rsvp-status">RSVP Done</span>
              <span className="detail-rsvp-response">Your response: <strong>{rsvpForm.rsvp}</strong></span>
            </div>
            <div className="detail-rsvp-user-info">
              <p><strong>{rsvpForm.savedUserInfo.fullName}</strong></p>
              <p className="detail-rsvp-contact">{rsvpForm.savedUserInfo.email || rsvpForm.savedUserInfo.phone}</p>
            </div>
            <div className="detail-rsvp-actions">
              <button className="btn btn--secondary" onClick={handleEdit}>Edit RSVP</button>
              <button className="btn btn--danger" onClick={handleCancel}>Cancel RSVP</button>
            </div>
          </div>
        ) : (
          // Form state - use RSVPForm component
          <div>
            {rsvpForm.errors.duplicate && (
              <div className="detail-rsvp-duplicate">
                <button 
                  className="detail-rsvp-duplicate-close"
                  onClick={() => setRsvpForm(prev => ({ ...prev, errors: { ...prev.errors, duplicate: '' } }))}
                  aria-label="Close notification"
                >
                  ×
                </button>
                <span className="detail-rsvp-error">{rsvpForm.errors.duplicate}</span>
                {rsvpForm.existingAttendee && (
                  <div className="detail-rsvp-duplicate-actions">
                    <p className="detail-rsvp-duplicate-info">
                      {formatAttendeeName(rsvpForm.existingAttendee)}
                      {rsvpForm.existingAttendee.email && ` (${rsvpForm.existingAttendee.email})`}
                    </p>
                    <div className="detail-rsvp-duplicate-buttons">
                      <button 
                        className="btn btn--secondary btn--small"
                        onClick={handleEditExisting}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn--danger btn--small"
                        onClick={handleCancelExisting}
                      >
                        Cancel RSVP
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <RSVPForm
              onSubmit={handleRSVPFormSubmit}
              initialValues={rsvpForm}
              errors={rsvpForm.errors}
            />
          </div>
        )}
      </div>

      {/* Attendees section */}
      <div className="detail-card">
        <h2 className="detail-section-title">
          Attendees ({event.attendees.length})
        </h2>
        <ul className="detail-attendees">
          {event.attendees.map((attendee, i) => {
            // Use shared utilities for consistent formatting
            const displayName = formatAttendeeName(attendee)
            const avatarLetter = getAttendeeAvatarLetter(attendee)
            
            return (
              <li key={i} className="detail-attendee">
                <span className="detail-attendee-avatar">{avatarLetter}</span>
                {displayName}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default EventDetail
