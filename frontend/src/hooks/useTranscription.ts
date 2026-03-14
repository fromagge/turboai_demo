import { useCallback, useEffect, useRef, useState } from "react";

import { getTranscriptionToken } from "@/services/transcription";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const DEEPGRAM_WS_URL =
  "wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=24000&channels=1&model=nova-3&punctuate=true&interim_results=false";

export function useTranscription(onTranscript: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const speechRecRef = useRef<any>(null);
  const onTranscriptRef = useRef(onTranscript);
  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  const cleanup = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;

    workletRef.current?.disconnect();
    workletRef.current = null;

    analyserRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    speechRecRef.current?.stop();
    speechRecRef.current = null;

    setAudioLevel(0);
    setIsRecording(false);
  }, []);

  const startWebSpeechFallback = useCallback(
    (stream: MediaStream) => {
      try {
        const fallbackCtx = new AudioContext();
        audioContextRef.current = fallbackCtx;
        const source = fallbackCtx.createMediaStreamSource(stream);
        const analyser = fallbackCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        analyserRef.current = analyser;
        source.connect(analyser);
      } catch {
        // no analyser for level visualization in fallback
      }

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            onTranscriptRef.current(event.results[i][0].transcript);
          }
        }
      };

      recognition.onerror = () => {
        cleanup();
      };

      recognition.onend = () => {
        cleanup();
      };

      speechRecRef.current = recognition;
      recognition.start();
    },
    [cleanup],
  );

  const startRecording = useCallback(async () => {
    if (isRecording) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    setIsRecording(true);

    let tokenResponse: { token: string } | null = null;
    try {
      tokenResponse = await getTranscriptionToken();
    } catch {
      startWebSpeechFallback(stream);
      return;
    }

    const ws = new WebSocket(DEEPGRAM_WS_URL, ["token", tokenResponse.token]);
    wsRef.current = ws;

    ws.onopen = async () => {
      try {
        const audioContext = new AudioContext({ sampleRate: 24000 });
        audioContextRef.current = audioContext;

        await audioContext.audioWorklet.addModule("/audio-processor.js");
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        analyserRef.current = analyser;

        const worklet = new AudioWorkletNode(audioContext, "audio-processor");
        workletRef.current = worklet;

        worklet.port.onmessage = (event: MessageEvent) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(event.data);
          }
        };

        source.connect(analyser);
        analyser.connect(worklet);
        worklet.connect(audioContext.destination);
      } catch {
        ws.close();
        startWebSpeechFallback(stream);
      }
    };

    ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data as string);
      const transcript = data.channel?.alternatives?.[0]?.transcript;
      if (transcript && data.is_final) {
        onTranscriptRef.current(transcript);
      }
    };

    ws.onerror = () => {
      cleanup();
      startWebSpeechFallback(stream);
    };

    ws.onclose = () => {
      if (wsRef.current === ws) {
        cleanup();
      }
    };
  }, [isRecording, cleanup, startWebSpeechFallback]);

  const stopRecording = useCallback(() => {
    cleanup();
  }, [cleanup]);

  useEffect(() => {
    if (!isRecording) return;
    const dataArray = new Uint8Array(128);
    let rafId: number;

    const updateLevel = () => {
      const analyser = analyserRef.current;
      if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const avg = sum / dataArray.length;
        setAudioLevel(Math.min(1, avg / 128));
      }
      rafId = requestAnimationFrame(updateLevel);
    };
    rafId = requestAnimationFrame(updateLevel);
    return () => cancelAnimationFrame(rafId);
  }, [isRecording]);

  return { isRecording, startRecording, stopRecording, audioLevel };
}
