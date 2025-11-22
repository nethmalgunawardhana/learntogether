import { useState, useCallback } from 'react';

/**
 * Custom hook for form management with validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationSchema - Yup validation schema
 * @param {Function} onSubmit - Form submission handler
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues, validationSchema, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Handle field value change
   */
  const handleChange = useCallback((field) => (value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }, [errors]);

  /**
   * Handle field blur (mark as touched)
   */
  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    // Validate single field on blur
    if (validationSchema) {
      validateField(field, values[field]);
    }
  }, [values, validationSchema]);

  /**
   * Validate a single field
   */
  const validateField = async (field, value) => {
    try {
      await validationSchema.validateAt(field, { [field]: value });
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
      return true;
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error.message,
      }));
      return false;
    }
  };

  /**
   * Validate all form fields
   */
  const validateForm = async () => {
    try {
      await validationSchema.validate(values, { abortEarly: false });
      setErrors({});
      return true;
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach((err) => {
        if (err.path) {
          validationErrors[err.path] = err.message;
        }
      });
      setErrors(validationErrors);
      return false;
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate form
    const isValid = await validateForm();

    if (isValid && onSubmit) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }

    setIsSubmitting(false);
  };

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set form values programmatically
   */
  const setFormValues = useCallback((newValues) => {
    setValues((prev) => ({
      ...prev,
      ...newValues,
    }));
  }, []);

  /**
   * Set form errors programmatically
   */
  const setFormErrors = useCallback((newErrors) => {
    setErrors((prev) => ({
      ...prev,
      ...newErrors,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    setFormErrors,
    validateForm,
  };
};
