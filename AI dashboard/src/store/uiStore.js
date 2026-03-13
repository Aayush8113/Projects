import { create } from 'zustand';

export const useStore = create((set) => ({
  // UI State
  isSidebarOpen: true, // Renamed from isAISidebarOpen to be more generic if needed, or keep specific
  isAiOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleAi: () => set((state) => ({ isAiOpen: !state.isAiOpen })),
  closeAi: () => set({ isAiOpen: false }),

  // User/Settings State
  user: { name: "Aayush", role: "Admin", avatar: "AT" },
  notifications: 3,
  theme: "dark",
  
  // Data State (Simulating a Database)
  customers: [
    { id: 1, name: "TechCorp Inc.", status: "Active", amount: "12,500", date: "2025-12-15" },
    { id: 2, name: "Startup IO", status: "Pending", amount: "4,200", date: "2025-12-16" },
    { id: 3, name: "Global Solutions", status: "Active", amount: "8,900", date: "2025-12-17" },
    { id: 4, name: "Design Studio", status: "Cancelled", amount: "1,200", date: "2025-12-14" },
  ],
  
  // Action to simulate deleting a customer
  deleteCustomer: (id) => set((state) => ({
    customers: state.customers.filter(c => c.id !== id)
  })),
}));