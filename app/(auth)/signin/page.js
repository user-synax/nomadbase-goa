"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign up with email/password
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create account");
        }

        // After successful signup, sign in the user
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Failed to sign in after signup");
        }

        router.push("/");
        router.refresh();
      } else {
        // Sign in with email/password
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error("Invalid email or password");
        }

        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#171717]">
      <div className="w-full max-w-md px-4">
        {/* Card */}
        <div className="bg-[#171717] border border-[#2e2e2e] rounded-[8px] p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="text-[#3ecf8e] text-[48px] font-bold" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              NomadBase
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[36px] leading-[1.25] font-normal text-[#fafafa] text-center mb-3" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>

          {/* Subtext */}
          <p className="text-[16px] leading-[1.50] text-[#898989] text-center mb-8" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {isSignUp 
              ? "Join NomadBase to review spaces, join the community, and connect with nomads."
              : "Sign in to review spaces, join the community, and connect with nomads."
            }
          </p>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-3 bg-[#2e2e2e] border border-[#3ecf8e] rounded-lg text-[#fafafa] text-sm text-center" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              {error}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder:text-[#898989] focus:border-[#3ecf8e] outline-none transition-colors"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-8 py-3 text-[#fafafa] bg-[#3ecf8e] hover:bg-[#3ecf8e]/90 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
            >
              {isLoading ? "Loading..." : (isSignUp ? "Sign Up" : "Sign In")}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#242424]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#171717] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                Or continue with
              </span>
            </div>
          </div>

          {/* Continue with Google button */}
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 px-8 py-3 bg-[#fafafa] text-[#0f0f0f] rounded-full font-medium hover:bg-[#efefef] transition-colors"
            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Toggle between Sign In / Sign Up */}
          <p className="text-[14px] leading-[1.43] text-[#898989] text-center mt-6" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#3ecf8e] hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>

          {/* Terms text */}
          <p className="text-[12px] leading-[1.33] text-[#898989] text-center mt-4" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            By {isSignUp ? "signing up" : "signing in"}, you agree to our{" "}
            <Link href="/terms" className="text-[#3ecf8e] hover:underline">
              terms
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
