
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GlobalLoader from './components/GlobalLoader';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import AIChatbot from './components/AIChatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Categories from './pages/Categories';
import TrackOrder from './pages/TrackOrder';
import Returns from './pages/Returns';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <GlobalLoader />
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen transition-colors duration-300 bg-transparent text-slate-900 dark:text-slate-50">
            <Navbar />
            <main className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-tracking" element={<OrderTracking />} />
                <Route path="/profile" element={<Dashboard />} />
                <Route path="/admin" element={<Dashboard role="admin" />} />
                <Route path="/seller" element={<Dashboard role="seller" />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/returns" element={<Returns />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <ErrorBoundary>
              <AIChatbot />
            </ErrorBoundary>
            <Footer />
          </div>
        </Router>
      </CurrencyProvider>
    </ThemeProvider>
  );
}

export default App;
