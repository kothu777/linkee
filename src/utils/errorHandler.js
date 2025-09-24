/**
 * Extracts user-friendly error message from various error response formats
 * @param {Object} error - The error object from axios or other sources
 * @returns {Object} - { message: string, status: number|null, isAuthError: boolean, isValidationError: boolean }
 */
export function parseErrorResponse(error) {
  let errorMessage = "An unexpected error occurred.";
  let statusCode = null;
  let isAuthError = false;
  let isValidationError = false;

  // Extract status and data from different error structures
  if (error.response) {
    // Server responded with error status
    statusCode = error.response.status;
    const responseData = error.response.data;
    
    // Extract error message from various response formats
    if (typeof responseData === 'string') {
      errorMessage = responseData;
    } else if (responseData?.message) {
      errorMessage = responseData.message;
    } else if (responseData?.error) {
      errorMessage = responseData.error;
    } else if (responseData?.errors) {
      if (Array.isArray(responseData.errors)) {
        errorMessage = responseData.errors.join(', ');
      } else if (typeof responseData.errors === 'object') {
        // Handle validation errors object
        const errorValues = Object.values(responseData.errors);
        errorMessage = errorValues.join(', ');
      }
    } else if (responseData?.data?.message) {
      errorMessage = responseData.data.message;
    }
  } else if (error.status) {
    // Direct status on error object
    statusCode = error.status;
    if (error.message) {
      errorMessage = error.message;
    }
  } else if (error.request) {
    // Network error
    errorMessage = "Network error. Please check your connection and try again.";
  } else {
    // Use the error message directly
    errorMessage = error.message || "An unexpected error occurred.";
  }

  // Determine error types
  isAuthError = statusCode === 401 || statusCode === 403;
  isValidationError = statusCode === 422 || 
    errorMessage.includes("content") && 
    (errorMessage.includes("30 characters") || errorMessage.includes("length"));

  return {
    message: errorMessage,
    status: statusCode,
    isAuthError,
    isValidationError
  };
}

/**
 * Generates user-friendly error messages based on error details
 * @param {Object} errorDetails - Output from parseErrorResponse
 * @returns {string} - User-friendly error message
 */
export function getErrorMessage(errorDetails) {
  const { message, status, isAuthError, isValidationError } = errorDetails;

  // Handle validation errors
  if (isValidationError) {
    if (message.includes("content") && (message.includes("30 characters") || message.includes("length"))) {
      return "Comment must be 30 characters or less";
    }
    if (message.includes("content") && message.includes("length")) {
      return "Comment length is invalid. Please check the requirements";
    }
    return message || "Invalid input data";
  }

  // Handle auth errors
  if (isAuthError) {
    if (status === 401) {
      return "Session expired. Please log in again";
    }
    if (status === 403) {
      return "You don't have permission to perform this action";
    }
  }

  // Handle specific status codes
  switch (status) {
    case 404:
      return "Resource not found";
    case 429:
      return "Too many requests. Please wait a moment and try again";
    case 500:
      return "Server error. Please try again later";
    default:
      return message || "Something went wrong. Please try again";
  }
}
