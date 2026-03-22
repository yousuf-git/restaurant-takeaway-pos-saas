import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  UtensilsCrossed,
  Zap,
  BarChart3,
  Printer,
  Users,
  ShieldCheck,
  LayoutDashboard,
  Check,
  ArrowRight,
  ArrowUpRight,
  ChevronUp,
  Menu,
  X as XIcon,
  Star,
  Clock,
  TrendingUp,
  Utensils,
  MonitorSmartphone,
  CircleCheck,
  CircleX,
  Quote,
} from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;
const CREAM = "#fef6f0";

/* ─── Reveal on scroll ─── */
function R({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={v ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.75, delay, ease }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Noise texture ─── */
function Noise({ o = 0.03 }: { o?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1]" style={{ opacity: o }}>
      <svg width="100%" height="100%" className="block"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter><rect width="100%" height="100%" filter="url(#n)" /></svg>
    </div>
  );
}

/* ─── Magnetic ─── */
function Magnetic({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 }), sy = useSpring(y, { stiffness: 200, damping: 20 });
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={(e) => { const r = ref.current?.getBoundingClientRect(); if (!r) return; x.set((e.clientX - r.left - r.width / 2) * 0.2); y.set((e.clientY - r.top - r.height / 2) * 0.2); }} onMouseLeave={() => { x.set(0); y.set(0); }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Counter ─── */
function Counter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => { if (!iv) return; let c = 0; const s = end / 120; const id = setInterval(() => { c += s; if (c >= end) { setV(end); clearInterval(id); } else setV(Math.round(c * 10) / 10); }, 16); return () => clearInterval(id); }, [iv, end]);
  const d = end % 1 !== 0 ? v.toFixed(1) : Math.round(v).toLocaleString();
  return (<div ref={ref}><span className="text-5xl md:text-6xl font-display font-bold tracking-tight text-gray-900">{d}{suffix}</span><p className="mt-2 text-sm text-gray-500">{label}</p></div>);
}

/* ─── Marquee ─── */
function Marquee({ children, reverse = false, className = "" }: { children: React.ReactNode; reverse?: boolean; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div className="flex gap-8 w-max" animate={{ x: reverse ? ["0%", "-50%"] : ["-50%", "0%"] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}>
        {children}{children}
      </motion.div>
    </div>
  );
}

/* ─── Pill badge (bordered, like references) ─── */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border border-orange-500/30 text-[11px] font-semibold uppercase tracking-widest text-orange-500">
      {children}
    </span>
  );
}

/* ─── Highlighted word (rectangle border around it) ─── */
function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block px-2 mx-0.5">
      <span className="absolute inset-0 border-2 border-orange-500 rounded-md" />
      <span className="relative">{children}</span>
    </span>
  );
}

