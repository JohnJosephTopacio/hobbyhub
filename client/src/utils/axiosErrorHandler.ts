import { isAxiosError } from "axios";

 interface ErrorResponse {
  message: string
}

export function handleAxiosError(error: unknown): string {
  if (isAxiosError<ErrorResponse>(error)) {
    // Server Error
    if (error.response?.data?.message) {
      return error.response.data.message;
    // Network Error
    } else if (error.request) {
      return 'Network Error';
    // Setup Error
    } else {
      return 'Axios Error';
    }
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return 'Unexpected Error';
  }
}

