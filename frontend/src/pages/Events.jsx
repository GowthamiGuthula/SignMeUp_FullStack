import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../context/EventsContext'
import EventCard from '../components/EventCard'
import './Events.css'

function isPast(event) {
  return new Date(event.date) < new Date(new Date().toDateString())
}

function Events() {
  // Get events from Context (shared state)
  const { events } = useEvents()

  // useState for search text
  const [search, setSearch] = useState('')

  // Filter events based on search text only
  const filtered = events.filter((ev) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      ev.name.toLowerCase().includes(q) ||
      ev.category.toLowerCase().includes(q) ||
      ev.location.toLowerCase().includes(q)
    )
  })

  return (
    <div className="events-page">
      <div className="events-header">
        <h1 className="events-title">Events</h1>
        <Link to="/events/create" className="events-add-link">+ Add Event</Link>
      </div>

      {/* Search bar — controlled input using useState */}
      <input
        type="text"
        className="events-search"
        placeholder="Search by name, category, or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="events-grid">
        {filtered.map((ev) => (
          <EventCard key={ev.id} event={ev} isPast={isPast(ev)} />
        ))}
        {filtered.length === 0 && (
          <p className="events-empty">No events found.</p>
        )}
      </div>
    </div>
  )
}

export default Events
