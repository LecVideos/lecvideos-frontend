"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetcher } from "@/lib/utilities";

interface LoginProps {
  switchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ switchToSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); 


  const login = async (e: React.FormEvent)=>{
    e.preventDefault()
  
    if (!email || !password) {
      alert("Please fill out all fields!");
      return;
    }
  
    // Construct payload
    const loginData = {email, password};
  
      try {
        const response = await apiFetcher(`${process.env.NEXT_PUBLIC_ServerHost}/user/login`, {
          method: "POST",
          body: JSON.stringify(loginData),
          headers: {
            "Content-Type": "application/json"
          }
        });
    
        if (response?.statusCode === 200) {
          console.log(response.responseData.user)
          //store user data in localStorage
          localStorage.setItem("userData", JSON.stringify(response.responseData.user));
          //redirect to dasboard
          router.push("/dashboard");
        } else {
          alert(response?.msg || "Login failed failed. Please try again.");
        }
      } catch (error) {
        console.log("Signup error:", error);
        //alert("Something went wrong. Please try again later.");
      }
  
  }




  return (
    <div className="flex-1 bg-blue-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-500 mb-6">Login</h1>
        <form className="space-y-4" onSubmit={login}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={switchToSignup}
            className="text-blue-500 hover:underline"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

