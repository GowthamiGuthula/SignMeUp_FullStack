const API_BASE = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      message = body.message || message
    } catch {
      // response had no JSON body
    }
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}

// Category is a fixed enum on the backend (WORKSHOP, SOCIAL, COMPETITION, MEETUP, OTHER)
// but the UI displays/collects it as a capitalized word (Workshop, Social, ...).
export function toBackendCategory(displayCategory) {
  return (displayCategory || 'OTHER').toUpperCase()
}

export function toDisplayCategory(backendCategory) {
  if (!backendCategory) return 'Other'
  return backendCategory.charAt(0) + backendCategory.slice(1).toLowerCase()
}

// RSVP status is a fixed enum on the backend (ATTENDING, MAYBE, NOT_ATTENDING)
// but the UI collects it as a radio label (Attending, Maybe, Not Attending).
export function toBackendStatus(displayStatus) {
  return (displayStatus || 'ATTENDING').toUpperCase().replace(/\s+/g, '_')
}

export function toDisplayStatus(backendStatus) {
  if (!backendStatus) return 'Attending'
  return backendStatus
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function fetchEvents() {
  return request('/events')
}

export function fetchEvent(id) {
  return request(`/events/${id}`)
}

export function createEvent(payload) {
  return request('/events', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateEvent(id, payload) {
  return request(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteEvent(id, organizerEmail) {
  return request(`/events/${id}?organizerEmail=${encodeURIComponent(organizerEmail)}`, {
    method: 'DELETE',
  })
}

// Uploads an image file and returns its stored URL. Does not use `request()`
// since it sends multipart/form-data instead of JSON.
export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE}/uploads`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    let message = `Upload failed with status ${res.status}`
    try {
      const body = await res.json()
      message = body.message || message
    } catch {
      // response had no JSON body
    }
    throw new Error(message)
  }

  return res.json()
}

export function fetchAttendees(eventId) {
  return request(`/events/${eventId}/rsvps`)
}

export function rsvpToEvent(eventId, payload) {
  return request(`/events/${eventId}/rsvps`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function cancelRsvp(eventId, email) {
  return request(`/events/${eventId}/rsvps?email=${encodeURIComponent(email)}`, {
    method: 'DELETE',
  })
}

export function updateRsvp(eventId, email, payload) {
  return request(`/events/${eventId}/rsvps?email=${encodeURIComponent(email)}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function fetchRsvpsByEmail(email) {
  return request(`/rsvps?email=${encodeURIComponent(email)}`)
}

export function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function loginUser(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function forgotPassword(payload) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchUser(id) {
  return request(`/users/${id}`)
}

export function updateUser(id, payload) {
  return request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
