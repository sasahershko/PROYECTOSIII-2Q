export const handleHttpError = (res, error = "ERROR", statusCode = 500) => {
  const defaultMessages = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    409: "CONFLICT",
    500: "INTERNAL_SERVER_ERROR",
  };

  let message =
    typeof error === "string" ? error : defaultMessages[statusCode] || "ERROR";

  if (error?.name === "ValidationError") {
    message = "VALIDATION_ERROR";
    statusCode = 400;
  } else if (error?.name === "CastError") {
    message = "INVALID_ID";
    statusCode = 400;
  }

  res.status(statusCode).json({
    ok: false,
    message,
    error: error instanceof Error ? error.message : undefined,
  });
};
