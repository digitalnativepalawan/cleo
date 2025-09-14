

import React, { useState, useEffect, useMemo } from 'react';
import MainLayout from './src/layouts/MainLayout.tsx';
import HomePage from './src/pages/HomePage.tsx';
import BlogPage from './src/pages/BlogPage.tsx';
import Portal from './components/Portal.tsx';
import { getProjectData, calculateAllProjectsWeeklyTotals } from './src/lib/data.ts';
import type { ProjectData } from './src/types/portal.ts';
import type { Currency, BlogPost } from './src/types/index.ts';
import { INITIAL_PROJECTS } from './src/lib/data.ts';

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
    imageUrl: '/images/blog/learning-to-think-in-prompts.png',
    tags: ['Off-Grid', 'Prompt Engineering', 'Palawan', 'Sustainability'],
  }
];

function App() {
  const [currency, setCurrency] = useState<Currency>('PHP');
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [view, setView] = useState<'home' | 'blog'>('home');
  
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
  
  return (
    <div className="bg-[var(--bg-primary)]">
      <MainLayout
        selectedCurrency={currency}
        setSelectedCurrency={setCurrency}
        onPortalButtonClick={() => setIsPortalOpen(true)}
        onBlogButtonClick={() => setView('blog')}
        onHomeButtonClick={() => setView('home')}
      >
        {view === 'home' ? (
          <HomePage currency={currency} weeklyTotals={allProjectsWeeklyTotals} />
        ) : (
          <BlogPage posts={blogPosts} />
        )}
      </MainLayout>
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