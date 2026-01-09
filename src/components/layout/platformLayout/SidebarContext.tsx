import { createContext, useContext } from "react";

interface SidebarContextType {
  sidebarExpanded: boolean;
  sidebarWidth: number;
  onToggleExpand: (expanded: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

export { SidebarContext };
export type { SidebarContextType };
