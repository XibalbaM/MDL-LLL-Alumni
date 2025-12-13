'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FirstLoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');
        const gdprConsent = formData.get('gdprConsent') === 'on';

        if (!gdprConsent) {
            setError("You must accept the terms to continue.");
            setLoading(false);
            return;
        }

        const res = await fetch('/api/first-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, gdprConsent }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || 'Something went wrong');
            setLoading(false);
        } else {
            router.push(data.redirect);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md bg-card border border-border rounded-lg shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-2 text-foreground">Bienvenue !</h1>
                <p className="text-muted-foreground mb-6">
                    Pour votre sécurité, veuillez mettre à jour vos informations pour activer votre compte.
                </p>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Personnel</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="vous@exemple.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nouveau Mot de Passe</label>
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={8}
                            className="w-full bg-input border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                        <input
                            name="gdprConsent"
                            type="checkbox"
                            required
                            id="gdpr"
                            className="mt-1"
                        />
                        <label htmlFor="gdpr" className="text-sm text-muted-foreground">
                            J'accepte que mes informations soient stockées pour le réseau des anciens, conformément au RGPD.
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Activation...' : 'Activer le Compte'}
                    </button>
                </form>
            </div>
        </div>
    );
}
