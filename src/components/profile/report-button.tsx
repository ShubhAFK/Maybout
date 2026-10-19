'use client';

import { useState } from 'react';

export function ReportButton({ profileId }: { profileId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profileId, reason, details, reporter_email: email }),
    });
    setSubmitted(true);
    setLoading(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Report this profile
      </button>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-border p-4 text-sm text-center">
        <p className="font-medium">Report submitted</p>
        <p className="text-muted-foreground mt-1">We will review this profile.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border border-border p-4 space-y-3">
      <p className="font-medium text-sm">Report this profile</p>
      <select
        required
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">Select a reason</option>
        <option value="impersonation">Impersonation</option>
        <option value="harassment">Harassment</option>
        <option value="fake_profile">Fake profile</option>
        <option value="privacy">Privacy concern</option>
        <option value="spam">Spam</option>
        <option value="other">Other</option>
      </select>
      <textarea
        placeholder="Details (optional)"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none"
      />
      <input
        type="email"
        placeholder="Your email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg border border-border py-2 text-sm hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !reason}
          className="flex-1 rounded-lg bg-destructive py-2 text-sm text-white hover:bg-destructive/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}
