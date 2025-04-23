"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Crunch
        </h1>
        <p className="text-2xl">Your personal restaurant journal</p>
        
        <form action={isLogin ? login : signup} className="flex flex-col gap-4 w-full max-w-md">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="bg-white/10 text-white"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="bg-white/10 text-white"
          />
          <Button type="submit" className="w-full">
            {isLogin ? "Login" : "Sign Up"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="text-white/80 hover:text-white"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </Button>
        </form>
      </div>
    </main>
  );
}
