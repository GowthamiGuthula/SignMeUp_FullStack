import React, { useState, useEffect } from 'react'
import { validateRSVP } from '../utils/validation'
import './RSVPForm.css'

function RSVPForm({ 
  onSubmit, 
  initialValues = {}, 
  loading = false, 
  submitText = 'Submit RSVP',
  showRSVPOptions = true,
  errors: externalErrors = {}
}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rsvp: '',
    ...initialValues
  })
  
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (!externalErrors.duplicate) {
      // Clear any internal duplicate-related errors
      setErrors(prev => {
        const { duplicate, ...rest } = prev
        return rest
      })
    }
  }, [externalErrors.duplicate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const validateForm = () => {
    const validationErrors = validateRSVP(formData)
    setErrors(validationErrors)
    setTouched(Object.keys(formData).reduce((acc, key) => ({
      ...acc,
      [key]: true
    }), {}))
    
    return Object.keys(validationErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onSubmit(formData)
  }

  const getFieldError = (field) => {
    // Don't show duplicate error if it's been externally cleared
    if (field === 'duplicate' && !externalErrors.duplicate) {
      return ''
    }
    return errors[field] || externalErrors[field] || ''
  }

  const hasFieldError = (field) => {
    return touched[field] && !!getFieldError(field)
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} noValidate>
      <div className="rsvp-form__row">
        <div className="rsvp-form__field">
          <label className="rsvp-form__label" htmlFor="firstName">
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="John"
            className={`rsvp-form__input ${hasFieldError('firstName') ? 'rsvp-form__input--error' : ''}`}
            disabled={loading}
            required
            aria-invalid={hasFieldError('firstName')}
            aria-describedby={hasFieldError('firstName') ? 'firstName-error' : undefined}
          />
          {hasFieldError('firstName') && (
            <span id="firstName-error" className="rsvp-form__error" role="alert">
              {getFieldError('firstName')}
            </span>
          )}
        </div>

        <div className="rsvp-form__field">
          <label className="rsvp-form__label" htmlFor="lastName">
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Doe"
            className={`rsvp-form__input ${hasFieldError('lastName') ? 'rsvp-form__input--error' : ''}`}
            disabled={loading}
            required
            aria-invalid={hasFieldError('lastName')}
            aria-describedby={hasFieldError('lastName') ? 'lastName-error' : undefined}
          />
          {hasFieldError('lastName') && (
            <span id="lastName-error" className="rsvp-form__error" role="alert">
              {getFieldError('lastName')}
            </span>
          )}
        </div>
      </div>

      <div className="rsvp-form__field">
        <label className="rsvp-form__label" htmlFor="email">
          Email *
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="john@example.com"
          className={`rsvp-form__input ${hasFieldError('email') ? 'rsvp-form__input--error' : ''}`}
          disabled={loading}
          required
          aria-invalid={hasFieldError('email')}
          aria-describedby={hasFieldError('email') ? 'email-error' : undefined}
        />
        {hasFieldError('email') && (
          <span id="email-error" className="rsvp-form__error" role="alert">
            {getFieldError('email')}
          </span>
        )}
      </div>

      <div className="rsvp-form__field">
        <label className="rsvp-form__label" htmlFor="phone">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          placeholder="(555) 123-4567"
          className={`rsvp-form__input ${hasFieldError('phone') ? 'rsvp-form__input--error' : ''}`}
          disabled={loading}
          aria-invalid={hasFieldError('phone')}
          aria-describedby={hasFieldError('phone') ? 'phone-error' : undefined}
        />
        {hasFieldError('phone') && (
          <span id="phone-error" className="rsvp-form__error" role="alert">
            {getFieldError('phone')}
          </span>
        )}
      </div>

      {showRSVPOptions && (
        <div className="rsvp-form__field">
          <fieldset className="rsvp-form__radio-group">
            <legend className="rsvp-form__label">RSVP Status *</legend>
            {['Attending', 'Maybe', 'Not Attending'].map((option) => (
              <label
                key={option}
                className={`rsvp-form__radio-option ${formData.rsvp === option ? 'rsvp-form__radio-option--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="rsvp"
                  value={option}
                  checked={formData.rsvp === option}
                  onChange={(e) => handleInputChange('rsvp', e.target.value)}
                  disabled={loading}
                  required
                />
                {option}
              </label>
            ))}
          </fieldset>
          {hasFieldError('rsvp') && (
            <span className="rsvp-form__error" role="alert">
              {getFieldError('rsvp')}
            </span>
          )}
        </div>
      )}

      
      <div className="rsvp-form__actions">
        <button
          type="submit"
          className="rsvp-form__submit"
          disabled={loading || !formData.firstName || !formData.lastName || (!formData.email && !formData.phone) || (showRSVPOptions && !formData.rsvp)}
        >
          {loading ? 'Submitting...' : submitText}
        </button>
      </div>

      <p className="rsvp-form__note">
        * Required fields. Either email or phone is required. Phone must be 10 digits.
      </p>
    </form>
  )
}

export default RSVPForm
