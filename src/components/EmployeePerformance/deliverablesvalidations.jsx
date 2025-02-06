// validations.js

// Employee ID validation (e.g., must be a number or specific format)
export const validateEmployeeId = (employeeId) => {
  const regex = /^[0-9]+$/; // Example: numeric only
  if (!employeeId || !regex.test(employeeId)) {
    return "Invalid Employee ID. It should be numeric.";
  }
  return null;
};

// Performance ID validation (similar to Employee ID)
export const validatePerformanceId = (performanceId) => {
  const regex = /^[0-9]+$/;
  if (!performanceId || !regex.test(performanceId)) {
    return "Invalid Performance ID. It should be numeric.";
  }
  return null;
};

// Deliverable Title validation (e.g., non-empty, max length)
export const validateDeliverableTitle = (deliverableTitle) => {
  if (!deliverableTitle || deliverableTitle.length < 3) {
    return "Deliverable Title must be at least 3 characters long.";
  }
  return null;
};

// Expected Completion Date validation
export const validateExpectedCompletedDate = (date) => {
  const today = new Date();
  const inputDate = new Date(date);
  if (!date || inputDate < today) {
    return "Expected Completion Date must be a future date.";
  }
  return null;
};

// General non-empty validation
export const validateRequiredField = (fieldValue, fieldName) => {
  if (!fieldValue) {
    return `${fieldName} is required.`;
  }
  return null;
};
