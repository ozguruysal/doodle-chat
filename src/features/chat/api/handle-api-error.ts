import { ApiError } from "./api-client";

export function handleApiError(error: unknown): string {
  if (!(error instanceof ApiError)) {
    console.error(error);
    return "Unexpected error";
  }

  switch (error.status) {
    case 401:
      return "Session expired. Please log in again.";

    case 403:
      return "You don't have permission for this action.";

    case 400:
      return error.message;

    case 404:
      return "Resource not found.";

    case 500:
    default:
      return "Something went wrong. Please try again.";
  }
}
