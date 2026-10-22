import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AppLayout } from "./components/landing/AppLayout";
import { Navbar } from "./components/landing/Navbar";
import { HeroIntroSection } from "./components/landing/HeroIntroSection";
import { BehindDoughSection } from "./components/landing/BehindDoughSection";
import { CreatorIntroSection } from "./components/landing/CreatorIntroSection";
import { OriginHeroSection } from "./components/landing/OriginHeroSection";
import { NewsSection } from "./components/landing/NewsSection";
import { Footer } from "./components/landing/Footer";
import { SmoothScrollProvider } from "./components/landing/SmoothScrollProvider";
import { CustomCursor } from "./components/landing/CustomCursor";

const GalleryPage = lazy(() =>
  import("./components/gallery/GalleryPage").then((m) => ({ default: m.GalleryPage })),
);
const NewsListPage = lazy(() =>
  import("./components/news/NewsPages").then((m) => ({ default: m.NewsListPage })),
);
const NewsArticlePage = lazy(() =>
  import("./components/news/NewsPages").then((m) => ({ default: m.NewsArticlePage })),
);

function LandingPage({
  onOverlayToggle,
}: {
  onOverlayToggle: (value: boolean) => void;
}) {
  return (
    <AppLayout>
      <HeroIntroSection />
      <BehindDoughSection />
      <CreatorIntroSection />
      <OriginHeroSection onOverlayToggle={onOverlayToggle} />
      <NewsSection />
      <Footer />
    </AppLayout>
  );
}

function App() {
  const [originOverlay, setOriginOverlay] = useState(false);
  const location = useLocation();

  const isGalleryRoute = location.pathname !== "/";

  useEffect(() => {
    if (isGalleryRoute && originOverlay) {
      // Ensure navbar is opaque on gallery pages
      setOriginOverlay(false);
    }
  }, [isGalleryRoute, originOverlay]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SmoothScrollProvider>
        <div className="min-h-screen bg-sand text-deep font-body">
          <Navbar translucent={originOverlay} />
          <Suspense fallback={null}>
          <Routes>
            <Route
              path="/"
              element={<LandingPage onOverlayToggle={setOriginOverlay} />}
            />
            <Route path="/gallery/:id" element={<GalleryPage />} />
            <Route path="/news" element={<NewsListPage />} />
            <Route path="/news/:slug" element={<NewsArticlePage />} />
          </Routes>
          </Suspense>
          <CustomCursor />
        </div>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

export default App;
