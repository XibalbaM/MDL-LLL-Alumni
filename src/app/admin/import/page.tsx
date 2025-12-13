export default function ImportPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Importer des Utilisateurs (CSV)</h1>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-yellow-800 text-sm">
                <b>Attention :</b> Assurez-vous que le fichier CSV suit le format :
                <code className="bg-white px-2 py-0.5 rounded mx-1">Prénom,Nom,Email,DDN(JJ/MM/AAAA),Promo</code>
                <div className="mt-2">Les mots de passe seront automatiquement définis sur la date de naissance.</div>
            </div>

            <div className="bg-card border border-border p-8 rounded-lg shadow-sm">
                <form action="/api/admin/import" method="post" encType="multipart/form-data" className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Sélectionner le fichier CSV</label>
                        <input type="file" name="file" accept=".csv" required className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:bg-primary/90"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:brightness-110">
                        Lancer l'import
                    </button>
                </form>
            </div>
        </div>
    );
}
