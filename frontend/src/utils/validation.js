export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  export const validatePhone = (phone) => {
    // Remove all non-digit characters
    const cleanedPhone = phone.replace(/\D/g, '')
    return cleanedPhone.length === 10
  }
  
  export const validateRSVP = (formData) => {
    const errors = {}
    
    // Validate required fields
    if (!formData.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }
    
    if (!formData.lastName?.trim()) {
      errors.lastName = 'Last name is required'
    }
    
    if (!formData.rsvp) {
      errors.rsvp = 'Please select an RSVP option'
    }
    
    // Validate contact information (at least one is required)
    if (!formData.email?.trim() && !formData.phone?.trim()) {
      errors.contact = 'Either email or phone is required'
    }
    
    // Validate email format if provided
    if (formData.email?.trim() && !validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }
    
    // Validate phone format if provided
    if (formData.phone?.trim() && !validatePhone(formData.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number'
    }
    
    return errors
  }
  
  export const hasValidationErrors = (errors) => {
    return Object.keys(errors).length > 0
  }
  
  export const getFirstValidationError = (errors) => {
    const errorKeys = Object.keys(errors)
    return errorKeys.length > 0 ? errors[errorKeys[0]] : null
  }
  