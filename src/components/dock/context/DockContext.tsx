import { createContext, useContext, createSignal, Accessor, JSX } from "solid-js";

type DockContextType = {
  activePanel: Accessor<string | null>;
  toggle: (id: string) => void;
  registerPanel: (id: string, content: () => JSX.Element) => void;
  panels: Accessor<Record<string, () => JSX.Element>>;
};

const DockContext = createContext<DockContextType>();

export function useDock() {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error("useDock must be used inside <Dock>");
  return ctx;
}

export { DockContext };
