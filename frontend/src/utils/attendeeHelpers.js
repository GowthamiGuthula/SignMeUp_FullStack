export const formatAttendeeName = (attendee) => {
    if (typeof attendee === 'string') {
      return attendee
    }
    
    if (attendee?.firstName && attendee?.lastName) {
      return `${attendee.firstName} ${attendee.lastName.charAt(0)}.`
    }
    
    if (attendee?.name) {
      return attendee.name
    }
    
    // Default fallback
    return 'Unknown'
  }
  
  export const getAttendeeFullName = (attendee) => {
    if (typeof attendee === 'string') {
      return attendee
    }
    
    if (attendee?.firstName && attendee?.lastName) {
      return `${attendee.firstName} ${attendee.lastName}`
    }
    return attendee?.name || ''
  }
  
  export const getAttendeeAvatarLetter = (attendee) => {
    const name = typeof attendee === 'string' ? attendee : 
                  attendee?.firstName || attendee?.name || ''
    return name.charAt(0) || '?'
  }
  
  export const normalizePhone = (phone) => {
    return phone.replace(/\D/g, '')
  }
  
  export const attendeesMatch = (attendee1, attendee2) => {
    const name1 = getAttendeeFullName(attendee1).toLowerCase()
    const name2 = getAttendeeFullName(attendee2).toLowerCase()
    
    // Check by name
    if (name1 && name2 && name1 === name2) {
      return true
    }
    
    // Check by email
    if (attendee1?.email && attendee2?.email) {
      if (attendee1.email.toLowerCase() === attendee2.email.toLowerCase()) {
        return true
      }
    }
    
    // Check by phone (normalized)
    if (attendee1?.phone && attendee2?.phone) {
      const phone1 = normalizePhone(attendee1.phone)
      const phone2 = normalizePhone(attendee2.phone)
      if (phone1 === phone2 && phone1.length === 10) {
        return true
      }
    }
    
    return false
  }
  