/* ─── Rotating word ─── */
const words = ["Orders", "Tables", "Revenue", "Growth"];
function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => { const id = setInterval(() => setI((p) => (p + 1) % words.length), 2600); return () => clearInterval(id); }, []);
  return (
    <span className="relative inline-flex overflow-hidden align-bottom" style={{ height: "1.25em", minWidth: "8ch" }}>
      <AnimatePresence mode="wait">
        <motion.span key={words[i]} initial={{ y: "120%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: "-120%", opacity: 0 }} transition={{ duration: 0.45, ease }} className="absolute left-0 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500 whitespace-nowrap">
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─── Browser Mockup ─── */
function BrowserMockup() {
  const ref = useRef(null);
  const iv = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60, scale: 0.97 }} animate={iv ? { opacity: 1, y: 0, scale: 1 } : {}} transition={{ duration: 1, delay: 0.2, ease }} className="relative">
      <div className="absolute -inset-8 md:-inset-12 bg-gradient-to-t from-orange-500/20 via-orange-500/5 to-transparent rounded-3xl blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="relative bg-[#111] rounded-xl md:rounded-2xl border border-white/[0.08] overflow-hidden shadow-2xl shadow-black/50">
        <div className="flex items-center px-4 py-2.5 bg-[#1a1a1a] border-b border-white/[0.06]">
          <div className="flex gap-1.5 mr-4"><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /><div className="w-2.5 h-2.5 rounded-full bg-white/10" /></div>
          <div className="flex-1 flex justify-center"><div className="bg-white/[0.04] rounded-md px-6 py-1 text-[11px] text-white/30 font-mono">app.restoria.io</div></div>
          <div className="w-14" />
        </div>
        <div className="flex min-h-[260px] md:min-h-[360px]">
          <div className="hidden sm:block w-44 bg-[#0d0d0d] border-r border-white/[0.05] p-3">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-4"><div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center"><UtensilsCrossed className="w-3 h-3 text-white" /></div><span className="text-white/80 text-xs font-semibold">Restoria</span></div>
            {["Dashboard", "Orders", "Menu Items", "Tables", "Waiters", "Analytics"].map((l, idx) => (<div key={l} className={`px-2.5 py-1.5 rounded-lg text-[11px] mb-0.5 ${idx === 0 ? "bg-white/[0.06] text-white/80 font-medium" : "text-white/25"}`}>{l}</div>))}
          </div>
          <div className="flex-1 p-4 md:p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/50 text-xs font-medium">Dashboard Overview</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">Live</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {[{ l: "Revenue", v: "$2,847", d: "+12.5%" }, { l: "Orders", v: "184", d: "+8.2%" }, { l: "Avg Ticket", v: "$15.47", d: "+3.1%" }, { l: "Tables", v: "12/18", d: "67%" }].map((s) => (
                <div key={s.l} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.04]"><p className="text-white/25 text-[9px] uppercase tracking-wider">{s.l}</p><p className="text-white text-sm font-semibold mt-0.5">{s.v}</p><p className="text-emerald-400 text-[9px] font-medium">{s.d}</p></div>
              ))}
            </div>
            <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
              <p className="text-white/20 text-[10px] mb-2">Revenue - Today</p>
              <div className="flex items-end gap-[2px] h-16 md:h-20">
                {[20, 35, 28, 50, 40, 60, 45, 70, 55, 80, 65, 90, 50, 75, 60, 88, 72, 95, 68, 85, 78, 100, 82, 70].map((h, idx) => (
                  <motion.div key={idx} className="flex-1 rounded-sm" style={{ background: idx >= 20 ? "linear-gradient(to top, rgba(249,115,22,0.6), rgba(249,115,22,0.25))" : "linear-gradient(to top, rgba(249,115,22,0.25), rgba(249,115,22,0.08))" }} initial={{ height: 0 }} animate={iv ? { height: `${h}%` } : {}} transition={{ duration: 0.5, delay: 0.5 + idx * 0.025, ease }} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
      </div>
    </motion.div>
  );
}

/* ================================================================
   DATA
   ================================================================ */
const marqueeItems = ["Dine-In Orders", "Take-Away", "Thermal Receipts", "Table Management", "Waiter Assignment", "Live Analytics", "Revenue Tracking", "Multi-Restaurant", "Role-Based Access", "Order History", "Item Statistics", "Day Summaries"];

const plans = [
  { name: "Monthly", price: 20, period: "/mo", badge: null, desc: "For single-location restaurants getting started.", features: ["Unlimited orders", "Up to 3 POS terminals", "Real-time dashboard", "Thermal printing", "Table & waiter management", "Email support"] },
  { name: "Yearly", price: 100, period: "/yr", badge: "Best Value", desc: "For growing restaurants that need more power.", features: ["Everything in Monthly", "Unlimited terminals", "Priority support", "Advanced analytics", "Multi-restaurant management", "Custom receipt branding"] },
];

const testimonials = [
  { quote: "Switched from a clunky legacy system and never looked back. Our staff learned it in under an hour.", name: "Ahmed K.", role: "Owner, Karachi Grill House" },
  { quote: "The analytics alone pay for the subscription. We cut food waste by 18% in the first month.", name: "Sara M.", role: "Manager, Cafe Rosetta" },
  { quote: "Thermal printing just works. No more jammed receipts or driver nightmares for our team.", name: "Bilal R.", role: "Ops Lead, Spice Route" },
  { quote: "We manage three locations from one dashboard now. The multi-restaurant feature is a game changer.", name: "Fatima Z.", role: "Director, Saffron Chain" },
];

const restoriaVsOthers = {
  restoria: ["Real-time dashboard with live data", "Thermal printing via QZ Tray, zero drivers", "Multi-restaurant from a single login", "Role-based access for admins & operators", "Setup in under 5 minutes, no training needed"],
  others: ["Delayed reports, manual refresh", "Complex driver installations & jams", "Separate accounts per location", "One-size-fits-all permission model", "Hours of onboarding and configuration"],
};

/* ================================================================
   PAGE
   ================================================================ */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 50); setShowTop(window.scrollY > 600); };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = useCallback((id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }, []);
  const navLinks = [{ id: "features", label: "Features" }, { id: "pricing", label: "Pricing" }, { id: "reviews", label: "Reviews" }];

  return (
    <div className="overflow-x-hidden selection:bg-orange-500/20 selection:text-orange-900">

      {/* ── NAV ── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#09090b]/80 backdrop-blur-2xl border-b border-white/[0.06]" : ""}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <nav className="flex items-center justify-between h-16 md:h-[68px]">
            <button onClick={() => scrollTo("hero")} className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-[9px] flex items-center justify-center group-hover:scale-110 transition-transform"><UtensilsCrossed className="w-[17px] h-[17px] text-white" /></div>
              <span className="text-[17px] font-display font-semibold tracking-tight text-white">Restoria</span>
            </button>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((n) => (<button key={n.id} onClick={() => scrollTo(n.id)} className="px-3.5 py-1.5 text-[13px] font-medium text-white/40 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all">{n.label}</button>))}
              <Link to="/login" className="ml-4 px-4 py-2 text-[13px] font-semibold bg-white text-[#09090b] rounded-[10px] hover:bg-white/90 transition-colors">Log In</Link>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-white/50 hover:text-white" aria-label="Menu">{menuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </nav>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease }} className="md:hidden overflow-hidden bg-[#09090b]/95 backdrop-blur-2xl border-t border-white/[0.06]">
              <div className="px-5 py-3 space-y-1">
                {navLinks.map((n) => (<button key={n.id} onClick={() => scrollTo(n.id)} className="block w-full text-left px-3 py-2.5 text-sm text-white/50 hover:text-white rounded-lg">{n.label}</button>))}
                <Link to="/login" className="block w-full text-center px-4 py-2.5 bg-white text-[#09090b] font-semibold rounded-lg mt-2">Log In</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO (dark) ── */}
      <section id="hero" className="relative bg-[#09090b] pt-28 md:pt-36 pb-4 overflow-hidden">
        <Noise o={0.035} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-t from-orange-500/15 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 text-center">

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease }} className="mt-7 font-display font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto" style={{ fontSize: "clamp(2.4rem, 6.5vw, 5rem)" }}>
            Your <Highlight>Restaurant's</Highlight>{" "}
            <RotatingWord />
            <br />
            in One Beautiful Place.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease }} className="mt-5 text-white/40 max-w-lg mx-auto leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)" }}>
            The blazing-fast POS built for dine-in and take-away. Manage orders, tables, and analytics from a single dashboard.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, ease }} className="mt-8 flex flex-wrap justify-center items-center gap-4">
            <Magnetic>
              <Link to="/login" className="group relative inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl text-[15px] overflow-hidden hover:shadow-[0_0_40px_rgba(249,115,22,0.25)] transition-shadow">
                <span className="relative z-10">Get Started</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </Magnetic>
            <button onClick={() => scrollTo("features")} className="text-sm text-white/30 hover:text-white/60 transition-colors font-medium underline underline-offset-4 decoration-white/15 hover:decoration-white/40">See what's inside</button>
          </motion.div>


          <div className="mt-14 md:mt-16 max-w-5xl mx-auto"><BrowserMockup /></div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <section style={{ background: CREAM }} className="border-b border-orange-100 py-5">
        <Marquee>{marqueeItems.map((item) => (<div key={item} className="flex items-center gap-4 shrink-0"><span className="text-sm font-medium text-gray-400 whitespace-nowrap">{item}</span><span className="w-1.5 h-1.5 rounded-full bg-orange-300" /></div>))}</Marquee>
      </section>

      {/* ── WHY RESTORIA ── */}
      <section style={{ background: CREAM }} className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <R>
            <div className="max-w-3xl">
              <Pill>Why Restoria</Pill>
              <h2 className="mt-5 font-display font-bold text-gray-900 tracking-tight leading-[1.15]" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
                Most POS systems were built a decade ago.
                <span className="text-gray-500"> We started fresh, designed for the way restaurants </span>
                <span className="font-serif italic text-gray-900">actually</span>
                <span className="text-gray-500"> work today.</span>
              </h2>
            </div>
          </R>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[{ end: 500, suffix: "+", label: "Restaurants served" }, { end: 50000, suffix: "+", label: "Orders processed daily" }, { end: 99.9, suffix: "%", label: "Platform uptime" }, { end: 3, suffix: "sec", label: "Average order time" }].map((s, i) => (
              <R key={s.label} delay={i * 0.08}><Counter {...s} /></R>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO FEATURES ── */}
      <section id="features" className="py-24 md:py-32" style={{ background: "#faf0e6" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <R>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
              <div>
                <Pill>Features</Pill>
                <h2 className="mt-4 font-display font-bold text-gray-900 tracking-tight" style={{ fontSize: "clamp(1.75rem, 4vw, 2.8rem)" }}>Built different, on purpose.</h2>
              </div>
              <Link to="/login" className="text-sm text-orange-500 hover:text-orange-600 font-medium inline-flex items-center gap-1 transition-colors shrink-0">Start using Restoria <ArrowUpRight className="w-3.5 h-3.5" /></Link>
            </div>
          </R>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <R className="md:col-span-4">
              <div className="relative h-full bg-white rounded-[20px] border border-gray-200/80 p-8 overflow-hidden group hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-500">
                <div className="flex items-start gap-3 mb-3"><div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0"><Zap className="w-5 h-5 text-orange-500" /></div><div className="flex-1"><h3 className="text-lg font-display font-semibold text-gray-900">Lightning-Fast Orders</h3><p className="text-gray-500 text-sm leading-relaxed mt-1">Process dine-in and take-away in seconds. The UI is optimized for speed, every tap counts.</p></div></div>
                <div className="mt-4 flex gap-2 flex-wrap">{["Touch-first", "3s avg", "Bulk actions", "Quick search"].map((t) => (<span key={t} className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 font-medium">{t}</span>))}</div>
              </div>
            </R>
            <R delay={0.08} className="md:col-span-2">
              <div className="h-full bg-white rounded-[20px] border border-gray-200/80 p-7 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center mb-5"><Printer className="w-5 h-5 text-purple-500" /></div>
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">Thermal Printing</h3>
                <p className="text-gray-500 text-sm leading-relaxed">QZ Tray integration. Receipts print instantly, every time.</p>
              </div>
            </R>
            <R delay={0.1} className="md:col-span-2">
              <div className="h-full bg-white rounded-[20px] border border-gray-200/80 p-7 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5"><LayoutDashboard className="w-5 h-5 text-blue-500" /></div>
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">Live Dashboard</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Revenue, order volume, and top sellers. All live, all real-time.</p>
              </div>
            </R>
            <R delay={0.14} className="md:col-span-2">
              <div className="h-full bg-white rounded-[20px] border border-gray-200/80 p-7 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-5"><Users className="w-5 h-5 text-emerald-500" /></div>
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">Table & Waiter Mgmt</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Assign tables, track waiters, and keep the floor running smoothly.</p>
              </div>
            </R>
            <R delay={0.18} className="md:col-span-2">
              <div className="h-full bg-white rounded-[20px] border border-gray-200/80 p-7 hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-500">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-5"><ShieldCheck className="w-5 h-5 text-red-500" /></div>
                <h3 className="text-lg font-display font-semibold text-gray-900 mb-2">Role-Based Access</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Admins see everything. Operators see what they need. Secure.</p>
              </div>
            </R>

            {/* Full-width orange accent card */}
            <R delay={0.1} className="md:col-span-6">
              <div className="relative bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-[20px] p-8 md:p-10 overflow-hidden">
                <Noise o={0.04} />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="max-w-lg">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4"><BarChart3 className="w-5 h-5 text-white" /></div>
                    <h3 className="text-xl md:text-2xl font-display font-bold mb-2">Analytics That Drive Decisions</h3>
                    <p className="text-white/80 text-sm leading-relaxed">Daily summaries, item-level stats, order history, and revenue tracking. Data that actually helps you grow.</p>
                  </div>
                  <div className="flex gap-6 shrink-0">
                    {[{ label: "Avg. Revenue", val: "$2.8K", sub: "per day" }, { label: "Top Item", val: "Biryani", sub: "347 sold" }].map((s) => (
                      <div key={s.label} className="text-center"><p className="text-white/60 text-[10px] uppercase tracking-wider">{s.label}</p><p className="text-2xl font-display font-bold mt-1">{s.val}</p><p className="text-white/60 text-[11px]">{s.sub}</p></div>
                    ))}
                  </div>
                </div>
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* ── COMPARISON (dark) ── */}
      <section className="bg-[#09090b] py-24 md:py-32 relative overflow-hidden">
        <Noise o={0.03} />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <R>
            <div className="text-center mb-14">
              <Pill>Comparison</Pill>
              <h2 className="mt-5 font-display font-bold text-white tracking-tight" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
                What Sets Restoria Apart
                <br />From Other POS Systems
              </h2>
            </div>
          </R>
          <R delay={0.1}>
            <div className="max-w-3xl mx-auto bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2">
                <div className="p-6 md:p-8 border-r border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center"><UtensilsCrossed className="w-3 h-3 text-white" /></div>
                    <span className="text-white text-sm font-display font-semibold">Restoria</span>
                  </div>
                  <ul className="space-y-4">{restoriaVsOthers.restoria.map((item) => (<li key={item} className="flex items-start gap-2.5"><CircleCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" /><span className="text-white/70 text-sm">{item}</span></li>))}</ul>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-6"><span className="text-white/40 text-sm font-medium">Others</span></div>
                  <ul className="space-y-4">{restoriaVsOthers.others.map((item) => (<li key={item} className="flex items-start gap-2.5"><CircleX className="w-4 h-4 mt-0.5 shrink-0 text-red-400/60" /><span className="text-white/40 text-sm">{item}</span></li>))}</ul>
                </div>
              </div>
            </div>
          </R>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: CREAM }} className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <R><div className="mb-14"><Pill>How It Works</Pill><h2 className="mt-4 font-display font-bold text-gray-900 tracking-tight" style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>Three steps. That's it.</h2></div></R>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {[{ num: "01", title: "Log in", desc: "Access your dashboard from any device. Desktop, tablet, or phone.", icon: MonitorSmartphone }, { num: "02", title: "Take orders", desc: "Tap items, assign tables, fire orders to the kitchen. Fast.", icon: Utensils }, { num: "03", title: "Track growth", desc: "Watch your revenue, find your best sellers, optimize your menu.", icon: TrendingUp }].map((step, i) => (
              <R key={step.num} delay={i * 0.1}>
                <div className={`relative p-8 md:p-10 ${i < 2 ? "md:border-r border-b md:border-b-0 border-orange-200/40" : ""}`}>
                  <span className="text-6xl md:text-7xl font-display font-bold text-orange-100 leading-none">{step.num}</span>
                  <div className="mt-4"><div className="flex items-center gap-3 mb-2"><step.icon className="w-4 h-4 text-orange-500" /><h3 className="text-lg font-display font-semibold text-gray-900">{step.title}</h3></div><p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p></div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 md:py-32" style={{ background: "#faf0e6" }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <R><div className="max-w-lg mb-14"><Pill>Pricing</Pill><h2 className="mt-4 font-display font-bold text-gray-900 tracking-tight" style={{ fontSize: "clamp(1.75rem, 4vw, 2.8rem)" }}>One flat rate.<br />No surprises.</h2><p className="mt-3 text-gray-500 text-[15px]">No per-transaction fees. No hidden charges. Cancel anytime.</p></div></R>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl">
            {plans.map((plan, i) => (
              <R key={plan.name} delay={i * 0.1}>
                <div className={`relative rounded-[20px] p-7 md:p-8 h-full flex flex-col transition-all duration-500 ${plan.badge ? "bg-gray-900 text-white shadow-xl" : "bg-white border border-gray-200/80 hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200/50"}`}>
                  {plan.badge && (<span className="absolute -top-3 left-7 px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full">{plan.badge}</span>)}
                  <div className="mb-6">
                    <p className={`text-xs uppercase tracking-wider font-medium ${plan.badge ? "text-white/40" : "text-gray-400"}`}>{plan.name}</p>
                    <div className="mt-2 flex items-baseline gap-1"><span className={`text-5xl font-display font-bold tracking-tight ${plan.badge ? "text-white" : "text-gray-900"}`}>${plan.price}</span><span className={`text-sm ${plan.badge ? "text-white/30" : "text-gray-300"}`}>{plan.period}</span></div>
                    {plan.badge && <p className="mt-1 text-xs text-orange-400/80 font-medium">$8.33/month billed yearly</p>}
                    <p className={`mt-3 text-xs ${plan.badge ? "text-white/40" : "text-gray-500"}`}>{plan.desc}</p>
                  </div>
                  <ul className="space-y-2.5 flex-1">{plan.features.map((f) => (<li key={f} className="flex items-start gap-2"><Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.badge ? "text-orange-400/70" : "text-orange-500"}`} /><span className={`text-sm ${plan.badge ? "text-white/60" : "text-gray-600"}`}>{f}</span></li>))}</ul>
                  <Link to="/login" className={`mt-7 w-full inline-flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl text-sm transition-all ${plan.badge ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:opacity-90" : "bg-gray-900 text-white hover:bg-gray-800"}`}>Get Started <ArrowRight className="w-3.5 h-3.5" /></Link>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS (dark, glass cards) ── */}
      <section id="reviews" className="bg-[#09090b] py-24 md:py-32 relative overflow-hidden">
        <Noise o={0.03} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/[0.05] rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
          <R>
            <div className="text-center mb-14">
              <Pill>Hear from our users</Pill>
              <h2 className="mt-5 font-display font-bold text-white tracking-tight" style={{ fontSize: "clamp(1.75rem, 4vw, 2.8rem)" }}>Trusted by Restaurant Owners<br />Across the Country.</h2>
            </div>
          </R>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <R key={t.name} delay={i * 0.08}>
                <div className="bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-7 transition-all duration-500 group">
                  <Quote className="w-6 h-6 text-orange-500/30 mb-4" />
                  <blockquote className="text-white/60 text-[15px] leading-relaxed group-hover:text-white/70 transition-colors">"{t.quote}"</blockquote>
                  <div className="mt-5 pt-5 border-t border-white/[0.06] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-xs font-bold">{t.name[0]}</div>
                    <div><p className="text-white/80 text-sm font-medium">{t.name}</p><p className="text-white/30 text-xs">{t.role}</p></div>
                  </div>
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERIF QUOTE BREAK ── */}
      <section style={{ background: CREAM }} className="py-20 md:py-28 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <R>
            <p className="font-serif italic text-gray-400 leading-[1.3] text-center max-w-3xl mx-auto" style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.6rem)" }}>
              "The best POS is the one your staff{" "}
              <span className="text-gray-900 not-italic font-display font-bold">forgets</span>{" "}
              they're using."
            </p>
          </R>
        </div>
      </section>

      {/* ── CTA (dark) ── */}
      <section className="relative bg-[#09090b] py-28 md:py-36 overflow-hidden">
        <Noise o={0.035} />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-orange-500/[0.06] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <R>
            <p className="text-orange-400/60 text-xs font-semibold uppercase tracking-widest mb-5">Ready?</p>
            <h2 className="font-display font-bold text-white tracking-tight max-w-3xl mx-auto leading-[1.12]" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
              Start running your
              <br />
              <Highlight>restaurant</Highlight> the way it deserves.
            </h2>
            <p className="mt-5 text-white/35 text-[15px] max-w-md mx-auto">500+ restaurants already trust Restoria. Setup takes under 5 minutes.</p>
            <div className="mt-8">
              <Magnetic>
                <Link to="/login" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl text-[15px] overflow-hidden hover:shadow-[0_0_50px_rgba(249,115,22,0.25)] transition-shadow">
                  <span className="relative z-10">Log In Now</span><ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Magnetic>
            </div>
            <p className="mt-5 text-white/15 text-xs flex items-center justify-center gap-4">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> No credit card needed</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> 5 min setup</span>
            </p>
          </R>
        </div>
      </section>

      {/* ── FOOTER (dark, giant watermark) ── */}
      <footer className="relative bg-[#09090b] border-t border-white/[0.04] overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none select-none" style={{ fontSize: "clamp(6rem, 18vw, 16rem)" }}>
          <span className="font-display font-bold text-transparent" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.03)" }}>Restoria</span>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
            <div className="md:col-span-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center"><UtensilsCrossed className="w-3.5 h-3.5 text-white" /></div>
                <span className="text-[15px] font-display font-semibold text-white/80 tracking-tight">Restoria</span>
              </div>
              <p className="text-white/30 text-sm leading-relaxed max-w-xs">The modern point-of-sale built for restaurants that value speed, clarity, and control.</p>
              <div className="flex gap-2 mt-5">{["X", "In", "Gh"].map((s) => (<div key={s} className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-white/25 text-[10px] font-bold hover:border-white/20 hover:text-white/50 transition-colors cursor-pointer">{s}</div>))}</div>
            </div>
            <div className="md:col-span-2 md:col-start-6">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Product</p>
              <ul className="space-y-2 text-sm text-white/25">{navLinks.map((n) => (<li key={n.id}><button onClick={() => scrollTo(n.id)} className="hover:text-white/50 transition-colors">{n.label}</button></li>))}</ul>
            </div>
            <div className="md:col-span-2">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Support</p>
              <ul className="space-y-2 text-sm text-white/25"><li>help@restoria.app</li><li>+92 300 1234567</li></ul>
            </div>
            <div className="md:col-span-2">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3">Legal</p>
              <ul className="space-y-2 text-sm text-white/25"><li className="hover:text-white/50 transition-colors cursor-pointer">Privacy Policy</li><li className="hover:text-white/50 transition-colors cursor-pointer">Terms of Service</li></ul>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/15">&copy; {new Date().getFullYear()} Restoria. All rights reserved.</p>
            <p className="text-[11px] text-white/10">Crafted for restaurants that move fast.</p>
          </div>
        </div>
      </footer>

      {/* GoToTop */}
      <AnimatePresence>
        {showTop && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-white shadow-lg shadow-gray-200/50 border border-gray-200 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-colors" aria-label="Scroll to top">
            <ChevronUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
