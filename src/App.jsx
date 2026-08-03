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
import LegalPolicy from './pages/LegalPolicy';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminNewsForm from './pages/admin/AdminNewsForm';
import AdminProjectsDashboard from './pages/admin/AdminProjectsDashboard';
import AdminProjectForm from './pages/admin/AdminProjectForm';
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

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
};

const PublicLayout = () => (
  <div className="public-mobile-shell flex min-h-screen flex-col">
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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/news/new" element={<ProtectedRoute><AdminNewsForm /></ProtectedRoute>} />
            <Route path="/admin/news/edit/:id" element={<ProtectedRoute><AdminNewsForm /></ProtectedRoute>} />
            <Route path="/admin/projects" element={<ProtectedRoute><AdminProjectsDashboard /></ProtectedRoute>} />
            <Route path="/admin/projects/new" element={<ProtectedRoute><AdminProjectForm /></ProtectedRoute>} />
            <Route path="/admin/projects/edit/:id" element={<ProtectedRoute><AdminProjectForm /></ProtectedRoute>} />

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
              <Route path="/privacy" element={<LegalPolicy type="privacy" />} />
              <Route path="/cookies" element={<LegalPolicy type="cookies" />} />
              <Route path="/terms" element={<LegalPolicy type="terms" />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
