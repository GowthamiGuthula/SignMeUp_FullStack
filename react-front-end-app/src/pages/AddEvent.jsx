import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEvents } from '../context/EventsContext'
import * as api from '../services/api'
import './AddEvent.css'

function AddEvent() {
  const { events, addEvent, updateEvent } = useEvents()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

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
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')

  // When editing, load the existing event's details into the form
  useEffect(() => {
    if (!isEditing) return
    const existing = events.find((ev) => ev.id === Number(id))
    if (!existing) return

    setName(existing.name)
    setDate(existing.date)
    setTime(existing.time)
    setLocation(existing.location)
    setCategory(existing.category)
    setTotalSlots(String(existing.totalSlots))
    setDescription(existing.description)
    setImage(existing.image)
    setOrganizerEmail(existing.organizerEmail)
  }, [isEditing, id, events])

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setImageError('')
    setImageUploading(true)
    try {
      const { url } = await api.uploadImage(file)
      setImage(url)
    } catch (err) {
      setImageError(err.message || 'Could not upload image')
    } finally {
      setImageUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImage('')
    setImageError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !date || !time || !location || !totalSlots || !description || !organizerEmail) return

    setSubmitting(true)
    setSubmitError('')
    try {
      const eventData = {
        name,
        date,
        time,
        location,
        category,
        totalSlots: Number(totalSlots),
        description,
        // Leave blank when nothing was uploaded - the backend picks a
        // relevant photo from Unsplash based on the event's category and name.
        image,
        organizerEmail,
      }

      if (isEditing) {
        await updateEvent(Number(id), eventData)
        navigate(`/events/${id}`)
      } else {
        const newId = await addEvent(eventData)
        navigate(`/events/${newId}`)
      }
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="add-event">
      <h1 className="add-event-title">{isEditing ? 'Edit Event' : 'Add New Event'}</h1>

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
          Event Image (optional)
          <input
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            onChange={handleImageChange}
            disabled={imageUploading}
            className="add-event-input"
          />
        </label>
        <p className="add-event-hint">
          {imageUploading
            ? 'Uploading image...'
            : "If you don't upload a photo, we'll pick one from Unsplash based on your event's category and name."}
        </p>
        {imageError && <p className="add-event-error">{imageError}</p>}
        {image && (
          <div className="add-event-image-preview">
            <img src={image} alt="Event preview" />
            <button type="button" className="add-event-btn add-event-btn--secondary" onClick={handleRemoveImage}>
              Remove Photo
            </button>
          </div>
        )}

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
          <button type="submit" className="add-event-btn add-event-btn--primary" disabled={submitting || imageUploading}>
            {submitting
              ? (isEditing ? 'Saving...' : 'Creating...')
              : (isEditing ? 'Save Changes' : 'Create Event')}
          </button>
          <button
            type="button"
            className="add-event-btn add-event-btn--secondary"
            onClick={() => navigate(isEditing ? `/events/${id}` : '/events')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddEvent
