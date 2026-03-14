import { apiClient } from "@/lib/clients/api";

interface TranscriptionTokenResponse {
  client_secret: string;
}

export function getTranscriptionToken() {
  return apiClient<TranscriptionTokenResponse>(
    "/api/notes/transcription/token/",
    { method: "POST" },
  );
}
