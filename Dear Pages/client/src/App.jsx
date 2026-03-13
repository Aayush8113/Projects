import { useContext, useEffect, useState, Suspense, lazy } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import { LibraryProvider } from "./context/LibraryContext";
import { ThemeProvider } from "./context/ThemeContext";
import { UIProvider } from "./context/UIContext";
import client from "./api/client";

// Eagerly loaded components for immediate visual feedback
import PageLoader from "./components/PageLoader"; 
import AILibrarian from "./components/AILibrarian";

// Lazy loaded pages for performance
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardContent = lazy(() => import("./pages/DashboardContent"));
const LentHistory = lazy(() => import("./pages/LentHistory"));

const Root = () => {
  const { user, loading } = useContext(AuthContext);
  
  // Cinematic Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  // Background Nudge Task
  useEffect(() => {
    if (user) client.get("/books/nudge").catch(() => {});
  }, [user]);

  // Enforce the 2.5-second DearPages boot sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  // Show the PageLoader while Auth is resolving OR while splash timer runs
  if (loading || showSplash) {
    return <PageLoader />;
  }

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {!user ? (
            <>
              <Route path="/auth" element={<AuthPage />} />
              <Route path="*" element={<Navigate to="/auth" replace />} />
            </>
          ) : (
            <Route
              path="/*"
              element={
                <LibraryProvider>
                  <AILibrarian />
                  <Routes>
                    <Route path="/" element={<DashboardContent />} />
                    <Route path="/wishlist" element={<DashboardContent filter="Dream Books" />} />
                    <Route path="/lent" element={<LentHistory />} />
                    
                    {/* Secure Admin Route */}
                    <Route
                      path="/admin"
                      element={user.role === "admin" ? <AdminDashboard /> : <Navigate to="/" replace />}
                    />
                    
                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </LibraryProvider>
              }
            />
          )}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UIProvider>
          <Root />
        </UIProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}