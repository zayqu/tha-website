import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { MakeADifference } from './pages/MakeADifference';
import { Academy } from './pages/Academy';
import { News } from './pages/News';
import { Contact } from './pages/Contact';
import { Projects } from './pages/Projects';
import { Impact } from './pages/Impact';
import { CampaignDetail } from './pages/CampaignDetail';
import NewsDetail from './pages/NewsDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNewsForm from './pages/admin/AdminNewsForm';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HashRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash.startsWith('#/')) {
      navigate(window.location.hash.slice(1), { replace: true });
    }
  }, [navigate]);

  return null;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

// Public layout – Header, Footer, mobile nav
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen pb-16 md:pb-0">
    <Header />
    <main className="flex-grow"><Outlet /></main>
    <Footer />
    <MobileBottomNav />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <HashRedirect />
          <ScrollToTop />
          <Routes>
            {/* ── Admin routes (standalone, no Header/Footer) ── */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/news/new" element={<ProtectedRoute><AdminNewsForm /></ProtectedRoute>} />
            <Route path="/admin/news/edit/:id" element={<ProtectedRoute><AdminNewsForm /></ProtectedRoute>} />

            {/* ── Public routes wrapped in PublicLayout ── */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/make-a-difference" element={<MakeADifference />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/impact" element={<Impact />} />
              <Route path="/academy" element={<Academy />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/campaigns/:campaignId" element={<CampaignDetail />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
