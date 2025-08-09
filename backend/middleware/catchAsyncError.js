// Middleware to catch async errors
export const catchAsyncError = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
  };
}; 