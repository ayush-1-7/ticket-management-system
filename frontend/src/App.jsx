import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TicketProvider } from './context/TicketContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './components/Toast'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import CreateTicket from './pages/CreateTicket'
import TicketDetail from './pages/TicketDetail'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <TicketProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-dark-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[104px] pb-8">
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
