"use client";

import { Button } from "@/components/ui/button";
import { ChromeIcon as Google } from "lucide-react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useLoginMutation } from "@/store/features/api/authApi";
import { useRouter } from "next/navigation";

export default function SignInButton() {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const handleSignIn = async () => {
    // Implement Google Sign-In logic here
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await login({
        email: user.email,
        name: user.displayName,
      }).unwrap();
      router.replace("/organizations");
    } catch (error) {
      console.error(error);
    } finally {
      await auth.signOut();
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="flex items-center space-x-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
    >
      <Google className="w-5 h-5" />
      <span>Sign in with Google</span>
    </Button>
  );
}
