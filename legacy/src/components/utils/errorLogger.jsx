/**
 * Logs an error to the console and could be extended
 * to send logs to a remote service like Sentry or LogRocket.
 * @param {Error} error The error object.
 * @param {Object} errorInfo The component stack trace from React.
 */
export const logError = (error, errorInfo) => {
  // In a real app, you would send this to a logging service.
  console.error("Caught by Error Boundary:", error, errorInfo);
  // Example: Sentry.captureException(error, { extra: errorInfo });
};