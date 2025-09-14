
import React, { useState, useRef, useEffect, ReactNode } from 'react';
import HeroSection from '../../components/HeroSection.tsx';
import ExecutiveSummary from '../../components/ExecutiveSummary.tsx';
import MarketAnalysis from '../../components/MarketAnalysis.tsx';
import BusinessModel from '../../components/BusinessModel.tsx';
import FinancialProjections from '../../components/FinancialProjections.tsx';
import RiskAssessment from '../../components/RiskAssessment.tsx';
import ActionPlan from '../../components/ActionPlan.tsx';
import FundingInvestment from '../../components/FundingInvestment.tsx';
import ESG from '../../components/ESG.tsx';
import Contact from '../../components/Contact.tsx';
import AccreditationBanner from '../../components/AccreditationBanner.tsx';
import type { Currency } from '../types/index.ts';

const AnimatedSection: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
};

interface HomePageProps {
  currency: Currency;
  weeklyTotals: { paid: number; unpaid: number; };
}

const HomePage: React.FC<HomePageProps> = ({ currency, weeklyTotals }) => {
  return (
    <>
      <HeroSection />
      <AnimatedSection>
        <AccreditationBanner />
      </AnimatedSection>
      <AnimatedSection>
        <ExecutiveSummary currency={currency} weeklyTotals={weeklyTotals} />
      </AnimatedSection>
      <AnimatedSection>
        <MarketAnalysis weeklyTotals={weeklyTotals} currency={currency} />
      </AnimatedSection>
      <AnimatedSection>
        <BusinessModel weeklyTotals={weeklyTotals} currency={currency} />
      </AnimatedSection>
      <AnimatedSection>
        <FinancialProjections currency={currency} weeklyTotals={weeklyTotals} />
      </AnimatedSection>
      <AnimatedSection>
        <RiskAssessment weeklyTotals={weeklyTotals} currency={currency} />
      </AnimatedSection>
      <AnimatedSection>
        <ActionPlan currency={currency} weeklyTotals={weeklyTotals} />
      </AnimatedSection>
      <AnimatedSection>
        <FundingInvestment currency={currency} weeklyTotals={weeklyTotals} />
      </AnimatedSection>
      <AnimatedSection>
        <ESG weeklyTotals={weeklyTotals} currency={currency} />
      </AnimatedSection>
      <AnimatedSection>
       <Contact />
      </AnimatedSection>
    </>
  );
};

export default HomePage;
