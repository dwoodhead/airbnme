'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { loginAction } from './actions'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/'
  const [error, action, pending] = useActionState(loginAction, null)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f7f7] px-4">
      <a href="/" className="mb-8 flex items-center gap-1.5 text-[#ff385c]">
        <Logo />
        <span className="text-2xl font-bold tracking-tight">airbnme</span>
      </a>
      <div className="w-full max-w-sm rounded-2xl border border-[#ebebeb] bg-white p-8 shadow-[0_6px_16px_rgba(0,0,0,0.12)]">
        <h1 className="mb-1 text-xl font-semibold">Welcome back</h1>
        <p className="mb-6 text-sm text-[#6a6a6a]">Enter the password to access this site.</p>
        <form action={action}>
          <input type="hidden" name="from" value={from} />
          <label className="block">
            <span className="block text-[10px] font-bold uppercase tracking-wide">Password</span>
            <input
              type="password"
              name="password"
              autoFocus
              autoComplete="current-password"
              className="mt-1 w-full rounded-xl border border-[#b0b0b0] px-3 py-2.5 outline-none focus:border-[#222] focus:ring-1 focus:ring-[#222]"
            />
          </label>
          {error && <p className="mt-3 text-sm text-[#c13515]">{error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-4 w-full rounded-lg bg-gradient-to-r from-[#e61e4d] to-[#d70466] py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current" aria-hidden>
      <path d="M16 1c2 0 3.5 1.2 4.6 3.4l.3.6 7.8 15.9c1.9 4-.4 8.1-4.6 8.1-2.2 0-4.2-1.2-6.4-3.6l-1.7-1.9-1.7 1.9c-2.2 2.4-4.2 3.6-6.4 3.6-4.2 0-6.5-4.1-4.6-8.1L11 5l.3-.6C12.5 2.2 14 1 16 1zm0 20.2c-1.6-2-2.6-3.8-2.6-5.2 0-1.5 1.1-2.4 2.6-2.4s2.6.9 2.6 2.4c0 1.4-1 3.2-2.6 5.2z" />
    </svg>
  )
}
