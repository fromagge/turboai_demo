export type FieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  fieldErrors: FieldErrors;

  constructor(
    public status: number,
    message: string,
    fieldErrors: FieldErrors = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.fieldErrors = fieldErrors;
  }
}

let refreshPromise: Promise<Response> | null = null;

async function attemptRefresh(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        await res.text();
        return res;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  const res = await refreshPromise;
  return res.ok;
}

function parseFieldErrors(body: Record<string, unknown>): FieldErrors {
  const errors: FieldErrors = {};
  for (const [key, value] of Object.entries(body)) {
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      errors[key] = value;
    }
  }
  return errors;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  let response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const skipRefresh = endpoint.includes("/auth/refresh");
  if (response.status === 401 && !skipRefresh) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      response = await fetch(endpoint, {
        ...options,
        headers,
      });
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const fieldErrors = parseFieldErrors(body);
    const message =
      (body.message as string) ||
      (body.detail as string) ||
      (body.error as string) ||
      "Request failed";
    throw new ApiError(response.status, message, fieldErrors);
  }

  return response.json() as Promise<T>;
}
