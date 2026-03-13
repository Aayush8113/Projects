import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import ScrollTop from "./components/ScrollTop";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Services from "./pages/Service";
import Contact from "./pages/Contact";
import CartPage from "./pages/Cart";
import ReservationForm from "./components/ReservationForm";

export default function App() {
  return (
    <BrowserRouter>
      <CustomCursor />
      <ScrollTop />
      <Navbar />

      <main className="bg-[#050505] min-h-screen overflow-hidden">
        <AnimatedRoutes />
      </main>

      <Footer />
    </BrowserRouter>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, filter: "blur(12px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(12px)" }}
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/reservationForm" element={<ReservationForm />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
