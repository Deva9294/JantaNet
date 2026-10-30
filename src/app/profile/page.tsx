import Link from "next/link";
import { redirect } from "next/navigation";
import { RadioTower, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import SignOutButton from "./sign-out-button";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <main className="profile-page">
      <header className="site-header"><nav className="container nav"><Link className="brand" href="/"><span className="brand-mark"><RadioTower size={21} /></span><span>Janta<span className="gradient-text">Net</span></span></Link><SignOutButton /></nav></header>
      <section className="container profile-content">
        <span className="eyebrow"><ShieldCheck size={14} /> YOUR ACCOUNT</span>
        <h1>Welcome, {user.name}</h1>
        <p className="hero-copy">Your JantaNet identity is ready. More community features will arrive in upcoming phases.</p>
        <div className="profile-card">
          <div className="avatar">{user.name.slice(0, 1).toUpperCase()}</div>
          <div><h2>{user.name}</h2><p>{user.email}</p><span className="role-pill">{user.role}</span></div>
        </div>
        <p className="profile-note">Profile editing, verification and account recovery are planned for the next identity milestone.</p>
      </section>
    </main>
  );
}
