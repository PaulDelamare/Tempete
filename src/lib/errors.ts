import { NextResponse } from "next/server";

export class ApiError extends Error {
     constructor(
          public status: number,
          public message: string,
          public details?: unknown
     ) {
          super(message);
          this.name = "ApiError";
     }
}

export function handleApiError(error: unknown) {
     if (error instanceof ApiError) {
          console.warn(`API Error ${error.status}: ${error.message}`, error.details);
          return NextResponse.json(
               { error: error.message, details: error.details },
               { status: error.status }
          );
     }

     console.error(error);
}

export function throwError(status: number, message: string, details?: unknown) {
     console.warn(`Error ${status}: ${message}`, details);
     throw new ApiError(status, message, details);
}


