export default function ExportPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Exporter des Utilisateurs</h1>

            <div className="bg-card border border-border p-8 rounded-lg shadow-sm">
                <p className="mb-6 text-muted-foreground">
                    Cliquez sur le bouton ci-dessous pour télécharger un fichier CSV contenant la liste de tous les utilisateurs enregistrés (rôle USER).
                    <br />
                    Le format est compatible avec l'outil d'importation.
                </p>

                <a href="/api/admin/export" target="_blank" className="block w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:brightness-110">
                    Télécharger le CSV
                </a>
            </div>
        </div>
    );
}
