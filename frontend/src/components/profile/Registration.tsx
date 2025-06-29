"use client";

import React, { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { UserType } from "./User";
import { VIEWS, ViewType } from "../Views";

type RegistrationProps = {
  onRegister: (user: Omit<UserType, "username">) => void;
  onLogin: (user: Omit<UserType, "username">) => void;
  setView: (view: ViewType) => void;
  currentView: ViewType;
};

const Registration = ({ onRegister, onLogin, setView, currentView }: RegistrationProps) => {

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false); // Controls display of form

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  const isValidEmail = (email: string) => emailRegex.test(email);
  const isValidPassword = (password: string) => passwordRegex.test(password);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");



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

  const isFormComplete =
  email.trim() !== "" &&
  password.trim() !== "" &&
  isValidEmail(email) &&
  isValidPassword(password);


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

  function toggleView(currentView: ViewType, setView: (view: ViewType) => void, targetView: ViewType) {
    if (currentView === VIEWS.BOOKMARKS) {
      setView(targetView);
    } else {
      setView(VIEWS.BOOKMARKS);
    }
  }

  
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
            onChange={(e) => {
              const value = e.target.value;
              setEmail(value);
              setEmailError(isValidEmail(value) ? "" : "Invalid email format. Example: local-part@domain");
            }}

            className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded"
          />
          {emailError && <span className="text-red-500 text-sm">{emailError}</span>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              const value = e.target.value;
              setPassword(value);
              setPasswordError(
                isValidPassword(value)
                  ? ""
                  : "Password must be 8+ chars, include uppercase, lowercase, digit, and special character"
              );
            }}

            className="w-full p-2 bg-[var(--background)] border border-[var(--border)] rounded"
          />
          {passwordError && <span className="text-red-500 text-sm">{passwordError}</span>}

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

          {/* Theme toggle */}
          <button
            onClick={() => toggleView(currentView, setView, VIEWS.IMPORT_EXPORT)}
            className="hover:bg-[--background] p-2 rounded"
          >
            {currentView === VIEWS.BOOKMARKS ? "Import / Export" : "Bookmarks"}
          </button>

        </div>
      )}
    </div>
  );
};

export default Registration;




