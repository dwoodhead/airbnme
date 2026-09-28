'use client'

import { useEffect, useState } from 'react'

type Photo = { src: string; alt: string }

// "Show all photos" button for the desktop grid, which only has room for five
export default function AllPhotos({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute bottom-4 right-4 rounded-lg border border-[#222] bg-white px-4 py-1.5 text-sm font-semibold hover:bg-[#f7f7f7]"
      >
        ▦ Show all {photos.length} photos
      </button>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-white" role="dialog" aria-modal="true" aria-label="All photos">
          <div className="sticky top-0 flex items-center border-b border-border bg-white px-6 py-4">
            <button
              type="button"
              autoFocus
              onClick={() => setOpen(false)}
              aria-label="Close photos"
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl hover:bg-[#f0f0f0]"
            >
              ✕
            </button>
          </div>
          <div className="mx-auto max-w-3xl space-y-3 px-6 py-8">
            {photos.map((p) => (
              <img key={p.src} src={p.src} alt={p.alt} loading="lazy" className="w-full rounded-lg" />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
