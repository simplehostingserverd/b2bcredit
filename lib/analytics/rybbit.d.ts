interface Rybbit {
  pageview: () => void;
  event: (name: string, properties?: Record<string, any>) => void;
  identify: (userId: string) => void;
  clearUserId: () => void;
  getUserId: () => string | null;
  trackOutbound: (url: string, text?: string, target?: string) => void;
}

declare global {
  interface Window {
    rybbit: Rybbit;
  }
}

export {}
