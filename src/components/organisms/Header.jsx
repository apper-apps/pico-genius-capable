import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Header = () => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Content Generator", href: "/content", icon: "Wand2" },
    { name: "Topic Clusters", href: "/clusters", icon: "Network" },
    { name: "Query Tools", href: "/query-tools", icon: "Search" },
    { name: "Analytics", href: "/analytics", icon: "BarChart3" }
  ]

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center">
              <ApperIcon name="Zap" className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">SEO Genius</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                             (item.href === "/content" && location.pathname === "/")
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-primary-400 bg-primary-500/10"
                      : "text-gray-300 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Desktop Action Button */}
          <div className="hidden md:block">
            <Button size="small" icon="Plus">
              New Project
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none focus:text-white transition-colors duration-200"
            >
              <ApperIcon 
                name={mobileMenuOpen ? "X" : "Menu"} 
                className="w-6 h-6" 
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4 animate-fade-in">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href ||
                               (item.href === "/content" && location.pathname === "/")
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-primary-400 bg-primary-500/10"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Button size="small" icon="Plus" className="w-full">
                New Project
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header