import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AppLayout } from "./components/landing/AppLayout";
import { Navbar } from "./components/landing/Navbar";
import { HeroIntroSection } from "./components/landing/HeroIntroSection";
import { BehindDoughSection } from "./components/landing/BehindDoughSection";
import { CreatorIntroSection } from "./components/landing/CreatorIntroSection";
import { NewsListPage, NewsArticlePage } from "./components/news/NewsPages";
import { OriginHeroSection } from "./components/landing/OriginHeroSection";
import { NewsSection } from "./components/landing/NewsSection";
import { Footer } from "./components/landing/Footer";
import { CustomCursor } from "./components/landing/CustomCursor";
import { GalleryPage } from "./components/gallery/GalleryPage";

function LandingPage() {
  return (
    <AppLayout>
      <HeroIntroSection />
      <BehindDoughSection />
      <CreatorIntroSection />
      <OriginHeroSection />
      <NewsSection />
      <Footer />
    </AppLayout>
  );
}

function App() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <div className="min-h-screen bg-sand text-deep font-body">
          <Navbar translucent={false} />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gallery/:id" element={<GalleryPage />} />
            <Route path="/news" element={<NewsListPage />} />
            <Route path="/news/:slug" element={<NewsArticlePage />} />
          </Routes>
          <CustomCursor />
        </div>
    </ThemeProvider>
  );
}

export default App;
