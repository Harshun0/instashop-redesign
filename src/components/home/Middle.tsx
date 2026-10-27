import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Heart, Plus, BadgeCheck, RotateCcw, Wallet, Store, PackagePlus, Share2, ShoppingCart } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { shops } from "@/data/shops";
import { ClientCanvas, Reveal, SpotlightScene, Ticker, Tilt } from "./primitives";
import { cn } from "@/lib/utils";

const products = shops.flatMap((s, i) => (i < 8 ? [{ ...s.products[0], shop: s }] : []));

function ProductCard({ p }: { p: (typeof products)[number] }) {
  const [liked, setLiked] = useState(false);
  const alt = shops[(shops.indexOf(p.shop) + 2) % shops.length].avatar;
  return (
    <Tilt max={8} className="group w-[260px] shrink-0 rounded-[1.75rem] bg-card p-3 shadow-card sm:w-[300px]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[1.25rem]">
        <img src={p.image} alt={p.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
        <img src={alt} alt="" loading="lazy" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100" />
        <motion.button whileTap={{ scale: 0.7 }} onClick={() => setLiked(!liked)} aria-label="Wishlist" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-card">
          <motion.span animate={liked ? { scale: [1, 1.4, 1] } : {}}>
            <Heart className={cn("h-5 w-5", liked && "fill-primary text-primary")} />
          </motion.span>
        </motion.button>
      </div>
      <div className="flex items-center justify-between px-1 pt-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <img src={p.shop.avatar} alt="" className="h-5 w-5 rounded-full object-cover" /> @{p.shop.handle}
          </div>
          <p className="mt-1 font-display text-xl font-extrabold">₹{p.price.toLocaleString("en-IN")}</p>
        </div>
        <button className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground"><Plus className="h-3.5 w-3.5" />Add to bag</button>
      </div>
    </Tilt>
  );
}

export function Trending() {
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      gsap.to(t, {
        x: () => -(t.scrollWidth - window.innerWidth + 40),
        ease: "none",
        scrollTrigger: { trigger: wrap.current, pin: true, scrub: 1, end: () => `+=${t.scrollWidth}`, invalidateOnRefresh: true },
      });
    });
    return () => mm.revert();
  }, []);
  return (
    <section id="shop" ref={wrap} className="overflow-hidden py-20 md:flex md:h-screen md:flex-col md:justify-center">
      <div className="mx-auto mb-10 w-full max-w-7xl px-5">
        <h2 className="text-5xl font-extrabold sm:text-7xl">Trending <span className="font-serif font-medium italic text-primary">right now</span></h2>
      </div>
      <div ref={track} className="flex gap-5 overflow-x-auto px-5 pb-4 md:overflow-visible md:pl-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))]">
        {products.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}

const callouts = [
  { icon: BadgeCheck, t: "Verified sellers", d: "Every shop is reviewed before going live." },
  { icon: RotateCcw, t: "Easy returns", d: "7-day returns on eligible orders." },
  { icon: Wallet, t: "Pay on delivery", d: "UPI, cards or cash — your call." },
];

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progress.current = v;
    setActive(Math.min(2, Math.floor(v * 3)));
  });
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 0.9]);
  return (
    <section ref={ref} className="relative h-[300vh] bg-forest-grad text-forest-foreground">
      <div className="sticky top-0 grid h-screen items-center gap-6 overflow-hidden px-5 lg:grid-cols-2">
        <div className="mx-auto max-w-lg pt-24 lg:pt-0">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amaranth">The Instashop promise</p>
          <h2 className="mt-4 text-5xl font-extrabold leading-[0.95] sm:text-6xl">Shopping small, <span className="font-serif font-medium italic text-amaranth">done right.</span></h2>
          <ul className="mt-10 space-y-4">
            {callouts.map((c, i) => (
              <motion.li key={c.t} animate={{ opacity: active === i ? 1 : 0.35, x: active === i ? 0 : -8 }} className="flex gap-4 rounded-3xl border border-forest-foreground/15 p-4">
                <c.icon className="h-7 w-7 shrink-0 text-amaranth" />
                <div><h3 className="text-xl font-bold">{c.t}</h3><p className="text-sm opacity-80">{c.d}</p></div>
              </motion.li>
            ))}
          </ul>
        </div>
        <motion.div style={{ scale }} className="relative h-[45vh] lg:h-[80vh]">
          <div aria-hidden className="absolute inset-x-10 bottom-10 top-10 rounded-full bg-rose/30 blur-3xl" />
          <ClientCanvas fallback={<div className="h-full" />}>
            <SpotlightScene progress={progress} />
          </ClientCanvas>
        </motion.div>
      </div>
    </section>
  );
}

const steps = [
  { icon: Store, t: "Create your shop", d: "Pick a name, add your Insta handle, done in 2 minutes." },
  { icon: PackagePlus, t: "List products in minutes", d: "Snap, price, publish. Bulk import from your feed." },
  { icon: Share2, t: "Share your Instashop link", d: "Drop it in your bio and stories — one link, full catalogue." },
  { icon: ShoppingCart, t: "Get orders", d: "We handle checkout and payments. You pack and smile." },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  return (
    <section id="sell" className="mx-auto max-w-7xl px-5 py-24">
      <Reveal>
        <h2 className="text-5xl font-extrabold sm:text-7xl">From feed to <span className="font-serif font-medium italic text-primary">first order</span></h2>
      </Reveal>
      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        <div className="space-y-[30vh] py-[10vh]">
          {steps.map((s, i) => (
            <motion.div key={s.t} onViewportEnter={() => setActive(i)} viewport={{ margin: "-45% 0px -45% 0px" }} animate={{ opacity: active === i ? 1 : 0.3 }}>
              <span className="font-display text-7xl font-extrabold text-amaranth">0{i + 1}</span>
              <h3 className="mt-2 text-3xl font-extrabold">{s.t}</h3>
              <p className="mt-2 max-w-sm text-muted-foreground">{s.d}</p>
            </motion.div>
          ))}
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-28 grid h-[70vh] place-items-center rounded-[2rem] bg-hero grain">
            {steps.map((s, i) => (
              <motion.div key={s.t} className="absolute w-72 rounded-[1.75rem] bg-card p-6 shadow-card" initial={false} animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 30, rotate: active === i ? -2 : 4 }}>
                <s.icon className="h-10 w-10 text-primary" />
                <p className="mt-4 font-display text-2xl font-extrabold">{s.t}</p>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded-full bg-blush" />
                  <div className="h-3 w-2/3 rounded-full bg-blush" />
                  <div className="mt-4 h-10 w-full rounded-full bg-secondary" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-20 grid grid-cols-3 gap-4 rounded-[2rem] bg-blush p-8 text-center">
        {[[2400, "+", "Sellers"], [180000, "+", "Orders"], [320, "", "Cities"]].map(([v, suf, l]) => (
          <div key={l as string}>
            <p className="font-display text-3xl font-extrabold text-primary sm:text-6xl"><Ticker value={v as number} suffix={suf as string} /></p>
            <p className="mt-1 text-sm font-semibold">{l as string}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
