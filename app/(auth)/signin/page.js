"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInPage() {
  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
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
            Welcome to NomadBase
          </h1>

          {/* Subtext */}
          <p className="text-[16px] leading-[1.50] text-[#898989] text-center mb-12" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            Discover colivings, review spaces, and connect with digital nomads around the world.
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#fafafa] text-[#0f0f0f] rounded-full font-medium hover:bg-[#efefef] transition-all hover:scale-[1.02] active:scale-[0.98] mb-6"
            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Benefits */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3 text-[#898989] text-sm" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              <div className="w-5 h-5 rounded-full bg-[#3ecf8e]/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-[#3ecf8e]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span>Quick and secure sign-in</span>
            </div>
            <div className="flex items-center gap-3 text-[#898989] text-sm" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              <div className="w-5 h-5 rounded-full bg-[#3ecf8e]/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-[#3ecf8e]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span>No password to remember</span>
            </div>
            <div className="flex items-center gap-3 text-[#898989] text-sm" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              <div className="w-5 h-5 rounded-full bg-[#3ecf8e]/20 flex items-center justify-center">
                <svg className="w-3 h-3 text-[#3ecf8e]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </div>
              <span>Access to all features instantly</span>
            </div>
          </div>

          {/* Terms text */}
          <p className="text-[12px] leading-[1.33] text-[#898989] text-center" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
            By continuing, you agree to our{" "}
            <Link href="/terms" className="text-[#3ecf8e] hover:underline">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-[#3ecf8e] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
