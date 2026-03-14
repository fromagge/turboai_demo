import { apiClient } from "@/lib/clients/api";

interface TranscriptionTokenResponse {
  token: string;
}

export function getTranscriptionToken() {
  return apiClient<TranscriptionTokenResponse>(
    "/api/notes/transcription/token/",
    { method: "POST" },
  );
}
