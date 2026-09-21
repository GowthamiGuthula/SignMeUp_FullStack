import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../context/EventsContext'
import './AddEvent.css'

function AddEvent() {
  const { addEvent } = useEvents()
  const navigate = useNavigate()

  // useState for each form field
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [category, setCategory] = useState('Workshop')
  const [totalSlots, setTotalSlots] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [organizerEmail, setOrganizerEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !date || !time || !location || !totalSlots || !description || !organizerEmail) return

    setSubmitting(true)
    setSubmitError('')
    try {
      await addEvent({
        name,
        date,
        time,
        location,
        category,
        totalSlots: Number(totalSlots),
        description,
        image: image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=350&fit=crop',
        organizerEmail,
      })
      navigate('/events')
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="add-event">
      <h1 className="add-event-title">Add New Event</h1>

      <form className="add-event-form" onSubmit={handleSubmit}>
        <label className="add-event-label">
          Event Name *
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. React Workshop"
            className="add-event-input"
          />
        </label>

        <div className="add-event-row">
          <label className="add-event-label">
            Date *
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="add-event-input"
            />
          </label>
          <label className="add-event-label">
            Time *
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 10:00 AM - 4:00 PM"
              className="add-event-input"
            />
          </label>
        </div>

        <label className="add-event-label">
          Location *
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Room 101, Tech Campus"
            className="add-event-input"
          />
        </label>

        <div className="add-event-row">
          <label className="add-event-label">
            Category
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="add-event-input"
            >
              <option value="Workshop">Workshop</option>
              <option value="Social">Social</option>
              <option value="Competition">Competition</option>
              <option value="Meetup">Meetup</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label className="add-event-label">
            Total Slots *
            <input
              type="number"
              min="1"
              value={totalSlots}
              onChange={(e) => setTotalSlots(e.target.value)}
              placeholder="e.g. 40"
              className="add-event-input"
            />
          </label>
        </div>

        <label className="add-event-label">
          Description *
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your event..."
            rows={4}
            className="add-event-input"
          />
        </label>

        <label className="add-event-label">
          Image URL (optional)
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="add-event-input"
          />
        </label>

        <label className="add-event-label">
          Your Email (organizer) *
          <input
            type="email"
            value={organizerEmail}
            onChange={(e) => setOrganizerEmail(e.target.value)}
            placeholder="you@example.com"
            className="add-event-input"
          />
        </label>

        {submitError && <p className="add-event-error">{submitError}</p>}

        <div className="add-event-actions">
          <button type="submit" className="add-event-btn add-event-btn--primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Event'}
          </button>
          <button type="button" className="add-event-btn add-event-btn--secondary" onClick={() => navigate('/events')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEvent
