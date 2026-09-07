import { createContext, useContext, useState } from 'react'
import INITIAL_EVENTS from '../data/events'
import { getAttendeeFullName } from '../utils/attendeeHelpers'

const EventsContext = createContext()

export function EventsProvider({ children }) {
  // Initialize events state with mock data
  const [events, setEvents] = useState(INITIAL_EVENTS)

  const rsvpToEvent = (eventId, userInfo) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? { 
              ...ev, 
              attendees: [...ev.attendees, userInfo], 
              slotsBooked: ev.slotsBooked + 1 
            }
          : ev
      )
    )
  }

  const cancelRsvp = (eventId, userName) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === eventId
          ? {
              ...ev,
              // Use shared utility to filter attendees by name
              attendees: ev.attendees.filter((attendee) => 
                getAttendeeFullName(attendee) !== userName
              ),
              slotsBooked: ev.slotsBooked - 1,
            }
          : ev
      )
    )
  }

  const addEvent = (newEvent) => {
    // Generate unique ID by finding the highest existing ID and adding 1
    const nextId = events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1
    
    // Add new event with default values for slots and attendees
    setEvents((prev) => [
      ...prev, 
      { 
        ...newEvent, 
        id: nextId, 
        slotsBooked: 0, 
        attendees: [] 
      }
    ])
    
    return nextId
  }

  // Provide the context value to all child components
  return (
    <EventsContext.Provider value={{ events, rsvpToEvent, cancelRsvp, addEvent }}>
      {children}
    </EventsContext.Provider>
  )
}

export function useEvents() {
  return useContext(EventsContext)
}
