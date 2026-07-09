import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { MarketPreview } from "@/components/sections/MarketPreview";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { SecuritySection } from "@/components/sections/SecuritySection";
import { CTASection } from "@/components/sections/CTASection";

export const metadata = {
  title: "MemePulse | Professional Meme Coin Trading Platform",
  description: "The most secure and advanced meme coin trading platform with real-time signals, automated bots, copy trading, and institutional-grade security.",
};

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <MarketPreview />
      <SecuritySection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
