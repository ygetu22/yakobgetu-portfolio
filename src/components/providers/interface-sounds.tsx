"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";

export type InterfaceSound = "home" | "resume" | "projects" | "posts" | "theme-light" | "theme-dark" | "background-on" | "background-off";

interface Tap {
  frequency: number;
  noiseFrequency: number;
  duration: number;
  volume: number;
  delay?: number;
}

// Dry, short taps: navigation is crisp, theme switches are deeper, and glyphs are airy.
const sounds: Record<InterfaceSound, readonly Tap[]> = {
  home: [{ frequency: 720, noiseFrequency: 2400, duration: 0.045, volume: 0.035 }],
  resume: [{ frequency: 840, noiseFrequency: 2800, duration: 0.045, volume: 0.035 }],
  projects: [{ frequency: 620, noiseFrequency: 2000, duration: 0.05, volume: 0.035 }],
  posts: [{ frequency: 960, noiseFrequency: 3200, duration: 0.04, volume: 0.03 }],
  "theme-light": [
    { frequency: 360, noiseFrequency: 1400, duration: 0.045, volume: 0.04 },
    { frequency: 540, noiseFrequency: 1900, duration: 0.035, volume: 0.025, delay: 0.035 },
  ],
  "theme-dark": [
    { frequency: 460, noiseFrequency: 1600, duration: 0.045, volume: 0.04 },
    { frequency: 280, noiseFrequency: 1100, duration: 0.04, volume: 0.025, delay: 0.035 },
  ],
  "background-on": [{ frequency: 1200, noiseFrequency: 4200, duration: 0.035, volume: 0.025 }],
  "background-off": [{ frequency: 880, noiseFrequency: 3500, duration: 0.03, volume: 0.025 }],
};

function playTap(context: AudioContext, tap: Tap) {
  const start = context.currentTime + 0.005 + (tap.delay ?? 0);
  const end = start + tap.duration;
  const oscillator = context.createOscillator();
  const toneGain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(tap.frequency, start);
  oscillator.frequency.exponentialRampToValueAtTime(tap.frequency * 0.55, end);
  toneGain.gain.setValueAtTime(0, start);
  toneGain.gain.linearRampToValueAtTime(tap.volume, start + 0.002);
  toneGain.gain.exponentialRampToValueAtTime(0.0001, end);
  oscillator.connect(toneGain);
  toneGain.connect(context.destination);
  oscillator.onended = () => { oscillator.disconnect(); toneGain.disconnect(); };
  oscillator.start(start);
  oscillator.stop(end);

  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * tap.duration), context.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index++) samples[index] = Math.random() * 2 - 1;
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const noiseGain = context.createGain();
  noise.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.value = tap.noiseFrequency;
  filter.Q.value = 0.8;
  noiseGain.gain.setValueAtTime(tap.volume * 0.7, start);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, end);
  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(context.destination);
  noise.onended = () => { noise.disconnect(); filter.disconnect(); noiseGain.disconnect(); };
  noise.start(start);
  noise.stop(end);
}

const SoundContext = createContext<(sound: InterfaceSound) => void>(() => {});

export function InterfaceSoundsProvider({ children }: { children: ReactNode }) {
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => () => {
    const context = audio.current;
    audio.current = null;
    if (context && context.state !== "closed") void context.close().catch(() => {});
  }, []);

  const play = useCallback((sound: InterfaceSound) => {
    try {
      if (!window.AudioContext) return;
      // Create/resume only inside the click gesture. The root provider survives navigation.
      const context = audio.current && audio.current.state !== "closed" ? audio.current : new AudioContext();
      audio.current = context;
      const playTaps = () => {
        if (audio.current !== context || context.state !== "running") return;
        for (const tap of sounds[sound]) playTap(context, tap);
      };
      if (context.state !== "running") void context.resume().then(playTaps).catch(() => {});
      else playTaps();
    } catch {
      // Audio availability must never prevent navigation or toggling a control.
    }
  }, []);

  return <SoundContext.Provider value={play}>{children}</SoundContext.Provider>;
}

export function useInterfaceSound() {
  return useContext(SoundContext);
}
