'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function AdminPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin');
      if (!res.ok) {
        setError('Forbidden or unauthorized');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setReports(data.reports || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleAction(reportId: string, profileId: string, action: string) {
    await fetch('/api/admin', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report_id: reportId, profile_id: profileId, action }),
    });
    setReports(reports.map((r) => r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'reviewed' } : r));
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading admin panel...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-destructive font-medium">{error}</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-2xl font-bold mb-6">Admin Reports Queue</h1>

          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((r) => (
                <div key={r.id} className="rounded-xl border border-border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold uppercase text-xs px-2 py-0.5 rounded bg-muted">
                        {r.reason}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Status: <strong className="capitalize">{r.status}</strong>
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      Profile: <a href={`/${r.profiles?.slug}`} target="_blank" className="text-accent underline">{r.profiles?.full_name} ({r.profiles?.slug})</a>
                    </p>
                    {r.details && <p className="text-sm text-muted-foreground mt-1">{r.details}</p>}
                    <p className="text-xs text-muted-foreground mt-2">Reported at: {new Date(r.created_at).toLocaleString()}</p>
                  </div>

                  {r.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(r.id, r.profile_id, 'dismiss')}
                        className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-muted transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleAction(r.id, r.profile_id, 'unpublish')}
                        className="rounded-lg bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 transition-colors"
                      >
                        Unpublish
                      </button>
                      <button
                        onClick={() => handleAction(r.id, r.profile_id, 'delete')}
                        className="rounded-lg bg-destructive px-4 py-2 text-xs font-medium text-white hover:bg-destructive/90 transition-colors"
                      >
                        Delete profile
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No reports found.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
