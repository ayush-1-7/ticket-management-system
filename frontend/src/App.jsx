import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TicketProvider } from './context/TicketContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import CreateTicket from './pages/CreateTicket'
import TicketDetail from './pages/TicketDetail'
import ParticleBackground from './components/ui/ParticleBackground'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TicketProvider>
          <BrowserRouter>
            <div className="min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
              <ParticleBackground />
              <Navbar />
              <main className="relative z-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[104px] pb-12">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/create" element={<CreateTicket />} />
                  <Route path="/tickets/:id" element={<TicketDetail />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
        </TicketProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

