export default function LegalPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-8 space-y-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Mentions Légales & Confidentialité
            </h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">1. Éditeur du Site</h2>
                <p className="text-muted-foreground">
                    Ce site est édité par la Maison des Lycéens (MDL) du lycée [Nom du Lycée].<br />
                    Association loi 1901.<br />
                    Adresse : [Adresse du Lycée]<br />
                    Contact : mdl@example.com
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">2. Hébergement</h2>
                <p className="text-muted-foreground">
                    Le site est hébergé par [Nom de l'hébergeur] (ex: Vercel, OVH).<br />
                    Adresse : [Adresse de l'hébergeur]
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">3. Données Personnelles (RGPD)</h2>
                <p className="text-muted-foreground">
                    Conformément au Règlement Général sur la Protection des Données (RGPD), nous nous engageons à protéger vos données personnelles.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                    <li><b>Collecte :</b> Nous collectons uniquement les données nécessaires au fonctionnement de l'annuaire (Nom, Prénom, Email, Promo, Profession).</li>
                    <li><b>Finalité :</b> Mise en relation des anciens élèves et communication de la MDL.</li>
                    <li><b>Durée :</b> Les données sont conservées tant que l'utilisateur ne demande pas leur suppression.</li>
                    <li><b>Droits :</b> Vous disposez d'un droit d'accès, de rectification et suppression. Contactez l'admin pour l'exercer.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">4. Cookies</h2>
                <p className="text-muted-foreground">
                    Ce site utilise uniquement des cookies de session techniques nécessaires à l'authentification. Aucun traceur publicitaire n'est utilisé.
                </p>
            </section>
        </div>
    );
}
