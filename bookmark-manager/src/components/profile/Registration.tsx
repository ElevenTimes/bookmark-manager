"use client";

import React, { useState } from "react";
import { Settings } from 'lucide-react'; // Import the Settings icon

const Registration = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleDarkMode = () => {
    const newMode = !document.documentElement.classList.contains("dark");
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
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
        <div className="mt-2 bg-[var(--background)] p-4">
          <h3 className="font-bold">Settings Options</h3>
          <button
            onClick={() => toggleDarkMode()}
          >
          black</button>
        </div>
      )}
    </div>
  );
};

export default Registration;



