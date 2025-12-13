export default function MailingPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Mass Mailing Tool</h1>

            <div className="bg-card border border-border p-8 rounded-lg shadow-sm">
                <form action="/api/admin/mailing" method="post" className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Target Audience</label>
                            <select name="target" className="w-full bg-input border border-border rounded px-3 py-2">
                                <option value="all">All Users</option>
                                <option value="promo">Specific Promo (enter year below)</option>
                                <option value="admins">Admins Only</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Promo Year (if applicable)</label>
                            <input type="number" name="promo" placeholder="e.g. 2023" className="w-full bg-input border border-border rounded px-3 py-2" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Subject</label>
                        <input required name="subject" className="w-full bg-input border border-border rounded px-3 py-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Message Content</label>
                        <textarea required name="content" rows={8} className="w-full bg-input border border-border rounded px-3 py-2 font-mono text-sm"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-red-800 text-white py-3 rounded-lg font-bold hover:bg-red-900 flex items-center justify-center gap-2">
                        <span>✉️</span> Send Broadcast
                    </button>
                </form>
            </div>
        </div>
    );
}
