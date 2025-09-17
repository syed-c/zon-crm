"use client";

import { AppShell } from "./app-shell";

interface SimpleAppShellProps {
  children: React.ReactNode;
}

// Simplified shell: rely on middleware + auth_token cookie for auth.
// Avoid client-side redirects and localStorage checks that caused login flashes.
export function SimpleAppShell({ children }: SimpleAppShellProps) {
  return <AppShell user={undefined as any}>{children}</AppShell>;
}
