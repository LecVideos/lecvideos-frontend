"use client"; // Needed for client-side rendering in Next.js (app directory)

import React, { useState } from "react";
import Login from "@/app/auth/login";
import Signup from "@/app/auth/signup";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Signup

  return (
    <div className="flex flex-col flex-1">
      {isLogin ? (
        <Login switchToSignup={() => setIsLogin(false)} /> // Pass prop to toggle state
      ) : (
        <Signup switchToLogin={() => setIsLogin(true)} /> // Pass prop to toggle state
      )}
    </div>
  );
}
