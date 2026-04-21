import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Contact from './components/Contact'
import ThemeSwitcher from './components/ThemeSwitcher'
import BackgroundAnimation from './components/BackgroundAnimation'
import './App.css'

function App() {
  return (
    <>
      <BackgroundAnimation />
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Projects />
      </main>
      <Contact />
      <ThemeSwitcher />
    </>
  )
}

export default App
