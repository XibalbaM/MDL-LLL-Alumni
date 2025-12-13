export default function ContactPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-md w-full bg-card p-8 rounded-xl border border-border shadow-lg text-center space-y-6">
                <h1 className="text-2xl font-bold">Problème de connexion ?</h1>
                <p className="text-muted-foreground">
                    Si vous n'arrivez pas à vous connecter (mot de passe oublié, compte non trouvé),
                    veuillez contacter l'équipe administrative de la MDL.
                </p>

                <div className="bg-muted p-4 rounded-lg">
                    <div className="text-sm font-semibold mb-1">Email de support</div>
                    <a href="mailto:support@mdl-lycee.fr" className="text-primary hover:underline text-lg">
                        support@mdl-lycee.fr
                    </a>
                </div>

                <div className="text-xs text-muted-foreground">
                    Merci d'indiquer votre Nom, Prénom et Année de Promotion dans votre message.
                </div>

                <a href="/" className="block text-sm text-primary hover:underline mt-8">
                    Retour à la connexion
                </a>
            </div>
        </div>
    );
}
