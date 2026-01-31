"use client";

import { useEffect, useSyncExternalStore } from "react";

interface SidebarState {
  isMobileOpen: boolean;
}

let state: SidebarState = { isMobileOpen: false };
const serverSnapshot: SidebarState = { isMobileOpen: false };
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return serverSnapshot;
}

function toggleMobileSidebar() {
  state = { ...state, isMobileOpen: !state.isMobileOpen };
  emitChange();
}

function closeMobileSidebar() {
  state = { ...state, isMobileOpen: false };
  emitChange();
}

export function useSidebar() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && state.isMobileOpen) {
        closeMobileSidebar();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    isMobileOpen: snap.isMobileOpen,
    toggleMobileSidebar,
    closeMobileSidebar,
  };
}
