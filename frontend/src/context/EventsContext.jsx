import { createContext, useContext, useEffect, useState } from 'react'
import * as api from '../services/api'

const EventsContext = createContext()

function mapEvent(apiEvent, rsvps = []) {
  return {
    id: apiEvent.id,
    name: apiEvent.name,
    date: apiEvent.date,
    time: apiEvent.time,
    location: apiEvent.location,
    category: api.toDisplayCategory(apiEvent.category),
    totalSlots: apiEvent.totalSlots,
    slotsBooked: apiEvent.slotsBooked,
    description: apiEvent.description,
    image: apiEvent.imageUrl,
    attendees: rsvps
      .filter((r) => r.status === 'ATTENDING')
      .map((r) => ({
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        phone: r.phone,
      })),
  }
}

export function EventsProvider({ children }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function loadEvents() {
      try {
        const apiEvents = await api.fetchEvents()
        const withAttendees = await Promise.all(
          apiEvents.map(async (ev) => mapEvent(ev, await api.fetchAttendees(ev.id)))
        )
        if (!cancelled) setEvents(withAttendees)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadEvents()
    return () => {
      cancelled = true
    }
  }, [])

  // Re-fetches a single event + its attendees and merges the result into state
  const refreshEvent = async (eventId) => {
    const [apiEvent, rsvps] = await Promise.all([
      api.fetchEvent(eventId),
      api.fetchAttendees(eventId),
    ])
    const updated = mapEvent(apiEvent, rsvps)
    setEvents((prev) => prev.map((ev) => (ev.id === eventId ? updated : ev)))
    return updated
  }

  const rsvpToEvent = async (eventId, userInfo) => {
    await api.rsvpToEvent(eventId, {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      email: userInfo.email,
      phone: userInfo.phone,
      status: 'ATTENDING',
    })
    await refreshEvent(eventId)
  }

  const cancelRsvp = async (eventId, email) => {
    await api.cancelRsvp(eventId, email)
    await refreshEvent(eventId)
  }

  const addEvent = async (newEvent) => {
    const created = await api.createEvent({
      name: newEvent.name,
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      category: api.toBackendCategory(newEvent.category),
      totalSlots: newEvent.totalSlots,
      description: newEvent.description,
      imageUrl: newEvent.image,
      organizerEmail: newEvent.organizerEmail,
    })
    const mapped = mapEvent(created, [])
    setEvents((prev) => [...prev, mapped])
    return mapped.id
  }

  return (
    <EventsContext.Provider value={{ events, loading, error, rsvpToEvent, cancelRsvp, addEvent }}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  return useContext(EventsContext)
}
