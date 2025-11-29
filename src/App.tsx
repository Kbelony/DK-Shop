import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { AppLayout } from "./components/landing/AppLayout";
import { Navbar } from "./components/landing/Navbar";
import { HeroIntroSection } from "./components/landing/HeroIntroSection";
import { BehindDoughSection } from "./components/landing/BehindDoughSection";
import { ArtisansSection } from "./components/landing/ArtisansSection";
import { OriginHeroSection } from "./components/landing/OriginHeroSection";
import { NewsSection } from "./components/landing/NewsSection";
import { Footer } from "./components/landing/Footer";
import { SmoothScrollProvider } from "./components/landing/SmoothScrollProvider";
import { CustomCursor } from "./components/landing/CustomCursor";
import { GalleryPage } from "./components/gallery/GalleryPage";

function LandingPage({
  onOverlayToggle,
}: {
  onOverlayToggle: (value: boolean) => void;
}) {
  return (
    <AppLayout>
      <HeroIntroSection />
      <BehindDoughSection />
      <ArtisansSection />
      <OriginHeroSection onOverlayToggle={onOverlayToggle} />
      <NewsSection />
      <Footer />
    </AppLayout>
  );
}

function App() {
  const [originOverlay, setOriginOverlay] = useState(false);
  const location = useLocation();

  const isGalleryRoute = location.pathname.startsWith("/gallery");

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
          <Routes>
            <Route
              path="/"
              element={<LandingPage onOverlayToggle={setOriginOverlay} />}
            />
            <Route path="/gallery/:id" element={<GalleryPage />} />
          </Routes>
          <CustomCursor />
        </div>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

export default App;
