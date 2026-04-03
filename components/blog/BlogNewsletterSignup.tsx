'use client';

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile';

interface BlogNewsletterSignupProps {
  /** Injected from the server blog page so `.env.local` is read reliably (page shell is client-only). */
  turnstileSiteKey: string;
}

export default function BlogNewsletterSignup({ turnstileSiteKey }: BlogNewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const turnstileRef = useRef<TurnstileInstance>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const onTurnstileSuccess = useCallback((t: string) => setToken(t), []);
  const onTurnstileExpire = useCallback(() => setToken(null), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypotRef.current?.value) {
      setStatus('success');
      setMessage("You're signed up.");
      return;
    }
    if (!email.trim()) {
      setStatus('error');
      setMessage('Enter your email address.');
      return;
    }
    if (!token) {
      setStatus('error');
      setMessage('Wait a moment for verification, then try again.');
      return;
    }
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          turnstileToken: token,
          website: honeypotRef.current?.value || '',
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string; error?: string };
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong.');
        turnstileRef.current?.reset();
        setToken(null);
        return;
      }
      setStatus('success');
      setMessage(data.message || "Thanks — you're on the list.");
      setEmail('');
      turnstileRef.current?.reset();
      setToken(null);
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
      turnstileRef.current?.reset();
      setToken(null);
    }
  };

  return (
    <div className="border-t border-white/10 pt-8 mt-8">
      <p className="text-white/80 text-sm leading-relaxed mb-5">
        Get updates from the shop — project highlights, tips, and news straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} className="relative space-y-4">
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="absolute opacity-0 pointer-events-none h-0 w-0"
          aria-hidden="true"
        />
        <div>
          <label htmlFor="blog-newsletter-email" className="sr-only">
            Email address (required)
          </label>
          <input
            id="blog-newsletter-email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="Email address *"
            disabled={status === 'loading'}
            className="w-full bg-black/40 border border-white/15 rounded-sm px-3 py-2.5 text-white placeholder:text-white/35 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red disabled:opacity-60"
          />
        </div>

        {turnstileSiteKey ? (
          <div className="min-h-[70px]" data-turnstile-newsletter>
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              onSuccess={onTurnstileSuccess}
              onExpire={onTurnstileExpire}
              onError={() => setToken(null)}
              options={{ theme: 'dark' }}
            />
          </div>
        ) : (
          <p className="text-amber-200/80 text-xs">Newsletter verification is not configured.</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading' || !turnstileSiteKey}
          className="w-full sm:w-auto px-6 py-2.5 rounded-md border-2 border-accent-red bg-transparent text-accent-red font-semibold text-sm uppercase tracking-wide hover:bg-accent-red/10 transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 focus-visible:ring-offset-gray-warm-200"
        >
          {status === 'loading' ? 'Signing up…' : 'Sign me up'}
        </button>

        {message && (
          <p
            className={`flex items-start gap-2 text-sm ${status === 'error' ? 'text-red-300' : 'text-white/70'}`}
            role={status === 'error' ? 'alert' : 'status'}
          >
            {status === 'success' && (
              <span className="mt-0.5 shrink-0 text-emerald-400" aria-hidden="true">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
            <span>{message}</span>
          </p>
        )}
      </form>

      <p className="text-white/45 text-xs mt-4 leading-relaxed">
        We use your email only for shop updates you sign up for. See our{' '}
        <Link href="/privacy-policy" className="text-accent-red hover:text-accent-red-light underline-offset-2 hover:underline focus:outline-none focus-visible:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
