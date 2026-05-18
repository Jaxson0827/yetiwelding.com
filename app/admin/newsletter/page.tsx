'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ACCENT = '#c41e3a';

// ---------------------------------------------------------------------------
// Email preview — mirrors the exact branded template from buildBroadcastEmailHtml
// ---------------------------------------------------------------------------
function EmailPreview({ subject, body }: { subject: string; body: string }) {
  const paragraphs = body.split(/\n\n+/).filter((p) => p.trim());

  return (
    <div
      className="rounded overflow-hidden shadow-2xl text-sm"
      style={{ fontFamily: "Georgia, 'Times New Roman', serif", background: '#f4f2ef' }}
    >
      {/* Header */}
      <div
        style={{ background: '#1a1a1a', borderBottom: `3px solid ${ACCENT}` }}
        className="px-7 py-6"
      >
        <p
          className="m-0 uppercase tracking-widest"
          style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', letterSpacing: '0.2em' }}
        >
          Yeti Welding
        </p>
        <p
          className="mt-2 font-semibold leading-snug"
          style={{ fontSize: 20, color: '#ffffff', margin: '8px 0 0' }}
        >
          {subject || <span style={{ opacity: 0.35 }}>Your subject line…</span>}
        </p>
      </div>

      {/* Body */}
      <div className="px-7 pt-7 pb-4" style={{ background: '#ffffff' }}>
        {paragraphs.length > 0 ? (
          paragraphs.map((p, i) => (
            <p
              key={i}
              style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.65, color: '#2d2a26' }}
            >
              {p.split('\n').map((line, j, arr) => (
                <span key={j}>
                  {line}
                  {j < arr.length - 1 && <br />}
                </span>
              ))}
            </p>
          ))
        ) : (
          <p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.65, color: '#2d2a26', opacity: 0.35 }}>
            Your message will appear here…
          </p>
        )}

        <div className="mt-2 mb-7">
          <span
            className="inline-block font-semibold"
            style={{
              padding: '11px 20px',
              background: ACCENT,
              color: '#fff',
              fontSize: 13,
              borderRadius: 3,
              letterSpacing: '0.04em',
            }}
          >
            Read the blog
          </span>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-7 py-5"
        style={{ background: '#ffffff', borderTop: '1px solid #e8e4df' }}
      >
        <p style={{ margin: 0, fontSize: 11, lineHeight: 1.6, color: '#6b6560' }}>
          <span style={{ color: ACCENT }}>Unsubscribe</span> anytime. You&rsquo;re receiving this
          because you subscribed to Yeti Welding updates.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Confirmation modal
