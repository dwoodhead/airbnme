'use server'

import { createHash } from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(
  _prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const password = String(formData.get('password') ?? '')
  const sitePassword = process.env.SITE_PASSWORD

  if (!sitePassword || password !== sitePassword) {
    return 'Incorrect password.'
  }

  const token = createHash('sha256').update(sitePassword).digest('hex')
  const cookieStore = await cookies()
  cookieStore.set('airbnme_auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })

  // Only return to a page on this site: "//evil.com" or "/\\evil.com" would leave it
  const from = String(formData.get('from') ?? '/')
  redirect(/^\/(?![/\\])/.test(from) ? from : '/')
}
