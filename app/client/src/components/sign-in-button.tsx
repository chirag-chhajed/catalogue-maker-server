"use client";

import { Button } from "@/components/ui/button";
import { ChromeIcon as Google } from "lucide-react";

export default function SignInButton() {
  const handleSignIn = () => {
    // Implement Google Sign-In logic here
    console.log("Sign in with Google clicked");
  };

  return (
    <Button
      onClick={handleSignIn}
      className="flex items-center space-x-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
    >
      <Google className="w-5 h-5" />
      <span>Sign in with Google</span>
    </Button>
  );
}
