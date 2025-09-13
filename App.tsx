import React, { useState, useRef, useEffect, ReactNode, useMemo } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ExecutiveSummary from './components/ExecutiveSummary';
import MarketAnalysis from './components/MarketAnalysis';
import BusinessModel from './components/BusinessModel';
import FinancialProjections from './components/FinancialProjections';
import RiskAssessment from './components/RiskAssessment';
import ActionPlan from './components/ActionPlan';
import FundingInvestment from './components/FundingInvestment';
import ESG from './components/ESG';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Portal from './components/Portal';
import AccreditationBanner from './components/AccreditationBanner';
import BlogSection from './components/BlogSection';
import { INITIAL_PROJECTS, getProjectData, calculateAllProjectsWeeklyTotals } from './data/mockData';
import type { ProjectData } from './types/portal';
import "./hotfix.css";

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  publishDate: string; // "YYYY-MM-DD"
  status: 'Published' | 'Draft';
  excerpt: string;
  content: string; // Can be markdown or simple text
  imageUrl: string;
  tags: string[];
}

const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-post-1',
    title: 'Learning to Think in Prompts While Living Off Grid on an Island',
    author: 'David Le',
    publishDate: '2025-08-15',
    status: 'Published',
    excerpt: 'When I moved off grid to a small island in Palawan, I thought the hardest part would be the solar panels or the water tanks. I was wrong. The hardest part was learning how to think differently.',
    content: `When I moved off grid to a small island in Palawan, I thought the hardest part would be the solar panels or the water tanks. I was wrong. The hardest part was learning how to think differently—specifically, how to think in prompts.

Living off-grid is a constant conversation with your environment. You don't just flip a switch; you ask, "Is there enough sun to run the water pump?" You don't just turn on a tap; you ask, "How much rainwater is in the tank, and what is the forecast for the week?" These are all prompts.

My "operating system" for daily life became a series of inputs and conditional outputs.
**Input:** Cloudy sky, low battery percentage.
**Constraint:** Need to work on the laptop for 4 hours.
**Prompt:** "What is the most energy-efficient way to complete my work, and which non-essential devices can be turned off?"

This mindset shift was profound. It's the same logic that powers generative AI. You provide a clear context, define your constraints, and ask a precise question to get a useful output. On the island, the "AI" was my own planning and the island's resources. The output was a sustainable, comfortable day.

This experience taught me that prompt engineering isn't just a technical skill; it's a life skill. It’s about understanding a system, defining your needs, and communicating them effectively to get the desired result, whether you're talking to a large language model or deciding when to do your laundry with solar power.`,
    imageUrl: 'https://firebasestorage.googleapis.com/v0/b/haloblocsept2025.firebasestorage.app/o/25.png?alt=media&token=4d8237a0-77e5-43b5-92bb-497dcbdfd6c7',
    tags: ['Off-Grid', 'Prompt Engineering', 'Palawan', 'Sustainability'],
  }
];


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

export type Currency = 'PHP' | 'USD' | 'EUR';

function App() {
  const [currency, setCurrency] = useState<Currency>('PHP');
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [view, setView] = useState<'main' | 'blog'>('main');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const savedPosts = localStorage.getItem('blogPosts');
      return savedPosts ? JSON.parse(savedPosts) : initialBlogPosts;
    } catch (error) {
      console.error("Error reading blog posts from localStorage", error);
      return initialBlogPosts;
    }
  });

  const [projectsData, setProjectsData] = useState<Record<string, ProjectData>>(() => {
    try {
      const savedData = localStorage.getItem('projectsData');
      if (savedData) {
        return JSON.parse(savedData);
      }
      const initialData: Record<string, ProjectData> = {};
      INITIAL_PROJECTS.forEach(project => {
          initialData[project.id] = getProjectData(project.id);
      });
      return initialData;
    } catch (error) {
      console.error("Error reading project data from localStorage", error);
      const initialData: Record<string, ProjectData> = {};
      INITIAL_PROJECTS.forEach(project => {
          initialData[project.id] = getProjectData(project.id);
      });
      return initialData;
    }
  });

  const allProjectsWeeklyTotals = useMemo(() =>
    calculateAllProjectsWeeklyTotals(projectsData),
    [projectsData]
  );

  useEffect(() => {
    try {
      localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    } catch (error) {
      console.error("Error saving blog posts to localStorage", error);
    }
  }, [blogPosts]);
  
  useEffect(() => {
    try {
        localStorage.setItem('projectsData', JSON.stringify(projectsData));
    } catch (error) {
        console.error("Error saving project data to localStorage", error);
    }
  }, [projectsData]);

  useEffect(() => {
    if (isPortalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isPortalOpen]);
  
  const MainContent = () => (
    <>
      <main>
        <HeroSection />
        <AnimatedSection>
          <AccreditationBanner />
        </AnimatedSection>
        <AnimatedSection>
          <ExecutiveSummary currency={currency} weeklyTotals={allProjectsWeeklyTotals} />
        </AnimatedSection>
        <AnimatedSection>
          <MarketAnalysis weeklyTotals={allProjectsWeeklyTotals} currency={currency} />
        </AnimatedSection>
        <AnimatedSection>
          <BusinessModel weeklyTotals={allProjectsWeeklyTotals} currency={currency} />
        </AnimatedSection>
        <AnimatedSection>
          <FinancialProjections currency={currency} weeklyTotals={allProjectsWeeklyTotals} />
        </AnimatedSection>
        <AnimatedSection>
          <RiskAssessment weeklyTotals={allProjectsWeeklyTotals} currency={currency} />
        </AnimatedSection>
        <AnimatedSection>
          <ActionPlan currency={currency} weeklyTotals={allProjectsWeeklyTotals} />
        </AnimatedSection>
        <AnimatedSection>
          <FundingInvestment currency={currency} weeklyTotals={allProjectsWeeklyTotals} />
        </AnimatedSection>
        <AnimatedSection>
          <ESG weeklyTotals={allProjectsWeeklyTotals} currency={currency} />
        </AnimatedSection>
        <AnimatedSection>
         <Contact />
        </AnimatedSection>
      </main>
      <Footer />
    </>
  );

  return (
    <div className="bg-white">
      <Header 
        selectedCurrency={currency} 
        setSelectedCurrency={setCurrency}
        onPortalButtonClick={() => setIsPortalOpen(true)}
        onBlogButtonClick={() => setView('blog')}
       />
       {view === 'main' ? (
         <MainContent />
       ) : (
         <BlogSection posts={blogPosts} onBack={() => setView('main')} />
       )}
      <Portal 
        isOpen={isPortalOpen} 
        onClose={() => setIsPortalOpen(false)}
        posts={blogPosts}
        setPosts={setBlogPosts}
        projectsData={projectsData}
        setProjectsData={setProjectsData}
      />
    </div>
  );
}

export default App;
