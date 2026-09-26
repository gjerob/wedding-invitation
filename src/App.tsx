import { useState, useEffect, useRef } from "react"
import { isSupabaseConfigured, supabase } from "./lib/supabase"

type ToastState = {
  title: string
  message: string
  type: "confirm" | "success" | "error"
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

function ToastHost({
  toast,
  onClose,
}: {
  toast: ToastState | null
  onClose: () => void
}) {
  if (!toast) return null

  return (
    <div className="fixed right-4 top-4 z-[60] w-[min(92vw,360px)]">
      <div className="toast-card rounded-xl border border-[#d4b896] bg-[#faf6f0]/95 p-4 shadow-xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#f2ebe0] text-[#4a3728]">
            {toast.type === "confirm" ? "!" : toast.type === "success" ? "✓" : "×"}
          </div>

          <div className="flex-1">
            <p className="font-display text-2xl italic text-[#4a3728] leading-none">
              {toast.title}
            </p>
            <p className="mt-2 font-body text-sm text-[#7a5c48] leading-relaxed">
              {toast.message}
            </p>

            {toast.type === "confirm" ? (
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    toast.onConfirm?.()
                    onClose()
                  }}
                  className="flex-1 bg-[#8e9e86] px-3 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-[#faf6f0] transition-colors hover:bg-[#f4e6b6] hover:text-[#3d453b]"
                >
                  {toast.confirmLabel ?? "Confirm"}
                </button>
                <button
                  onClick={() => {
                    toast.onCancel?.()
                    onClose()
                  }}
                  className="flex-1 border border-[#d4b896] bg-transparent px-3 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-[#4a3728] transition-colors hover:bg-[#f2ebe0]"
                >
                  {toast.cancelLabel ?? "Cancel"}
                </button>
              </div>
            ) : (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClose}
                  className="border border-[#d4b896] bg-transparent px-3 py-2 font-body text-[10px] uppercase tracking-[0.2em] text-[#4a3728] transition-colors hover:bg-[#f2ebe0]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handler)
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const links = [
    { label: "Our Story", href: "#story" },
    { label: "Wedding", href: "#wedding" },
    { label: "Dress Code", href: "#dress-code" },
    { label: "RSVP", href: "#rsvp" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-[#faf6f0]/95 backdrop-blur shadow-sm py-3"
          : "bg-transparent py-5"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <a
          href="#hero"
          className="font-display text-xl italic tracking-wide text-[#f0d7b0] hover:text-[#f9e7ce] transition-colors"
        >
          A &amp; CJ
        </a>

        <div className="hidden md:flex gap-8">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="nav-link text-[#f0d7b0] hover:text-[#f9e7ce]">
              {l.label}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-[#b89a6a] hover:text-[#d4b896] transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            {menuOpen ? (
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            ) : (
              <path strokeLinecap="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:hidden bg-[#faf6f0]/98 backdrop-blur overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-40 border-t border-[#e8dfd4]" : "max-h-0"
          }`}
      >
        <div className="flex flex-col gap-1 px-6 py-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="nav-link py-2"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

function CountdownToForever() {
  const weddingDate = new Date("2027-03-06T16:00:00")

  const getTimeLeft = (targetDate: Date) => {
    const difference = Math.max(targetDate.getTime() - Date.now(), 0)

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(weddingDate))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(weddingDate))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const countdownItems = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ]

  return (
    <div className="mt-10 w-full max-w-xl">
      <p className="mb-4 font-body text-[10px] uppercase tracking-[0.35em] text-[#f1d8a8]">
        Counting down to forever
      </p>

      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {countdownItems.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[#f1d8a8]/40 bg-[#1d120d]/35 px-2 py-4 backdrop-blur-[2px] shadow-[0_12px_30px_rgba(13,8,5,0.16)]"
          >
            <p className="font-display text-3xl font-light italic text-white md:text-4xl">
              {String(item.value).padStart(2, "0")}
            </p>
            <p className="mt-2 font-body text-[9px] uppercase tracking-[0.28em] text-[#f7e7cb]">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.volume = 0.25
    audio.loop = true
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [])

  const toggleMusic = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      try {
        await audio.play()
      } catch {
        setIsPlaying(false)
      }
    } else {
      audio.pause()
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <audio
        ref={audioRef}
        preload="auto"
        loop
        src="/0926.MP3"
      />

      <button
        type="button"
        aria-label={isPlaying ? "Pause music" : "Play music"}
        onClick={toggleMusic}
        className={`music-toggle ${isPlaying ? "is-playing" : ""}`.trim()}
      >
        <span className="music-toggle-icon" aria-hidden="true">
          <span className={`music-note ${isPlaying ? "is-playing" : "is-paused"}`}>
            {isPlaying ? "♪" : "❚❚"}
          </span>
        </span>
      </button>
    </div>
  )
}

function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/img/hero-bg.jpg"
          alt="Couple walking on a beach in the Philippines"
          className="hero-kenburns h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1a0e]/30 via-[#3b2416]/20 to-[#1a0e06]/70" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#faf6f0] to-transparent" />
      </div>

      <div className="hero-fade relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        <p className="mb-6 font-body text-xs uppercase tracking-[0.35em] text-[#f1d8a8]">
          Together Forever
        </p>

        <h1 className="mb-4 font-display font-light leading-[0.9] text-white">
          <span className="block text-5xl italic md:text-7xl lg:text-[7.5rem]">
            Aileen
          </span>
          <span className="my-3 block font-display text-4xl italic leading-none tracking-[0.08em] text-[#f3d9ae] md:text-5xl">
            &amp;
          </span>
          <span className="block text-5xl italic md:text-7xl lg:text-[7.5rem]">
            Christian Jade
          </span>
        </h1>

        <div className="my-8 flex w-56 items-center gap-4">
          <div className="h-px flex-1 bg-[#f1d8a8]/70" />
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#f1d8a8" opacity="0.9">
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
          </svg>
          <div className="h-px flex-1 bg-[#f1d8a8]/70" />
        </div>

        <div className="text-center">
          <p className="mb-1 font-display text-2xl font-light italic text-[#f7e7cb] md:text-3xl">
            March 06, 2027
          </p>
          <p className="font-body text-xs uppercase tracking-[0.25em] text-white/80">
            Tambis Road, JMPV Glad Subdivision,
            <br />
            Barangay Talungon, Bais City
          </p>
        </div>

        <CountdownToForever />

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <a
            href="#rsvp"
            className="inline-block border border-[#f1d8a8]/80 bg-[#f1d8a8]/10 px-8 py-3 font-body text-xs uppercase tracking-[0.25em] text-[#f1d8a8] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f1d8a8] hover:text-[#2a1a0e]"
          >
            RSVP
          </a>
          <a
            href="#story"
            className="font-body text-[10px] uppercase tracking-[0.25em] text-white/75 transition-colors duration-300 hover:text-[#f1d8a8]"
          >
            Our Story
          </a>
        </div>
      </div>

      <div className="hero-float absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d4b896" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

function WeddingDetails() {
  const details = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
      title: "The Date",
      line1: "March 06, 2027",
      line2: "Saturday · 4:00 PM",
      buttonLabel: "Add to Google Calendar",
      href:
        "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Aileen%20%26%20Christian%20Jade%20Wedding&details=Wedding%20celebration%20for%20Aileen%20and%20Christian%20Jade.&location=Feliz%20Hotel%20%26%20Events%2C%20Bais%20City%2C%20Philippines&dates=20270306T080000Z/20270306T120000Z",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z" />
          <circle cx="12" cy="9" r="2.5" />
        </svg>
      ),
      title: "The Venue",
      line1: "Feliz Hotel & Events",
      line2: "Bais City, Philippines",
      buttonLabel: "Open Map",
      href: "https://www.google.com/maps/search/?api=1&query=Feliz+Hotel+%26+Events+Bais+City+Philippines",
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
      title: "Reception",
      line1: "Feliz Hotel & Events",
      line2: "Bais City, Philippines",
      buttonLabel: "Open Map",
      href: "https://www.google.com/maps/search/?api=1&query=Feliz+Hotel+%26+Events+Bais+City+Philippines",
    },
  ]

  return (
    <section id="wedding" className="bg-[#f2ebe0] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-[#b89a6a] tracking-[0.3em] text-xs uppercase mb-3">
            Save the Date
          </p>
          <h2 className="font-display font-light text-[#4a3728] text-5xl md:text-6xl italic mb-6">
            Wedding Day
          </h2>
          <div className="divider-floral justify-center w-48 mx-auto">
            <span className="text-[#b89a6a] text-lg">✦</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {details.map((d, index) => (
            <Reveal key={d.title} delay={index * 120} className="h-full">
              <div className="bg-[#faf6f0] border border-[#e8dfd4] p-10 flex h-full flex-col items-center text-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(74,55,40,0.08)] hover:border-[#d4b896]">
                <div className="text-[#b89a6a]">{d.icon}</div>
                <h3 className="font-body tracking-[0.2em] text-xs uppercase text-[#7a5c48]">
                  {d.title}
                </h3>
                <div>
                  <p className="font-display text-[#4a3728] text-xl italic font-light">
                    {d.line1}
                  </p>
                  <p className="font-body text-[#7a5c48] text-sm mt-1">{d.line2}</p>
                </div>

                <a
                  href={d.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center justify-center border border-[#b89a6a] bg-[#f2ebe0] px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.22em] text-[#4a3728] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b89a6a] hover:text-[#faf6f0]"
                >
                  {d.buttonLabel}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function DressCode() {
  return (
    <section id="dress-code" className="bg-[#faf6f0] py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-body text-[#b89a6a] tracking-[0.3em] text-xs uppercase mb-3">
            Dress Code
          </p>
          <h2 className="font-display font-light text-[#4a3728] text-5xl md:text-6xl italic mb-6">
            Formal Elegance
          </h2>
          <div className="divider-floral justify-center w-48 mx-auto">
            <span className="text-[#b89a6a] text-lg">✦</span>
          </div>
        </div>

        <div className="bg-[#f2ebe0] border border-[#e8dfd4] p-8 md:p-12 text-center">
          <p className="font-display italic text-[#4a3728] text-3xl md:text-4xl mb-8">
            Garden Formal / Evening Chic
          </p>

          <div className="mb-8 flex w-full overflow-hidden rounded-full border border-[#d4b896]/80 bg-[#faf6f0] p-2 shadow-[0_10px_25px_rgba(74,55,40,0.03)]">
            <div className="h-16 flex-1 rounded-full bg-[#b3bae6]" />
            <div className="h-16 flex-1 rounded-full bg-[#feebc0]" />
            <div className="h-16 flex-1 rounded-full bg-[#feaaaa]" />
            <div className="h-16 flex-1 rounded-full bg-[#ffaf74]" />
            <div className="h-16 flex-1 rounded-full bg-[#b1ae81]" />
            <div className="h-16 flex-1 rounded-full bg-[#bbaccb]" />
          </div>

          <div className="mb-8 overflow-hidden rounded-[1.25rem] border border-[#d4b896]/80 bg-[#f8f3ed] shadow-[0_12px_28px_rgba(74,55,40,0.04)]">
            <img
              src="/img/dresscode.jpg"
              alt="Dress code placeholder"
              className="h-56 w-full object-cover bg-[linear-gradient(135deg,#f2ebe0,#ece0d1)] md:h-72"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-[#faf6f0] border border-[#e8dfd4] p-6">
              <p className="font-body tracking-[0.2em] text-[10px] uppercase text-[#b89a6a] mb-3">
                For Women
              </p>
              <p className="font-body text-[#7a5c48] text-sm leading-relaxed">
                Elegant gowns, refined midi dresses, or dressy chic separates in soft neutrals, jewel tones, or classic evening shades.
              </p>
            </div>

            <div className="bg-[#faf6f0] border border-[#e8dfd4] p-6">
              <p className="font-body tracking-[0.2em] text-[10px] uppercase text-[#b89a6a] mb-3">
                For Men
              </p>
              <p className="font-body text-[#7a5c48] text-sm leading-relaxed">
                Suit and tie, or a smart long-sleeve dress shirt with dress pants for a polished formal look.
              </p>
            </div>

            <div className="bg-[#faf6f0] border border-[#e8dfd4] p-6">
              <p className="font-body tracking-[0.2em] text-[10px] uppercase text-[#b89a6a] mb-3">
                Please Avoid
              </p>
              <p className="font-body text-[#7a5c48] text-sm leading-relaxed">
                White, ivory, or anything overly casual. We’d love to see everyone dressed in a graceful, celebratory style.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function OurStory() {
  const milestones = [
    {
      year: "2007",
      title: "First Meeting",
      body: "Their story began in 2007, when Aileen and Christian Jade first became classmates in the second grade. At that young age, Aileen already had her first little “puppy crush” on Jade, thanks in part to a dear friend who was also their classmate. What she didn’t know then was that the boy who became her childhood crush would one day become the love of her life.",
      // image: "/img/4years.JPG",
    },
    {
      year: "2015 - 2019",
      title: "Four Years of Friendship",
      body: "Years later, fate brought them together again as college classmates. For four years, they shared the same classroom, creating memories and growing alongside each other. Their relationship remained purely casual and friendly throughout college, never imagining that something more was waiting just around the corner.",
      // image: "/img/4years.JPG",
    },
    {
      year: "2019",
      title: "Making It Official",
      body: "Just days after graduation, everything changed. In a romantic setup filled with candlelight and rose petals at the top of Bahia Mountain in Dewey Island, Negros, Christian Jade finally asked Aileen to be his girlfriend. After years of knowing each other—from childhood classmates to college friends—the timing finally felt right. And just like that, their love story truly began.",
      // image: "/img/makingofficial.jpg",
    },
    {
      year: "2026",
      title: "The Proposal",
      body: "The day after they returned home from their Moalboal trip, an ordinary day at Aileen’s quiet home became one they would remember forever. With their beloved cat, Chaneyong, in his arms, Christian Jade got down on one knee and asked Aileen for her hand in marriage. In the comfort of their own home, surrounded by the simple familiarity of the life they had built together, he asked her to spend forever with him. And without hesitation, Aileen said yes.",
    },
  ]

  const [activeIndex, setActiveIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement | null>(null)

  const scrollToSlide = (index: number) => {
    const card = carouselRef.current?.children[index] as HTMLElement | undefined
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
    setActiveIndex(index)
  }

  return (
    <section id="story" className="bg-[#faf6f0] py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-[#b89a6a] tracking-[0.3em] text-xs uppercase mb-3">
            How It All Began
          </p>
          <h2 className="font-display font-light text-[#4a3728] text-5xl md:text-6xl italic mb-6">
            Our Story
          </h2>
          <div className="divider-floral justify-center w-48 mx-auto">
            <span className="text-[#b89a6a] text-lg">✦</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-10">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-[#d4b896]/40" />
            <img
              src="/img/our-story.jpg"
              alt="Couple walking through lush greenery"
              className="w-full h-[480px] object-cover relative z-10"
            />
          </div>
          <div>
            <div className="story-quote mb-6">
              <p className="font-display italic text-[#4a3728] text-2xl md:text-3xl font-light leading-relaxed">
                "Love is not just looking at each other, it's looking in the same direction."
              </p>
            </div>
            <p className="font-body text-[#7a5c48] leading-relaxed text-sm">
              Aileen and Christian Jade’s story began long before they became a couple. They first met as classmates in the second grade and crossed paths again years later as college classmates. What started as friendship and familiarity slowly grew into a love story rooted in trust, laughter, and the quiet comfort of choosing one another again and again.
            </p>
          </div>
        </div>

        <div className="story-carousel-wrap">
          <div className="story-carousel-frame">
            <div className="story-carousel" ref={carouselRef}>
              {milestones.map((m, index) => (
                <article
                  key={m.year}
                  className={`story-slide ${index === activeIndex ? "is-active" : ""}`}
                  onClick={() => scrollToSlide(index)}
                >
                  <div className="story-slide-inner">
                    <span className="story-year">{m.year}</span>

                    {m.image ? (
                      <div className="story-media">
                        <img src={m.image} alt={m.title} className="story-media-image" />
                      </div>
                    ) : null}

                    <h3 className="story-title">{m.title}</h3>
                    <p className="story-body">{m.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="story-nav">
            <button
              type="button"
              className="story-nav-button"
              onClick={() => setActiveIndex((prev) => {
                const next = prev === 0 ? milestones.length - 1 : prev - 1
                scrollToSlide(next)
                return next
              })}
              aria-label="Previous story"
            >
              ←
            </button>

            <div className="story-dots" aria-label="Story progress">
              {milestones.map((item, index) => (
                <button
                  key={`${item.title}-dot`}
                  type="button"
                  aria-label={`Go to ${item.title}`}
                  className={`story-dot ${index === activeIndex ? "is-active" : ""}`}
                  onClick={() => scrollToSlide(index)}
                />
              ))}
            </div>

            <button
              type="button"
              className="story-nav-button"
              onClick={() => setActiveIndex((prev) => {
                const next = prev === milestones.length - 1 ? 0 : prev + 1
                scrollToSlide(next)
                return next
              })}
              aria-label="Next story"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function GuestPhotoUpload({
  onUploadSuccess,
}: {
  onUploadSuccess?: () => void
}) {
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [qrUrl, setQrUrl] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    setQrUrl(`${window.location.origin}${window.location.pathname}#guest-photo-upload`)
  }, [])

  const handleUpload = async () => {
    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }

    if (!file) {
      setError("Please choose a photo to upload.")
      return
    }

    if (!supabase) {
      setError("Photo upload is not enabled yet. Add your Supabase URL and anon key.")
      return
    }

    setUploading(true)
    setError("")
    setSuccess("")

    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`
      const { error: uploadError } = await supabase.storage
        .from("guest-photos")
        .upload(fileName, file, { cacheControl: "3600", upsert: false })

      if (uploadError) {
        if (String(uploadError.message).toLowerCase().includes("row-level security")) {
          throw new Error(
            "Guest photo upload is blocked by Supabase RLS. Run the storage policies in supabase/schema.sql or create the 'guest-photos' bucket first.",
          )
        }

        throw uploadError
      }

      setSuccess("Thank you! Your photo has been uploaded for the couple to enjoy.")
      onUploadSuccess?.()
      setName("")
      setFile(null)
    } catch (uploadError) {
      console.error("Guest photo upload error:", uploadError)
      setError(
        uploadError instanceof Error && uploadError.message
          ? uploadError.message
          : "We could not upload your photo right now. Please try again in a moment.",
      )
    } finally {
      setUploading(false)
    }
  }

  return (
    <section id="guest-photo-upload" className="bg-[#faf6f0] px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.3em] text-[#b89a6a]">
            Shared Memories
          </p>
          <h2 className="mb-6 font-display text-5xl font-light italic text-[#4a3728] md:text-6xl">
            Wedding Day Photo Wall
          </h2>
          <div className="divider-floral mx-auto w-48 justify-center">
            <span className="text-lg text-[#b89a6a]">✦</span>
          </div>
        </div>

        <div className="grid gap-8 rounded-[2rem] border border-[#e8dfd4] bg-[#f2ebe0] p-6 md:grid-cols-[220px_1fr] md:p-10">
          <div className="flex flex-col items-center justify-center gap-4 rounded-[1.25rem] bg-[#faf6f0] p-6 text-center shadow-[0_12px_28px_rgba(74,55,40,0.04)]">
            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-[#7a5c48]">
              Scan to upload
            </p>
            {qrUrl ? (
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrUrl)}`}
                alt="QR code to upload wedding photos"
                className="h-36 w-36 rounded-xl border border-[#d4b896] bg-white p-2"
              />
            ) : null}
            <p className="font-body text-xs leading-relaxed text-[#7a5c48]">
              Scan this code to access the guest photo upload instantly.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-body text-[10px] uppercase tracking-[0.15em] text-[#7a5c48]">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border-b border-[#d4b896] bg-transparent py-3 font-body text-sm text-[#4a3728] placeholder-[#b89a6a]/60 focus:border-[#8c6e3f] focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block font-body text-[10px] uppercase tracking-[0.15em] text-[#7a5c48]">
                Upload your photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-[#7a5c48] file:mr-4 file:rounded-none file:border file:border-[#d4b896] file:bg-[#faf6f0] file:px-4 file:py-2 file:font-body file:text-[10px] file:uppercase file:tracking-[0.2em] file:text-[#4a3728] file:transition-colors hover:file:bg-[#f2ebe0]"
              />
            </div>

            {error ? <p className="font-body text-sm text-red-600">{error}</p> : null}
            {success ? <p className="font-body text-sm text-[#4a3728]">{success}</p> : null}

            <button
              type="button"
              disabled={uploading}
              onClick={handleUpload}
              className="inline-flex items-center justify-center border border-[#8e9e86] bg-[#8e9e86] px-6 py-3 font-body text-[10px] uppercase tracking-[0.25em] text-[#faf6f0] transition-colors duration-300 hover:bg-[#f4e6b6] hover:text-[#3d453b] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {uploading ? "Uploading..." : "Share my photo"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function GuestGallery({ refreshKey = 0 }: { refreshKey?: number }) {
  const [photos, setPhotos] = useState<Array<{ name: string; url: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!supabase) {
        setPhotos([])
        return
      }

      try {
        setLoading(true)
        setError("")

        const { data, error: listError } = await supabase.storage.from("guest-photos").list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        })

        if (listError) throw listError

        const gallery = (data ?? [])
          .filter((item) => item.name && !item.name.startsWith("."))
          .map((item) => ({
            name: item.name,
            url: supabase.storage.from("guest-photos").getPublicUrl(item.name).data.publicUrl,
          }))

        setPhotos(gallery)
      } catch (fetchError) {
        console.error("Guest gallery fetch error:", fetchError)
        setError("We couldn't load the guest photo gallery yet. Please check back soon.")
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [refreshKey])

  return (
    <section className="bg-[#faf6f0] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <p className="mb-3 font-body text-xs uppercase tracking-[0.3em] text-[#b89a6a]">
            Shared Memories
          </p>
          <h2 className="mb-6 font-display text-5xl font-light italic text-[#4a3728] md:text-6xl">
            Guest Photo Gallery
          </h2>
          <div className="divider-floral mx-auto w-48 justify-center">
            <span className="text-lg text-[#b89a6a]">✦</span>
          </div>
        </div>

        {!supabase ? (
          <div className="rounded-[1.5rem] border border-[#d4b896] bg-[#f2ebe0] p-8 text-center font-body text-sm text-[#7a5c48]">
            Connect Supabase to enable the guest photo gallery.
          </div>
        ) : loading ? (
          <div className="rounded-[1.5rem] border border-[#e8dfd4] bg-[#f2ebe0] p-8 text-center font-body text-sm text-[#7a5c48]">
            Loading photos...
          </div>
        ) : error ? (
          <div className="rounded-[1.5rem] border border-[#d4b896] bg-[#f2ebe0] p-8 text-center font-body text-sm text-red-600">
            {error}
          </div>
        ) : photos.length === 0 ? (
          <div className="rounded-[1.5rem] border border-[#e8dfd4] bg-[#f2ebe0] p-8 text-center font-body text-sm text-[#7a5c48]">
            No guest photos yet. Be the first to share a memory from our celebration.
          </div>
        ) : (
          <div className="photo-gallery">
            {photos.map((photo) => (
              <figure key={photo.name} className="photo-tile">
                <img src={photo.url} alt="Guest wedding memory" loading="lazy" />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const guestList = [
  "AJ Cadayuna",
  "Aljade Apostol",
  "Alju Cadayuna",
  "Alpha Venadas",
  "Alyssa Nasuli",
  "Angel Genobiagon",
  "Reymund Cadayday",
  "Arjie Genobiagon",
  "Catalina Barerra",
  "Chard Densky",
  "Christopher John Vergara",
  "Chrisel Baile",
  "Dave Arapoc",
  "Dave Delas Verlas",
  "Desie Abrasado",
  "Dwayne Pionela",
  "Eduardo Barrera",
  "Elmer Barerra",
  "Evelyn Verduzola",
  "Francis Zunega",
  "Fritz Am Colina",
  "Genoviva Barerra",
  "Grace Carnicer",
  "Ian Jade Abrasado",
  "Immanuel Genobiagon",
  "Jemmah Jane Venadas",
  "Jeremias Genobiagon",
  "Jeriel Genobiagon",
  "Jerobel Genobiagon",
  "Johnsent Verduzola",
  "Jomar Barerra",
  "Joy Barrera",
  "Joy Martinez",
  "Joyce Barerra",
  "Karil Tulop",
  "Maricel Zunega",
  "Maricho Bolado",
  "Mary Jane Cadayuna",
  "Melbert Barerra",
  "Nikki Densky",
  "Paul Anthony Barrera",
  "Peter Paul Barerra",
  "Reggie Cabugnason",
  "Reyden Carnicer",
  "Mars Pila",
  "Riza Barerra",
  "Robella Genobiagon",
  "Rodrigo Verduzola",
  "Rocio Cancino",
  "Sheila Mae Corong",
  "Elaicon Anana",
  "Jam Genobiagon",
  "Juryam Cadayuna",
  "Myles Carnicer",
  "Faye Marie Cabugnason",
  "Alphia Jemimah Venadas",
  "Carleen Bongabong",
  "Nikko Bongabong",
  "Ainie Abuso",
  "Isok Abuso",
  "Judilyn Naje",
  "Jun Dolormente",
  "Anthon Lie Kadile",
  "Bernadeth Manila Amiler",
  "Dangelyn Acero Solano",
  "Carlo Solano",
  "Dan Anthony Palagtiw",
  "Kayla Marie Palagtiw",
  "Evelyn Calumpang Benlot",
  "Benlot",
  "Rubie Acero",
  "Rubie's Husband",
  "Arleen",
  "Vince",
  "Rechie Rich Apostol",
  "Lauena Mae Pila",
  "Jeremias Queue",
  "Rosalie Calumpang",
  "Jean Mabido",
  "Mersha Rose",
  "Honey Pearl Reyes",
  "Patrick Salvanera",
  "Marilyn Genobiagon",
]

function RSVP() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    guests: "1",
    attendance: "attending",
    meal: "no-preference",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const normalizedName = form.name.trim()
      const nameMatchesGuestList = guestList.some(
        (guestName) => guestName.toLowerCase() === normalizedName.toLowerCase(),
      )

      if (!nameMatchesGuestList) {
        throw new Error("Please choose your name from the guest list.")
      }

      if (supabase) {
        const { error: insertError } = await supabase.from("rsvps").insert({
          name: normalizedName,
          email: form.email,
          guests: Number(form.guests),
          attendance: form.attendance,
          meal: form.meal,
          message: form.message || null,
        })

        if (insertError) {
          throw insertError
        }
      }

      setSubmitted(true)
    } catch (submitError) {
      console.error("RSVP submit error:", submitError)
      setError(
        submitError instanceof Error && submitError.message
          ? submitError.message
          : "We could not save your RSVP right now. Please try again in a moment.",
      )
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    "w-full bg-transparent border-b border-[#d4b896] py-3 text-[#4a3728] font-body text-sm placeholder-[#b89a6a]/60 focus:outline-none focus:border-[#8c6e3f] transition-colors duration-200"
  const labelClass =
    "block font-body tracking-[0.15em] text-[#7a5c48] text-xs uppercase mb-1"

  const normalizedQuery = form.name.trim()
  const filteredGuests = normalizedQuery
    ? guestList.filter((g) => {
        const q = normalizedQuery.toLowerCase()
        const gl = g.toLowerCase()
        if (gl === q) return true
        if (gl.startsWith(q)) return true
        const parts = gl.split(/\s+/)
        return parts.some((p) => p.startsWith(q))
      })
    : []
  const exactMatch = normalizedQuery
    ? guestList.find((g) => g.toLowerCase() === normalizedQuery.toLowerCase())
    : undefined

  return (
    <section id="rsvp" className="bg-[#f2ebe0] py-28 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-body text-[#b89a6a] tracking-[0.3em] text-xs uppercase mb-3">
            Join Us
          </p>
          <h2 className="font-display font-light text-[#4a3728] text-5xl md:text-6xl italic mb-6">
            RSVP
          </h2>
          <div className="divider-floral justify-center w-48 mx-auto mb-6">
            <span className="text-[#b89a6a] text-lg">✦</span>
          </div>
          <p className="font-body text-[#7a5c48] text-sm leading-relaxed">
            Please let us know by <strong className="font-medium text-[#4a3728]">November 14, 2026</strong> whether you'll be joining us for our special day.
          </p>

          <Reveal delay={120}>
            <div className="mt-8 border border-[#e8d9c7] bg-[#fbf7f2] px-6 py-5 shadow-[0_10px_30px_rgba(74,55,40,0.04)] transition-transform duration-300 hover:-translate-y-0.5">
              <div className="mb-3 flex items-center gap-3 text-[#b89a6a]">
                <span className="text-lg">❧</span>
                <p className="font-body tracking-[0.2em] text-[10px] uppercase text-[#b89a6a]">
                  Important Notes
                </p>
              </div>

              <div className="space-y-4 text-left italic text-[#5d4134]">
                <blockquote className="border-l border-[#d4b896] pl-4 text-sm leading-relaxed">
                  If we don't hear from you by then, we'll assume you're unable to attend so we can finalize our guest count. Thank you for understanding!
                </blockquote>

                <blockquote className="border-l border-[#d4b896] pl-4 text-sm leading-relaxed">
                  While we absolutely adore your little ones, we’ve chosen to make our wedding an adults-only celebration, with the exception of the children who are part of our entourage. We hope you’ll understand and take this as an opportunity to enjoy a well-deserved night out with us!
                </blockquote>

                <blockquote className="border-l border-[#d4b896] pl-4 text-sm leading-relaxed">
                  Due to our venue’s capacity, we’re only able to accommodate the guests listed on the invitation. We truly appreciate your understanding and hope you’ll understand our need to keep our celebration intimate and meaningful.
                </blockquote>
              </div>
            </div>
          </Reveal>

           <Reveal delay={120}>
            <div className="mt-8 border border-[#e8d9c7] bg-[#fbf7f2] px-6 py-5 shadow-[0_10px_30px_rgba(74,55,40,0.04)] transition-transform duration-300 hover:-translate-y-0.5">
              <div className="mb-3 flex items-center gap-3 text-[#b89a6a]">
                <span className="text-lg">❧</span>
                <p className="font-body tracking-[0.2em] text-[10px] uppercase text-[#b89a6a]">
                  A Note on Gifts
                </p>
              </div>

              <div className="space-y-4 text-left italic text-[#5d4134]">
                <blockquote className="border-l border-[#d4b896] pl-4 text-sm leading-relaxed">
                  Having you with us on our special day is already a blessing we truly cherish. If you wish to give us a gift, we would be grateful for anything you choose to give.
                </blockquote>

                <blockquote className="border-l border-[#d4b896] pl-4 text-sm leading-relaxed">
                  If you prefer to give a monetary gift, it would be especially meaningful as we begin this new chapter and build our life together. Your love and generosity will be treasured as part of our journey as a married couple.
                </blockquote>

              </div>
            </div>
          </Reveal>

        </div>

        {submitted ? (
          <div className="text-center bg-[#faf6f0] border border-[#d4b896] py-16 px-8">
            <div className="text-[#b89a6a] text-4xl mb-4">♡</div>
            <h3 className="font-display italic text-[#4a3728] text-3xl font-light mb-3">
              Thank you, {form.name}!
            </h3>
            <p className="font-body text-[#7a5c48] text-sm">
              {form.attendance === "attending"
                ? "We can't wait to celebrate with you. See you on March 06, 2027!"
                : "We'll miss you, but we're grateful for your love and warm wishes."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[#faf6f0] border border-[#e8dfd4] p-10 md:p-14 space-y-8"
          >
            <div>
              <label className={labelClass}>Search Your Name</label>
              <input
                list="guest-name-options"
                type="text"
                required
                placeholder="Start typing your name..."
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
              />
              <datalist id="guest-name-options">
                {filteredGuests.map((guestName) => (
                  <option key={guestName} value={guestName} />
                ))}
              </datalist>
              <p className="mt-2 font-body text-[11px] uppercase tracking-[0.12em] text-[#7a5c48]">
                {exactMatch
                  ? `Welcome, ${exactMatch}! You're invited.`
                  : normalizedQuery.length === 0
                  ? "Start typing to find your name"
                  : filteredGuests.length > 0
                  ? "Select your name from the guest list"
                  : "No matches found"}
              </p>
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Attendance</label>
              <div className="flex flex-col gap-2 mt-2">
                {[
                  { value: "attending", label: "Joyfully Attending" },
                  { value: "not-attending", label: "Regretfully Decline" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${form.attendance === opt.value
                          ? "border-[#b89a6a] bg-[#b89a6a]"
                          : "border-[#d4b896] group-hover:border-[#b89a6a]"
                        }`}
                    >
                      {form.attendance === opt.value && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                    <span
                      className="font-body text-xs text-[#7a5c48]"
                      onClick={() => update("attendance", opt.value)}
                    >
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>Meal Preference</label>
              <select
                value={form.meal}
                onChange={(e) => update("meal", e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="no-preference">No Preference</option>
                <option value="meat">Meat</option>
                <option value="seafood">Seafood</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Message to the Couple (Optional)</label>
              <textarea
                rows={3}
                placeholder="Share your wishes..."
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>

            {error ? <p className="font-body text-sm text-red-600">{error}</p> : null}

            <div className="pt-4 text-center">
              <button
                type="submit"
                disabled={saving}
                aria-busy={saving}
                className="bg-[#8e9e86] text-[#faf6f0] font-body tracking-[0.25em] text-xs uppercase px-12 py-4 hover:bg-[#f4e6b6] hover:text-[#3d453b] transition-colors duration-300 w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="inline-flex items-center justify-center gap-3">
                    <span className="loading-spinner" />
                    Sending...
                  </span>
                ) : (
                  "Send RSVP"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-[#] text-[#4a3728] py-14 px-6 text-center">
      <p className="font-display italic text-3xl mb-2">Aileen &amp; Christian Jade</p>
      <p className="font-body text-xs tracking-[0.25em] uppercase text-[#4a3728]/60 mb-6">
        March 06, 2027 · Bais City
      </p>
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex-1 max-w-20 h-px bg-[#4a3728]/30" />
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#4a3728" opacity="0.5">
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
        </svg>
        <div className="flex-1 max-w-20 h-px bg-[#4a3728]/30" />
      </div>
      <p className="font-body text-xs text-[#4a3728]/40 tracking-widest">#AiLifetimew/Chris</p>
    </footer>
  )
}

function AdminPanel() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState("")
  const [toast, setToast] = useState<ToastState | null>(null)
  const [session, setSession] = useState<null | { user?: { email?: string } }>(null)
  const [rsvps, setRsvps] = useState<Array<{
    id: string
    name: string
    email: string
    guests: number
    attendance: string
    meal: string
    message: string | null
    created_at: string
  }>>([])
  const [loadingRsvps, setLoadingRsvps] = useState(false)

  useEffect(() => {
    const client = supabase
    if (!client) return

    const initializeSession = async () => {
      const { data } = await client.auth.getSession()
      setSession(data.session)
    }

    initializeSession()

    const { data: authListener } = client.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    const client = supabase
    if (!client || !session) {
      setRsvps([])
      return
    }

    const fetchRsvps = async () => {
      setLoadingRsvps(true)
      const { data, error: fetchError } = await client
        .from("rsvps")
        .select("*")
        .order("created_at", { ascending: false })

      if (!fetchError) {
        setRsvps(data ?? [])
      }

      setLoadingRsvps(false)
    }

    fetchRsvps()
  }, [session])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const client = supabase
    if (!client) {
      setError("Add your Supabase URL and anon key to enable login.")
      return
    }

    setLoading(true)
    setError("")

    const { error: loginError } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
    }

    setLoading(false)
  }

  const handleSignOut = () => {
    const client = supabase
    if (!client) return

    setToast({
      type: "confirm",
      title: "Log out?",
      message: "Are you sure you want to log out of the admin dashboard?",
      confirmLabel: "Yes, log out",
      cancelLabel: "Stay signed in",
      onConfirm: async () => {
        setSigningOut(true)
        await client.auth.signOut()
        setSession(null)
        setEmail("")
        setPassword("")
        setSigningOut(false)
      },
      onCancel: () => {
        setToast(null)
      },
    })
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-[#faf6f0] border border-[#d4b896] p-8 text-center">
          <p className="font-body tracking-[0.2em] text-[#b89a6a] text-xs uppercase mb-3">
            Admin Access
          </p>
          <h3 className="font-display text-[#4a3728] text-3xl italic mb-4">
            Supabase not configured yet
          </h3>
          <p className="font-body text-[#7a5c48] text-sm leading-relaxed">
            Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values to the environment to enable login and RSVP storage.
          </p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-6 py-12">
        <div className="bg-[#faf6f0] border border-[#e8dfd4] p-8 md:p-10">
          <p className="font-body tracking-[0.2em] text-[#b89a6a] text-xs uppercase mb-3 text-center">
            Admin Login
          </p>
          <h3 className="font-display text-[#4a3728] text-4xl italic text-center mb-8">
            Welcome back
          </h3>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-body tracking-[0.15em] text-[#7a5c48] text-xs uppercase mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#d4b896] bg-white px-4 py-3 text-[#4a3728] focus:outline-none focus:border-[#8c6e3f]"
              />
            </div>

            <div>
              <label className="block font-body tracking-[0.15em] text-[#7a5c48] text-xs uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#d4b896] bg-white px-4 py-3 text-[#4a3728] focus:outline-none focus:border-[#8c6e3f]"
              />
            </div>

            {error ? <p className="font-body text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full bg-[#8e9e86] text-[#faf6f0] font-body tracking-[0.2em] text-xs uppercase px-6 py-4 hover:bg-[#f4e6b6] hover:text-[#3d453b] transition-colors duration-300 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-3">
                  <span className="loading-spinner" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const attendingCount = rsvps.filter((item) => item.attendance === "attending").length
  const guestCount = rsvps.reduce((sum, item) => sum + Number(item.guests || 0), 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <ToastHost toast={toast} onClose={() => setToast(null)} />

      <div className="bg-[#faf6f0] border border-[#e8dfd4] p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <p className="font-body tracking-[0.2em] text-[#b89a6a] text-xs uppercase mb-2">
            Admin Dashboard
          </p>
          <h3 className="font-display text-[#4a3728] text-4xl italic">
            Wedding RSVPs
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-body text-sm text-[#7a5c48]">
            {session.user?.email ?? "Signed in"}
          </span>
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            aria-busy={signingOut}
            className="border border-[#d4b896] px-5 py-2 font-body tracking-[0.2em] text-[10px] uppercase text-[#4a3728] hover:bg-[#f2ebe0] transition-colors disabled:opacity-60"
          >
            {signingOut ? (
              <span className="inline-flex items-center gap-2">
                <span className="loading-spinner" />
                Logging out
              </span>
            ) : (
              "Sign out"
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#f2ebe0] border border-[#d4b896] p-5">
          <p className="font-body tracking-[0.2em] text-[#7a5c48] text-[10px] uppercase">Total RSVPs</p>
          <p className="font-display text-[#4a3728] text-4xl italic mt-3">{rsvps.length}</p>
        </div>
        <div className="bg-[#f2ebe0] border border-[#d4b896] p-5">
          <p className="font-body tracking-[0.2em] text-[#7a5c48] text-[10px] uppercase">Attending</p>
          <p className="font-display text-[#4a3728] text-4xl italic mt-3">{attendingCount}</p>
        </div>
        <div className="bg-[#f2ebe0] border border-[#d4b896] p-5">
          <p className="font-body tracking-[0.2em] text-[#7a5c48] text-[10px] uppercase">Guest Seats</p>
          <p className="font-display text-[#4a3728] text-4xl italic mt-3">{guestCount}</p>
        </div>
      </div>

      <div className="bg-[#faf6f0] border border-[#e8dfd4] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#f2ebe0] text-[#4a3728]">
              <tr>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Name</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Email</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Guests</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Attendance</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Meal</th>
                <th className="px-4 py-3 font-body tracking-[0.15em] text-[10px] uppercase">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {loadingRsvps ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center font-body text-[#7a5c48]">
                    Loading RSVPs...
                  </td>
                </tr>
              ) : rsvps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center font-body text-[#7a5c48]">
                    No RSVP submissions yet.
                  </td>
                </tr>
              ) : (
                rsvps.map((item) => (
                  <tr key={item.id} className="border-t border-[#e8dfd4] align-top">
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">
                      {item.name}
                      {item.message ? (
                        <div className="mt-2 text-[11px] text-[#7a5c48] italic">“{item.message}”</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">{item.email}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">{item.guests}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">{item.attendance}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">{item.meal}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#4a3728]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(() =>
    typeof window !== "undefined" && window.location.pathname.startsWith("/admin")
  )
  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0)

  useEffect(() => {
    const syncRoute = () => {
      const isAdmin = window.location.pathname.startsWith("/admin")
      setIsAdminRoute(isAdmin)
    }

    syncRoute()
    window.addEventListener("popstate", syncRoute)

    return () => {
      window.removeEventListener("popstate", syncRoute)
    }
  }, [])

  return (
    <div className="min-h-screen">
      {isAdminRoute ? (
        <div className="pt-20 pb-12">
          <AdminPanel />
        </div>
      ) : (
        <>
          <Nav />
          <MusicPlayer />
          <Hero />
          <WeddingDetails />
          <OurStory />
          <DressCode />
          <GuestPhotoUpload onUploadSuccess={() => setGalleryRefreshKey((value) => value + 1)} />
          <GuestGallery refreshKey={galleryRefreshKey} />
          <RSVP />
          <Footer />
        </>
      )}
    </div>
  )
}