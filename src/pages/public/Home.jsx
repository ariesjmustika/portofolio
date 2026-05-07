import React from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import Experience from '../../components/Experience';
import Skills from '../../components/Skills';
import Projects from '../../components/Projects';
import Explorations from '../../components/Explorations';
import Contact from '../../components/Contact';
import ThemeSwitcher from '../../components/ThemeSwitcher';
import BackgroundAnimation from '../../components/BackgroundAnimation';

const Home = () => {
  return (
    <>
      <BackgroundAnimation />
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <Explorations />
      </main>
      <Contact />
      <ThemeSwitcher />
    </>
  );
};

export default Home;
