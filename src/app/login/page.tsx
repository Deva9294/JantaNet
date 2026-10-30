import type { Metadata } from "next";
import Link from "next/link";
import { RadioTower, ShieldCheck } from "lucide-react";
import AuthForm from "./auth-form";

export const metadata: Metadata = {
  title: "Sign in or create an account",
  description: "Join JantaNet and connect with your community."
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link className="brand auth-brand" href="/">
          <span className="brand-mark"><RadioTower size={21} /></span>
          <span>Janta<span className="gradient-text">Net</span></span>
        </Link>
        <div className="auth-card">
          <span className="eyebrow"><ShieldCheck size={14} /> YOUR COMMUNITY, YOUR SPACE</span>
          <h1>Welcome to JantaNet</h1>
          <p className="auth-subtitle">Sign in or create your account to get started.</p>
          <AuthForm />
          <p className="auth-legal">By continuing, you agree to use JantaNet respectfully and follow our community safety rules.</p>
        </div>
        <Link className="auth-back" href="/">← Back to home</Link>
      </div>
    </main>
  );
}
