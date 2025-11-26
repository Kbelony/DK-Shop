import "./assets/scss/style.scss";
import { useState } from "react";
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

function App() {
  const [originOverlay, setOriginOverlay] = useState(false);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <SmoothScrollProvider>
        <div className="min-h-screen bg-sand text-deep font-body">
          <Navbar translucent={originOverlay} />
          <AppLayout>
            <HeroIntroSection />
            <BehindDoughSection />
            <ArtisansSection />
            <OriginHeroSection onOverlayToggle={setOriginOverlay} />
            <NewsSection />
            <Footer />
          </AppLayout>
          <CustomCursor />
        </div>
      </SmoothScrollProvider>
    </ThemeProvider>
  );
}

export default App;
