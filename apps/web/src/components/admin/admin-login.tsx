"use client";

import Image from "next/image";
import { Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AdminAlert } from "./admin-alert";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "/api"}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), password: data.get("password") }),
      });
      if (!response.ok) throw new Error();
      const body = await response.json();
      sessionStorage.setItem("atlas_admin_token", body.accessToken);
      router.push("/admin");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-shell">
      <section className="admin-login-visual" aria-label="Bienvenue dans l’administration Atlas">
        <Image src="/images/admin-login-veterinaire.png" alt="Vétérinaire Atlas accompagnée d’un chien et d’un chat" fill priority sizes="(max-width: 760px) 100vw, 50vw" />
        <div className="admin-login-visual-shade" />
        <div className="admin-login-visual-copy"><span><ShieldCheck size={17} /> Espace sécurisé</span><h2>Pilotez votre cabinet en toute sérénité.</h2><p>Rendez-vous, messages et activité réunis dans un seul espace.</p></div>
      </section>
    <form className="admin-login-card" onSubmit={submit}>
      <Image src="/images/logo-atlas-circle.svg" alt="Logo du Cabinet Vétérinaire Atlas" width={68} height={68} />
      <span>Administration</span>
      <h1>Cabinet Atlas</h1>
      <p>Connectez-vous pour gérer les rendez-vous.</p>
      <label htmlFor="admin-email">Email</label>
      <input id="admin-email" name="email" type="email" required autoComplete="email" placeholder="votre@email.com" />
      <label htmlFor="admin-password">Mot de passe</label>
      <div className="admin-password-field">
        <input id="admin-password" name="password" type={showPassword ? "text" : "password"} required minLength={8} autoComplete="current-password" placeholder="Entrez votre mot de passe" />
        <button type="button" className="admin-password-toggle" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"} aria-pressed={showPassword} aria-controls="admin-password">
          {showPassword ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
        </button>
      </div>
      {error && <AdminAlert variant="error" message={error} onClose={() => setError("")} />}
      <button className="button button-primary" disabled={loading}><LockKeyhole size={17} />{loading ? "Connexion…" : "Se connecter"}</button>
    </form>
    </div>
  );
}
