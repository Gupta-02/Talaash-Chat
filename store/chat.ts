import { create } from "zustand";
import type { ChatMessage } from "@/lib/openai";
import { nanoid } from "nanoid";

type ChatMode = "chat";
type ModelType = string;

type ChatSession = {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: number;
  icon: string;
};

type ChatStore = {
  sessions: ChatSession[];
  activeSessionId: string;
  createSession: (name: string) => void;
  switchSession: (id: string) => void;
  renameSession: (id: string, name: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (content: string, role: ChatMessage["role"], model: string) => void;
  updateLastMessage: (content: string) => void;
  input: string;
  setInput: (input: string) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  model: ModelType;
  setModel: (model: ModelType) => void;
  isReading: boolean;
  stopReading: () => void;
  voice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  voiceRate: number;
  setVoiceRate: (rate: number) => void;
  voicePitch: number;
  setVoicePitch: (pitch: number) => void;
};

const SESSION_ICONS = ['💡', '📚', '🧪', '💬', '🤖', '📝', '🌟', '🔬', '🧠', '📖'];
function getRandomIcon() {
  return SESSION_ICONS[Math.floor(Math.random() * SESSION_ICONS.length)];
}

const initialSession = {
  id: nanoid(),
  name: "Default Session",
  messages: [],
  createdAt: Date.now(),
  icon: getRandomIcon(),
};

export const useChatStore = create<ChatStore>((set, get) => ({
  sessions: [initialSession],
  activeSessionId: initialSession.id,
  createSession: (name) => {
    const newSession = {
      id: nanoid(),
      name,
      messages: [],
      createdAt: Date.now(),
      icon: getRandomIcon(),
    };
    set((state) => ({
      sessions: [...state.sessions, newSession],
      activeSessionId: newSession.id,
    }));
  },
  switchSession: (id) => set({ activeSessionId: id }),
  renameSession: (id, name) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === id ? { ...s, name } : s
      ),
    })),
  deleteSession: (id) =>
    set((state) => {
      // Prevent deleting the last session to avoid an empty state.
      if (state.sessions.length <= 1) {
        return state;
      }

      const newSessions = state.sessions.filter((s) => s.id !== id);
      let newActiveId = state.activeSessionId;

      // If the active session was deleted, fall back to the first session in the new list.
      if (state.activeSessionId === id) {
        newActiveId = newSessions[0].id;
      }

      return {
        sessions: newSessions,
        activeSessionId: newActiveId,
      };
    }),
  addMessage: (content, role, model) =>
    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === state.activeSessionId
          ? {
              ...s,
              messages: [
                ...s.messages,
                { id: nanoid(), content, role, model },
              ],
            }
          : s
      ),
    })),
  updateLastMessage: (content) =>
    set((state) => ({
      sessions: state.sessions.map((s) => {
        if (s.id !== state.activeSessionId || s.messages.length === 0) return s;
        const updatedMessages = [...s.messages];
        updatedMessages[updatedMessages.length - 1] = {
          ...updatedMessages[updatedMessages.length - 1],
          content,
        };
        return { ...s, messages: updatedMessages };
      }),
    })),
  input: "",
  setInput: (input) => set({ input }),
  isStreaming: false,
  setIsStreaming: (streaming) => set({ isStreaming: streaming }),
  mode: "chat",
  setMode: (mode) => set({ mode: mode }),
  model: "mistralai/mistral-7b-instruct:free",
  setModel: (model) => set({ model: model }),
  isReading: false,
  stopReading: () => {
    window.speechSynthesis.cancel();
    set({ isReading: false });
  },
  voice: null,
  setVoice: (voice) => set({ voice }),
  voiceRate: 1,
  setVoiceRate: (rate) => set({ voiceRate: rate }),
  voicePitch: 1,
  setVoicePitch: (pitch) => set({ voicePitch: pitch }),
}));