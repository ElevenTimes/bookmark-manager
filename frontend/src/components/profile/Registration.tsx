"use client";

import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { UserType } from "./User";

type RegistrationProps = {
  onRegister: (user: Omit<UserType, "username">) => void;
  onLogin: (user: Omit<UserType, "username">) => void;
};

const Registration: React.FC<RegistrationProps> = ({}) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false); // Controls display of form

  // Handle theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = savedTheme === "true" || (!savedTheme && prefersDark);
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", newMode);
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
  };

  const isFormComplete = email.trim() !== "" && password.trim() !== "";

  const handleLogin = async () => {

  };

  const handleRegister = async () => {

  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAuthForm(false);
    setEmail("");
    setPassword("");
  };

  return (
    <div className="flex flex-col p-4 border-b-4 border-[var(--border)]">
      <h2 className="text-lg font-bold">Profile</h2>

      {/* Profile content */}
      {!showAuthForm && (
        <div className="mt-2">
          {currentUser ? (
            <span className="text-md">{currentUser}</span>
          ) : (
            <span className="text-md">Guest</span>
          )}
        </div>
      )}


      {/* Auth Form */}
      {!currentUser && showAuthForm && (
        <div className="flex flex-col mt-2 space-y-2">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded"
          />
          <div className="flex gap-2 w-64">
            <button
              onClick={handleRegister}
              disabled={!isFormComplete}
              className="bg-[var(--secondary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120 w-full"
            >
              Register
            </button>
            <button
              onClick={handleLogin}
              disabled={!isFormComplete}
              className="bg-[var(--primary)] text-[var(--primary-foreground)] p-2 rounded hover:brightness-120 w-full"
            >
              Log In
            </button>
          </div>
        </div>
      )}

      {/* Settings toggle */}
      <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="flex items-center justify-center bg-transparent rounded pt-6"
      >
        <h2 className="text-lg font-bold pr-2">Settings</h2>
        <Settings size={24} className="text-[var(--foreground)]" />
      </button>

      {/* Settings content */}
      {settingsOpen && (
        <div className="flex flex-col mt-2 border-2 border-[var(--border)] rounded-md shadow-md p-4 space-y-2">
          {/* Theme toggle */}
          <button onClick={toggleDarkMode} className="hover:bg-[--background] p-2 rounded">
            {isDarkMode ? "Light theme" : "Dark theme"}
          </button>

          {/* Auth action button inside settings */}
          {!currentUser ? (
            <button
              onClick={() => setShowAuthForm(!showAuthForm)}
              className="hover:bg-[--background] p-2 rounded"
            >
              Log In / Register
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="hover:bg-[--background] p-2 rounded"
            >
              Log Out
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Registration;




