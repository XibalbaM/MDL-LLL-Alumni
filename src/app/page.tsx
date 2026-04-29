'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get('username');
    const password = formData.get('password');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Login failed');
      setLoading(false);
    } else {
      router.push(data.redirect);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8 transform transition-all hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Livre des anciens</h1>
          <p className="text-muted-foreground mt-2">Du lycée Louis Lachenal</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm text-center p-3 rounded-md mb-6 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Nom d'utilisateur</label>
            <input
              name="username"
              type="text"
              required
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none"
              placeholder="prénom.nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-foreground/80">Mot de passe</label>
            <input
              name="password"
              type="password"
              required
              className="w-full bg-input border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-ring focus:border-transparent transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>

          <button
            type="button"
            onClick={() => setShowFirstLoginModal(true)}
            className="w-full bg-secondary text-secondary-foreground font-semibold py-2.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-md"
          >
            Première connection
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <a href="/contact" className="hover:underline hover:text-primary transition-colors">Problème de connexion ? Contactez le support</a>
        </div>
      </div>

      {/* First Login Modal */}
      {showFirstLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Première connection</h2>
              <button
                onClick={() => setShowFirstLoginModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors text-2xl font-light"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-foreground/80">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Vos identifiants</h3>
                <p>Votre nom d'utilisateur est : <span className="font-mono text-primary">prénom.nom</span></p>
                <p className="mt-1">Votre mot de passe initial a été envoyé par email.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Comment accéder ?</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Entrez votre nom d'utilisateur</li>
                  <li>Entrez le mot de passe reçu par email</li>
                  <li>Cliquez sur "Se connecter"</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Problème ?</h3>
                <p>Si vous ne recevez pas vos identifiants ou avez des questions, <a href="/contact" className="text-primary hover:underline">contactez le support</a>.</p>
              </div>
            </div>

            <button
              onClick={() => setShowFirstLoginModal(false)}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-md mt-6"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
