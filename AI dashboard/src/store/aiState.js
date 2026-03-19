import { create } from 'zustand';
import { activeModels, generateActivityData } from '../data/mockDatabase';

export const useAIStore = create((set) => ({
  isSidebarOpen: false,
  isAiTerminalOpen: false,
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  
  toggleAiTerminal: () => set((state) => ({ isAiTerminalOpen: !state.isAiTerminalOpen })),
  closeAiTerminal: () => set({ isAiTerminalOpen: false }),

  models: activeModels,
  activityData: generateActivityData(),

  deployModel: (newModel) => set((state) => ({
    models: [...state.models, { ...newModel, id: `m${Date.now()}`, status: 'Deploying...' }]
  })),

  removeModel: (id) => set((state) => ({
    models: state.models.filter(model => model.id !== id)
  })),
}));