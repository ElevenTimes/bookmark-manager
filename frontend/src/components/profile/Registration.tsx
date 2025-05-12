"use client";

import React, { useState, useEffect } from "react";
import { Settings } from 'lucide-react'; // Import the Settings icon

const Registration = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);

  // Checks if current theme is dark or not
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "true" || (!savedTheme && prefersDark);
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !document.documentElement.classList.contains("dark");
    if (newMode) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
    localStorage.setItem("darkMode", newMode.toString());
  };

  
  return (
    <div className={`flex flex-col ${settingsOpen ? "h-auto" : "h-40"} p-4 border-b-4 border-[var(--border)]`}>
      <h2 className="text-lg font-bold">Profile</h2>

      <h3>Username</h3>
      
      {/* Settings Button */}
      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="flex items-center justify-center bg-transparent rounded pt-12"
      >
        <h2 className="text-lg font-bold pr-2">Settings</h2>
        <Settings size={24} className="text-[var(--foreground)]" />
      </button>


      {/* Settings Panel */}
      {settingsOpen && (
        <div className="flex flex-col mt-2 relative border-2 border-[var(--border)] rounded-md shadow-md cursor-pointer">
          <button className="hover:bg-[--background] p-2"
            onClick={() => toggleDarkMode()}
          >
          {isDarkMode ? "Light theme" : "Dark theme"}
          </button>
          <button className="hover:bg-[--background] p-2"
          >
          Register</button>
        </div>
        
      )}
    </div>
  );
};

export default Registration;



