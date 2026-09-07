import { useEvents } from '../context/EventsContext'
import { attendeesMatch } from './attendeeHelpers'

export const useAttendees = (eventId) => {
  // Get events and operations from context
  const { events, rsvpToEvent, cancelRsvp } = useEvents()
  
  // Find the specific event
  const event = events.find(e => e.id === eventId)
  
  const findDuplicateAttendee = (firstName, lastName, email, phone) => {
    if (!event || !event.attendees) return null
    
    const newAttendee = {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      phone: phone?.trim()
    }
    
    // Find any existing attendee that matches
    return event.attendees.find(existing => 
      attendeesMatch(newAttendee, existing)
    )
  }
  
  const isAlreadyAttending = (savedUserInfo) => {
    if (!event || !event.attendees || !savedUserInfo) return false
    
    return event.attendees.some(attendee => 
      attendeesMatch(savedUserInfo, attendee)
    )
  }
  
  const getDisplayAttendees = (limit = 3) => {
    if (!event || !event.attendees) return []
    
    return event.attendees.slice(0, limit)
  }
  
  const hasMoreAttendees = (limit = 3) => {
    if (!event || !event.attendees) return false
    return event.attendees.length > limit
  }
  
  const getAdditionalAttendeesCount = (limit = 3) => {
    if (!event || !event.attendees) return 0
    return Math.max(0, event.attendees.length - limit)
  }
  
  const getAttendeeNameForRSVP = (attendee) => {
    if (typeof attendee === 'string') return attendee
    if (attendee?.firstName && attendee?.lastName) {
      return `${attendee.firstName} ${attendee.lastName}`
    }
    return attendee?.name || ''
  }
  
  return {
    // Event data
    event,
    
    // Duplicate detection
    findDuplicateAttendee,
    isAlreadyAttending,
    
    // Display utilities
    getDisplayAttendees,
    hasMoreAttendees,
    getAdditionalAttendeesCount,
    
    // RSVP operations
    rsvpToEvent,
    cancelRsvp,
    getAttendeeNameForRSVP,
    
    // Event metadata
    slotsLeft: event ? event.totalSlots - event.slotsBooked : 0,
    totalSlots: event?.totalSlots || 0,
    slotsBooked: event?.slotsBooked || 0,
    attendeesCount: event?.attendees?.length || 0
  }
}
