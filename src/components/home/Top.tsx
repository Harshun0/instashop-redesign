import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, ShoppingBag, Home, Compass, Store, User, ArrowUpRight, ShieldCheck, Sparkles } from "lucide-react";
import { categories, images, shops } from "@/data/shops";
import { ClientCanvas, HeroScene, Reveal, Squiggle, Tilt } from "./primitives";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3">
        <nav
          className={cn(
            "glass flex w-full items-center justify-between rounded-full transition-all duration-500",
            scrolled ? "max-w-4xl px-4 py-2 shadow-card" : "max-w-6xl px-6 py-3",
          )}
        >
          <a href="/" className="font-display text-xl font-extrabold tracking-tight">
            insta<span className="text-primary">shop</span>
          </a>
          <ul className="hidden items-center gap-6 text-sm font-medium md:flex">
            {["Shop", "Instagram Shops", "Categories", "Sell on Instashop"].map((l) => (
              <li key={l}>
                <a href={`#${l.split(" ")[0].toLowerCase()}`} className="transition-colors hover:text-primary">{l}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <button aria-label="Search" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><Search className="h-4 w-4" /></button>
            <button aria-label="Cart" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"><ShoppingBag className="h-4 w-4" /></button>
            <a href="#sell" className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow sm:inline-block">Start Selling</a>
          </div>
        </nav>
      </header>
      <nav aria-label="Mobile" className="glass fixed inset-x-4 bottom-4 z-50 flex justify-around rounded-full py-2 shadow-card md:hidden">
        {[[Home, "Home"], [Compass, "Explore"], [Store, "Shops"], [ShoppingBag, "Cart"], [User, "Profile"]].map(([I, l], i) => {
          const Icon = I as typeof Home;
          return (
            <a key={l as string} href="#" className={cn("flex flex-col items-center gap-0.5 rounded-full px-3 py-1 text-[10px] font-medium", i === 0 && "text-primary")}>
              <Icon className="h-5 w-5" />
              {l as string}
            </a>
          );
        })}
      </nav>
    </>
  );
}

function Sticker({ children, className, delay }: { children: React.ReactNode; className: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, type: "spring", stiffness: 160, damping: 14 }}
      className={cn("absolute z-10 rounded-2xl bg-card px-4 py-3 text-sm font-semibold shadow-card", className)}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 160]);
  const op = useTransform(scrollY, [0, 600], [1, 0]);
  return (
    <section className="bg-hero grain relative min-h-[100svh] overflow-hidden pt-28">
      <div aria-hidden className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-sage/30 blur-3xl" />
      <div aria-hidden className="absolute -right-20 bottom-0 h-[30rem] w-[30rem] rounded-full bg-rose/40 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 lg:grid-cols-[1.1fr_1fr]">
        <motion.div style={{ y, opacity: op }} className="relative z-10">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
            <Sparkles className="h-3.5 w-3.5" /> India's home for Insta brands
          </motion.span>
          <h1 className="mt-6 text-[13vw] font-extrabold leading-[0.88] sm:text-7xl lg:text-[6.5rem]">
            {["Your favourite", "", "shops. One place."].map((line, i) => (
              <motion.span key={i} className="block overflow-hidden" initial={{ y: "100%" }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                {i === 1 ? (
                  <span className="relative inline-block font-serif font-medium italic text-primary">
                    Instagram
                    <Squiggle className="text-secondary" />
                  </span>
                ) : line}
              </motion.span>
            ))}
          </h1>
          <p className="mt-8 max-w-md text-lg text-muted-foreground">
            Shop small Indian brands you already love on Insta — no DMs, no waiting. Real checkout, real sellers.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#instagram" className="shimmer rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-[1.03]">Explore Shops</a>
            <a href="#sell" className="group inline-flex items-center gap-1 rounded-full border-2 border-foreground px-6 py-3.5 font-semibold transition-colors hover:bg-foreground hover:text-background">
              Sell on Instashop <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </a>
          </div>
        </motion.div>
        <div className="relative h-[60vh] min-h-[420px] lg:h-[80vh]">
          <ClientCanvas fallback={<img src={images.footwear} alt="Pink sneaker" width={768} height={960} className="mx-auto h-full rounded-[2rem] object-cover" />}>
            <HeroScene />
          </ClientCanvas>
          <Sticker className="left-0 top-10 -rotate-6" delay={0.9}><span className="text-2xl font-extrabold text-primary">2,400+</span> shops</Sticker>
          <Sticker className="bottom-20 left-4 rotate-3 bg-secondary text-secondary-foreground" delay={1.1}>Free seller listing ✿</Sticker>
          <Sticker className="right-2 top-1/2 rotate-6" delay={1.3}><ShieldCheck className="mr-1 inline h-4 w-4 text-secondary" />Secure checkout</Sticker>
        </div>
      </div>
    </section>
  );
}

export function Marquee() {
  const handles = shops.map((s) => `@${s.handle}`);
  const cats = categories.map((c) => c.name);
  const Row = ({ items, reverse }: { items: string[]; reverse?: boolean }) => (
    <div className="pause-hover flex overflow-hidden">
      <div className={cn("marquee-track flex shrink-0 gap-3 pr-3", reverse && "marquee-reverse")}>
        {[...items, ...items].map((t, i) => (
          <span key={i} className={cn("whitespace-nowrap rounded-full px-5 py-2.5 font-display text-lg font-bold", reverse ? "bg-secondary text-secondary-foreground" : "bg-blush text-foreground")}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <section aria-label="Shops and categories" className="space-y-3 py-10">
      <Row items={handles} />
      <Row items={[...cats, ...cats]} reverse />
    </section>
  );
}

const spans = ["md:col-span-2 md:row-span-2", "", "", "md:row-span-2", "", "md:col-span-2", "", ""];

export function Categories() {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-5 py-20">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-5xl font-extrabold leading-none sm:text-7xl">
          Shop by <span className="font-serif font-medium italic text-primary">mood</span>
        </h2>
        <p className="max-w-xs text-muted-foreground">Eight aisles, thousands of tiny brands, zero boring basics.</p>
      </Reveal>
      <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.05} className={cn("h-full", spans[i])}>
            <Tilt max={6} className="group relative h-full overflow-hidden rounded-[1.75rem] bg-blush">
              <img src={c.image} alt={c.name} loading="lazy" width={768} height={960} className="absolute -right-6 top-4 h-[115%] w-3/4 rotate-6 rounded-3xl object-cover shadow-card transition-transform duration-700 group-hover:rotate-0 group-hover:scale-105" />
              <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100" style={{ background: "radial-gradient(240px circle at var(--mx) var(--my), color-mix(in oklab, var(--rose) 35%, transparent), transparent 70%)" }} />
              <div className="relative flex h-full flex-col justify-between p-5">
                <span className="w-fit rounded-full bg-card px-3 py-1 text-xs font-bold">{c.count}+</span>
                <h3 className="text-2xl font-extrabold md:text-3xl">{c.name}</h3>
              </div>
            </Tilt>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