// ---------------------------------------------------------------------------
function ConfirmModal({
  count,
  sending,
  onCancel,
  onConfirm,
}: {
  count: number | null;
  sending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-md bg-[#111] border border-white/15 rounded-2xl p-8 shadow-2xl">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(196,30,58,.15)', border: `1.5px solid ${ACCENT}` }}
        >
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill={ACCENT} aria-hidden="true">
            <path d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75z" />
            <path d="M12 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Ready to send?</h2>
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          This will be delivered to{' '}
          <span className="text-white font-semibold">
            {count !== null ? `${count} subscriber${count !== 1 ? 's' : ''}` : 'all subscribers'}
          </span>
          . Broadcasts cannot be recalled once sent.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={sending}
            className="flex-1 py-3 rounded-lg border border-white/20 text-white/70 text-sm font-medium hover:bg-white/5 transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={sending}
            className="flex-1 py-3 rounded-lg text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: ACCENT }}
          >
            {sending ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Sending…
              </>
            ) : (
              'Confirm send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Success state
// ---------------------------------------------------------------------------
function SuccessPanel({
  broadcastId,
  subject,
  count,
  onReset,
}: {
  broadcastId: string;
  subject: string;
  count: number | null;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-20 max-w-md mx-auto">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(16,185,129,.12)', border: '1.5px solid rgba(16,185,129,.5)' }}
      >
        <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">Broadcast sent</h2>
      <p className="text-white/55 text-sm mb-1">
        &ldquo;{subject}&rdquo;
      </p>
      {count !== null && (
        <p className="text-white/40 text-xs mb-8">
          Delivered to {count} subscriber{count !== 1 ? 's' : ''}
        </p>
      )}

      <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 mb-8 text-left">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Broadcast ID</p>
        <p className="font-mono text-white/80 text-sm break-all">{broadcastId}</p>
        <p className="text-white/35 text-xs mt-2">
          View open &amp; click analytics in your{' '}
          <a
            href="https://resend.com/broadcasts"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-white/60 transition-colors"
          >
            Resend dashboard
          </a>
          .
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="px-8 py-3 border-2 rounded-lg text-sm font-semibold uppercase tracking-wide transition-colors hover:bg-white/5"
        style={{ borderColor: ACCENT, color: ACCENT }}
      >
        Compose another
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subscriber count badge
// ---------------------------------------------------------------------------
function SubscriberBadge({
  count,
  loading,
  error,
}: {
  count: number | null;
  loading: boolean;
  error: string | null;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full animate-pulse">
        <div className="w-2 h-2 rounded-full bg-white/20" />
        <div className="h-3 w-20 bg-white/10 rounded" />
      </div>
    );
  }
  if (error || count === null) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
      <span className="text-white/70 text-sm tabular-nums">
        <span className="text-white font-semibold">{count}</span> active subscriber{count !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function AdminNewsletterPage() {
  const [adminKey, setAdminKey] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const [count, setCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);
  const [countError, setCountError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ broadcastId: string; subject: string } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore key from sessionStorage
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem('admin-api-key') || '';
      if (stored) setAdminKey(stored);
    } catch {
      // ignore
    }
  }, []);

  const saveKey = useCallback(() => {
    try {
      window.sessionStorage.setItem('admin-api-key', adminKey);
    } catch {
      // ignore
    }
  }, [adminKey]);

  const fetchCount = useCallback(async (key: string) => {
    if (!key) return;
    setCountLoading(true);
    setCountError(null);
    try {
      const res = await fetch('/api/admin/newsletter', {
        headers: { 'x-admin-key': key },
        cache: 'no-store',
      });
      const data = await res.json() as { count?: number; error?: string };
      if (!res.ok) throw new Error(data.error || 'Failed to load count');
      setCount(data.count ?? null);
    } catch (e) {
      setCountError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setCountLoading(false);
    }
  }, []);

  const handleKeyBlur = useCallback(() => {
    saveKey();
    if (adminKey && count === null && !countLoading) {
      void fetchCount(adminKey);
    }
  }, [adminKey, count, countLoading, fetchCount, saveKey]);

  // Auto-fetch count once key is restored from sessionStorage
  useEffect(() => {
    try {
      const stored = window.sessionStorage.getItem('admin-api-key') || '';
      if (stored) void fetchCount(stored);
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const canSend = !!adminKey && !!subject.trim() && !!body.trim() && !sending;

  const handleSendClick = () => {
    setSendError(null);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setSending(true);
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json() as { success?: boolean; broadcastId?: string; error?: string };
      if (!res.ok) throw new Error(data.error || 'Send failed');
      setShowModal(false);
      setSuccess({ broadcastId: data.broadcastId!, subject });
    } catch (e) {
      setSendError(e instanceof Error ? e.message : 'Send failed');
      setShowModal(false);
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setSuccess(null);
    setSubject('');
    setBody('');
    setSendError(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const subjectLen = subject.length;
  const subjectCountColor =
    subjectLen > 78 ? 'text-red-400' : subjectLen > 60 ? 'text-amber-400' : 'text-white/30';

  return (
    <main className="min-h-screen bg-black">
      <Header />

      <section className="pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* ── Top bar ── */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-white/35 text-xs uppercase tracking-widest mb-1.5">Admin</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
                Newsletter
              </h1>
            </div>
            <SubscriberBadge count={count} loading={countLoading} error={countError} />
          </div>

          {success ? (
            <SuccessPanel
              broadcastId={success.broadcastId}
              subject={success.subject}
              count={count}
              onReset={handleReset}
            />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-8 items-start">

              {/* ── Left: Compose ── */}
              <div className="space-y-5">

                {/* Admin key */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <label className="block text-white/50 text-xs uppercase tracking-widest mb-3">
                    Admin key
                  </label>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    onBlur={handleKeyBlur}
                    placeholder="Paste your ADMIN_API_KEY"
                    className="w-full bg-black/40 border border-white/12 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c41e3a] focus-visible:border-transparent transition-colors"
                  />
                  {countError && (
                    <p className="text-red-400 text-xs mt-2">{countError} — check your key.</p>
                  )}
                </div>

                {/* Subject + Body */}
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
                  {/* Subject */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label
                        htmlFor="nl-subject"
                        className="text-white/50 text-xs uppercase tracking-widest"
                      >
                        Subject line
                      </label>
                      <span className={`text-xs tabular-nums font-mono ${subjectCountColor}`}>
                        {subjectLen}
                      </span>
                    </div>
                    <input
                      id="nl-subject"
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What's this email about?"
                      className="w-full bg-black/40 border border-white/12 rounded-lg px-4 py-3 text-white text-base placeholder:text-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c41e3a] focus-visible:border-transparent transition-colors"
                    />
                    {subjectLen > 60 && subjectLen <= 78 && (
                      <p className="text-amber-400/80 text-xs mt-1.5">
                        Long subjects may be clipped in Gmail ({'>'}60 chars).
                      </p>
                    )}
                    {subjectLen > 78 && (
                      <p className="text-red-400/80 text-xs mt-1.5">
                        Subject will likely be truncated ({'>'}78 chars).
                      </p>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/8" />

                  {/* Body */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label
                        htmlFor="nl-body"
                        className="text-white/50 text-xs uppercase tracking-widest"
                      >
                        Message body
                      </label>
                      <span className="text-white/25 text-xs">Double line break = new paragraph</span>
                    </div>
                    <textarea
                      id="nl-body"
                      ref={textareaRef}
                      value={body}
                      onChange={handleBodyChange}
                      placeholder={"Write your update here…\n\nDouble line breaks create new paragraphs in the email."}
                      rows={10}
                      className="w-full bg-black/40 border border-white/12 rounded-lg px-4 py-3 text-white text-sm leading-relaxed placeholder:text-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c41e3a] focus-visible:border-transparent transition-colors resize-none overflow-hidden"
                      style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', minHeight: 220 }}
                    />
                  </div>
                </div>

                {/* Error */}
                {sendError && (
                  <div className="flex items-start gap-3 bg-red-950/40 border border-red-500/30 rounded-xl px-5 py-4">
                    <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-200 text-sm">{sendError}</p>
                  </div>
                )}

                {/* Send button */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-white/30 text-xs">
                    Sends immediately to all active subscribers via Resend Audiences.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendClick}
                    disabled={!canSend}
                    className="flex items-center gap-2.5 px-7 py-3 rounded-lg text-white text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-35 disabled:cursor-not-allowed hover:brightness-110"
                    style={{ background: canSend ? ACCENT : '#6b6560' }}
                  >
                    Send broadcast
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── Right: Live preview ── */}
              <div className="sticky top-8">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-white/40 text-xs uppercase tracking-widest">Email preview</p>
                    <span className="text-white/20 text-xs">Updates live</span>
                  </div>
                  <EmailPreview subject={subject} body={body} />
                  <p className="text-white/25 text-xs mt-4 text-center">
                    Unsubscribe link is managed by Resend
                  </p>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      <Footer />

      {showModal && (
        <ConfirmModal
          count={count}
          sending={sending}
          onCancel={() => setShowModal(false)}
          onConfirm={() => void handleConfirm()}
        />
      )}
    </main>
  );
}
