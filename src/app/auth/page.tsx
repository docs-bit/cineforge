"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Check, Film, ShieldCheck, Sparkles } from "lucide-react";
import { login as apiLogin, register as apiRegister } from "@/lib/api";
import { defaultSession, saveSession } from "@/lib/foundation";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("alex@cineforge.ai");
  const [name, setName] = useState("Alex Rivera");
  const [password, setPassword] = useState("cineforge-demo");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const startSession = async () => {
    setBusy(true);
    setMessage("");
    try {
      if (process.env.NEXT_PUBLIC_API_URL) {
        const response = mode === "signin" ? await apiLogin(email, password) : await apiRegister(email, password);
        if (response.user?.email) saveSession({ ...defaultSession, name: name || "Alex Rivera", email: response.user.email });
      } else {
        saveSession({ ...defaultSession, name: name || "Alex Rivera", email });
      }
      setMessage(mode === "signin" ? "Session restored. Your workspace is ready." : "Workspace created. Welcome to CineForge.");
    } catch {
      if (process.env.NEXT_PUBLIC_API_URL) setMessage("Unable to authenticate. Check your credentials or API status.");
      else {
        saveSession({ ...defaultSession, name: name || "Alex Rivera", email });
        setMessage("API is not configured. A local demo session was created instead.");
      }
    } finally {
      setBusy(false);
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startSession();
  };

  return <main className="min-h-screen bg-background text-foreground"><div className="grid min-h-screen lg:grid-cols-[1fr_480px]"><section className="relative hidden overflow-hidden border-r border-border bg-[#08110b] lg:flex lg:flex-col lg:justify-between p-12"><div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" /><div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[140px]" /><Link href="/" className="relative z-10 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold font-heading text-sm font-bold text-black">CF</span><span className="font-heading text-lg font-semibold">CineForge</span></Link><div className="relative z-10 max-w-xl"><p className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-gold"><Sparkles size={14} /> AI production workspace</p><h1 className="font-heading text-6xl leading-[1.05] tracking-[-0.04em] text-white">Make the impossible feel <span className="text-gold">directable.</span></h1><p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">One workspace for characters, camera, storyboards, ad concepts, and the generation jobs that bring them to life.</p><div className="mt-9 grid grid-cols-3 gap-3"><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><Film size={16} className="text-gold" /><p className="mt-4 text-xl font-semibold text-white">8</p><p className="mt-1 text-[10px] text-white/40">creative tools</p></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><ShieldCheck size={16} className="text-emerald-300" /><p className="mt-4 text-xl font-semibold text-white">1</p><p className="mt-1 text-[10px] text-white/40">trusted workspace</p></div><div className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><Sparkles size={16} className="text-violet-300" /><p className="mt-4 text-xl font-semibold text-white">∞</p><p className="mt-1 text-[10px] text-white/40">iterations</p></div></div></div><p className="relative z-10 text-[10px] text-white/25">© 2026 CineForge AI · Built for directors, creators, and teams.</p></section><section className="flex items-center justify-center p-6 sm:p-10"><div className="w-full max-w-[380px]"><Link href="/" className="flex items-center gap-2 lg:hidden"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold font-heading text-xs font-bold text-black">CF</span><span className="font-heading text-lg font-semibold">CineForge</span></Link><div className="mt-12 sm:mt-0"><p className="text-xs uppercase tracking-[0.18em] text-gold">{mode === "signin" ? "Welcome back" : "Start creating"}</p><h2 className="mt-3 font-heading text-3xl font-semibold">{mode === "signin" ? "Enter your workspace." : "Create your studio."}</h2><p className="mt-2 text-sm text-muted-foreground">{mode === "signin" ? "Sign in to continue directing your next project." : "Your first project starts with a blank canvas and a point of view."}</p></div><form onSubmit={submit} className="mt-8 space-y-4">{mode === "signup" && <label className="block"><span className="mb-1.5 block text-xs font-medium text-foreground/75">Your name</span><input value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-md border border-input bg-card px-3 py-3 text-sm outline-none transition focus:border-gold" placeholder="Alex Rivera" /></label>}<label className="block"><span className="mb-1.5 block text-xs font-medium text-foreground/75">Email address</span><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-md border border-input bg-card px-3 py-3 text-sm outline-none transition focus:border-gold" /></label><label className="block"><div className="mb-1.5 flex items-center justify-between"><span className="text-xs font-medium text-foreground/75">Password</span>{mode === "signin" && <button type="button" className="text-[10px] text-gold hover:text-gold-hover">Forgot password?</button>}</div><input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-md border border-input bg-card px-3 py-3 text-sm outline-none transition focus:border-gold" /></label><button type="submit" className="flex w-full items-center justify-center gap-2 rounded-md bg-gold py-3 text-sm font-semibold text-black hover:bg-gold-hover">{busy ? "Connecting…" : mode === "signin" ? "Sign in" : "Create account"} <ArrowRight size={15} /></button></form>{message && <p className="mt-4 flex items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2.5 text-xs text-emerald-300"><Check size={14} />{message} <Link href="/dashboard" className="ml-auto underline">Open</Link></p>}<div className="my-7 flex items-center gap-3 text-[10px] text-muted-foreground"><span className="h-px flex-1 bg-border" />or continue with<span className="h-px flex-1 bg-border" /></div><button type="button" onClick={startSession} className="w-full rounded-md border border-border bg-card py-3 text-xs font-medium text-foreground/75 hover:bg-surface-hover">Continue with Google</button><p className="mt-7 text-center text-xs text-muted-foreground">{mode === "signin" ? "New to CineForge?" : "Already have an account?"} <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMessage(""); }} className="font-medium text-gold hover:text-gold-hover">{mode === "signin" ? "Create an account" : "Sign in"}</button></p><p className="mt-8 text-center text-[10px] leading-relaxed text-muted-foreground/60">By continuing, you agree to our Terms of Service and acknowledge our Privacy Policy.</p></div></section></div></main>;
}
