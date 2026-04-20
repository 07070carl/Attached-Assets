import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetFeaturedItems, useGetReviews } from "@workspace/api-client-react";
import { Star, ArrowRight, Quote, UtensilsCrossed, ChefHat, Users } from "lucide-react";
import { AnimateIn } from "@/components/animate-in";

const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)";

function heroAnim(delay: number, extra?: React.CSSProperties): React.CSSProperties {
  return { animation: `ha-fade-up 900ms ${SPRING} ${delay}ms both`, ...extra };
}

export function Home() {
  const { data: featuredItems } = useGetFeaturedItems();
  const { data: reviews }       = useGetReviews();

  const approvedReviews = reviews?.filter(r => r.isApproved).slice(0, 3) || [];
  const featured        = featuredItems?.slice(0, 3) || [];

  const fallbackDishes = [
    { id: 1, name: "Crispy Pata",    price: 695, description: "Deep-fried pork knuckle until golden and crackling, served with sawsawan dipping sauce.", imageUrl: "/images/crispy-pata.png",    isFeatured: true },
    { id: 2, name: "Bulalo",         price: 520, description: "Slow-simmered beef shank and marrow bones with corn and vegetables in a clear, rich broth.", imageUrl: "/images/bulalo.png",         isFeatured: false },
    { id: 3, name: "Kinilaw na Tuna",price: 380, description: "Fresh tuna ceviche with vinegar, ginger, red onion, and chili — a true island classic.", imageUrl: "/images/kinilaw-na-tuna.png", isFeatured: false },
  ] as any[];

  const fallbackReviews = [
    { id: 1, customerName: "Maria Santos", rating: 5, comment: "The best crispy pata on the island! The garden ambiance makes it incredibly relaxing after a long day of surfing." },
    { id: 2, customerName: "James Wilson", rating: 5, comment: "Exceptional service and the seafood is incredibly fresh. A hidden gem in Dapa that shouldn't be missed." },
    { id: 3, customerName: "Ana Reyes",    rating: 5, comment: "The kinilaw na tuna was unbelievably good. Felt like true Siargao flavors. Will be back every visit." },
  ] as any[];

  return (
    <div className="flex flex-col overflow-x-hidden bg-background">

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[640px] flex flex-col justify-end bg-zinc-950">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/buffet-spread.png"
            alt="Hangout Alley Siargao buffet"
            className="w-full h-full object-cover"
            style={{ objectPosition: "60% center", animation: "ha-blur-in 1.8s cubic-bezier(0.25,1,0.5,1) 0ms both" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/65 to-zinc-900/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 via-zinc-950/20 to-transparent" />
        </div>

        <div className="relative z-10 container px-4 md:px-6 pb-4">
          <div style={heroAnim(200)} className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-sm border border-white/12 rounded-full px-4 py-1.5 mb-6">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400/35 text-amber-400/35"}`} />
              ))}
            </div>
            <span className="text-white/85 text-xs font-medium">4.7 on Google · Siargao's Favorite</span>
          </div>

          <div className="mb-6">
            <div style={heroAnim(350)} className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight">Island</div>
            <div style={heroAnim(470)} className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight">Dining,</div>
            <div style={heroAnim(590)} className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white/50 leading-none tracking-tight italic">Perfected.</div>
          </div>

          <p style={heroAnim(760)} className="text-white/50 text-lg max-w-lg mb-10 font-light leading-relaxed">
            Lush garden setting, spectacular crispy pata, and fresh seafood served with genuine island warmth in Dapa, Siargao.
          </p>

          <div style={heroAnim(900)} className="flex flex-wrap gap-3 pb-16">
            <Link href="/reserve">
              <Button size="lg" style={{ background: "hsl(36 97% 52%)", color: "#fff" }} className="h-13 px-8 text-base rounded-full font-semibold shadow-lg shadow-amber-500/25 transition-all duration-200 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97]">
                Book a Table
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="h-13 px-8 text-base border-white/25 text-white hover:bg-white/8 hover:text-white rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]">
                View Menu <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div style={{ animation: "ha-fade-in 1s ease 1400ms both" }} className="absolute bottom-6 right-6 z-10 hidden md:flex flex-col items-center gap-2">
          <div className="h-12 w-px bg-gradient-to-b from-white/0 to-white/20" />
          <span className="text-white/25 text-[10px] uppercase tracking-[0.3em] rotate-90 origin-center translate-x-6">Scroll</span>
        </div>
      </section>

      {/* ══ STATS STRIP ═════════════════════════════════════════ */}
      <AnimateIn animation="fade-up" duration={600} threshold={0.4}>
        <section className="border-y border-border/60 bg-card/60 backdrop-blur-sm py-6">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: <ChefHat className="w-5 h-5" />,          value: "5+",   label: "Years in Siargao" },
                { icon: <UtensilsCrossed className="w-5 h-5" />,  value: "20+",  label: "Signature Dishes" },
                { icon: <Users className="w-5 h-5" />,            value: "200+", label: "Happy Guests" },
                { icon: <Star className="w-5 h-5 fill-current" />, value: "4.7",  label: "Google Rating" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1.5">
                  <div className="text-accent mb-0.5">{stat.icon}</div>
                  <p className="font-serif text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimateIn>

      {/* ══ OUR STORY ═══════════════════════════════════════════ */}
      <section className="py-24 md:py-32 overflow-hidden relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            <AnimateIn animation="slide-left" duration={900} className="relative">
              {/* Glowing orange border accent */}
              <div className="absolute -top-3 -left-3 w-full h-full rounded-2xl border border-accent/20 pointer-events-none" />
              <div className="absolute -top-3 -left-3 w-24 h-24 rounded-tl-2xl border-t-2 border-l-2 border-accent/60 pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-24 h-24 rounded-br-2xl border-b-2 border-r-2 border-accent/60 pointer-events-none" />

              <img
                src="/images/bbq-pork-ribs.png"
                alt="BBQ Pork Ribs at Hangout Alley"
                className="w-full aspect-[4/5] object-cover rounded-2xl relative z-10 shadow-2xl"
              />

              <div
                className="absolute -bottom-6 -right-6 bg-card border border-border/80 rounded-2xl p-5 shadow-2xl z-20 hidden sm:block"
                style={{ animation: "ha-scale-in 700ms cubic-bezier(0.16,1,0.3,1) 600ms both, ha-float 4s ease-in-out 1500ms infinite" }}
              >
                <p className="font-serif text-4xl font-bold text-accent leading-none">4.7</p>
                <div className="flex gap-0.5 my-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400/20 text-amber-400/20"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">200+ happy guests</p>
              </div>
            </AnimateIn>

            <AnimateIn animation="slide-right" duration={900}>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">Our Story</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Where Siargao<br />Comes Together<br />to Eat
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-5">
                Nestled along the quiet streets of Dapa, Hangout Alley was born from a simple belief — that great food shared in a beautiful setting creates memories that last a lifetime.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Every dish is crafted from locally sourced ingredients, cooked with traditions passed down through generations. From the crackling skin of our signature crispy pata to the citrusy freshness of our kinilaw, this is the taste of the island, served with love.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-10 p-5 rounded-2xl bg-card border border-border/50">
                {[
                  { value: "5+",  label: "Years Serving" },
                  { value: "20+", label: "Dishes" },
                  { value: "10",  label: "Tables" },
                ].map((stat, i) => (
                  <AnimateIn key={stat.value} animation="count" delay={i * 100} duration={700} threshold={0.3} className="text-center">
                    <p className="font-serif text-3xl font-bold text-accent">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </AnimateIn>
                ))}
              </div>

              <Link href="/menu">
                <Button variant="outline" className="rounded-full px-6 gap-2 border-border/80 hover:border-accent/60 hover:text-accent transition-all duration-200 hover:scale-[1.03]">
                  See Our Full Menu <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ══ PHOTO STRIP ═════════════════════════════════════════ */}
      <AnimateIn animation="fade-in" duration={800} threshold={0.1}>
        <section className="py-4 overflow-hidden">
          <div className="flex gap-3 px-4 overflow-x-auto scrollbar-none">
            {[
              "/images/lumpiang-shanghai.png",
              "/images/lechon-kawali.png",
              "/images/mango-calamansi-shake.png",
              "/images/kinilaw-na-tuna.png",
              "/images/pancit-bihon-guisado.png",
              "/images/bbq-pork-ribs.png",
            ].map((src, i) => (
              <div key={i} className="shrink-0 w-48 h-36 md:w-64 md:h-48 rounded-xl overflow-hidden">
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </section>
      </AnimateIn>

      {/* ══ FEATURED DISHES ═════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="container px-4 md:px-6 relative z-10">
          <AnimateIn animation="fade-up" duration={700}>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div>
                <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Our Specialties</p>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  A Taste of<br />the Island
                </h2>
              </div>
              <Link href="/menu">
                <Button variant="outline" className="rounded-full px-6 shrink-0 gap-2 border-border/70 hover:border-accent/60 hover:text-accent transition-all hover:scale-[1.03]">
                  Explore Full Menu <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(featured.length > 0 ? featured : fallbackDishes).map((item: any, idx: number) => (
              <AnimateIn key={item.id} animation="scale-in" delay={idx * 160} duration={800} threshold={0.08}>
                <div className="group relative overflow-hidden rounded-2xl border border-border/40 shadow-xl hover:shadow-2xl hover:shadow-accent/5 transition-all duration-500 hover:-translate-y-2">
                  <div className="aspect-[3/4] overflow-hidden bg-muted">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full shimmer-bg" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                  </div>

                  <div className="absolute top-4 left-4 font-serif text-7xl font-bold text-white/8 leading-none select-none pointer-events-none">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {item.isFeatured && (
                    <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-accent/30">
                      Signature
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-serif text-2xl font-bold text-white mb-1">{item.name}</h3>
                    <p className="text-white/50 text-sm line-clamp-2 mb-4 overflow-hidden max-h-0 group-hover:max-h-12 transition-all duration-300">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-bold text-lg">₱{Number(item.price).toFixed(2)}</span>
                      <Link href="/order">
                        <Button size="sm" className="bg-accent/20 hover:bg-accent text-white border-0 backdrop-blur-sm rounded-full text-xs transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent/30">
                          Order Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ATMOSPHERIC QUOTE BANNER ════════════════════════════ */}
      <section className="relative py-36 overflow-hidden">
        <AnimateIn animation="blur-in" duration={1200} threshold={0.15} className="absolute inset-0">
          <img src="/images/pancit-bihon-guisado.png" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsl(220 14% 5%) 0%, hsl(220 14% 8%) 50%, hsl(220 14% 5%) 100%)" }} />
        </AnimateIn>

        {/* Ambient orange glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-accent/10 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10 container px-4 md:px-6 text-center max-w-3xl mx-auto">
          <AnimateIn animation="scale-in" duration={900} threshold={0.25}>
            <div className="w-12 h-12 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-8">
              <Quote className="w-5 h-5 text-accent" />
            </div>
            <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground font-bold leading-tight italic mb-8">
              "Not just a meal. A reason to stay one more day in Siargao."
            </blockquote>
            <div
              className="w-16 h-px bg-accent/40 mx-auto mb-6 origin-center"
              style={{ animation: "ha-line-grow 900ms cubic-bezier(0.16,1,0.3,1) 400ms both" }}
            />
            <p className="text-muted-foreground text-sm uppercase tracking-widest">— A guest, 2024</p>
          </AnimateIn>
        </div>
      </section>

      {/* ══ REVIEWS ═════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

        <div className="container px-4 md:px-6">
          <AnimateIn animation="fade-up" duration={700} threshold={0.2}>
            <div className="text-center mb-14">
              <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Testimonials</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">What Our Guests Say</h2>
            </div>
          </AnimateIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(approvedReviews.length > 0 ? approvedReviews : fallbackReviews).map((review: any, idx: number) => (
              <AnimateIn key={review.id} animation="fade-up" delay={idx * 130} duration={750} threshold={0.1}>
                <div className="group bg-card border border-border/50 hover:border-accent/25 rounded-2xl p-7 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="flex gap-1 mb-5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted/30 fill-muted/10"}`} />
                    ))}
                  </div>
                  <p className="text-foreground/80 leading-relaxed mb-6 italic flex-1">"{review.comment}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                    <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/25 flex items-center justify-center font-serif font-bold text-accent text-sm">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">{review.customerName}</p>
                      <p className="text-xs text-muted-foreground">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "long" })
                          : "Verified Guest"}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>

          <AnimateIn animation="fade-up" delay={200} duration={600} threshold={0.5}>
            <div className="mt-10 text-center">
              <Link href="/reviews">
                <Button variant="outline" className="rounded-full px-6 gap-2 border-border/70 hover:border-accent/60 hover:text-accent transition-all hover:scale-[1.03]">
                  Read All Reviews <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* ══ CTA ════════════════════════════════════════════════ */}
      <AnimateIn animation="fade-up" duration={700} threshold={0.2}>
        <section className="relative py-24 overflow-hidden">
          {/* Dark gradient background with orange glow */}
          <div className="absolute inset-0 bg-card border-y border-border/50" />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-40 bg-accent/8 blur-3xl rounded-full" />
          </div>

          <div className="relative z-10 container px-4 md:px-6 text-center">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">Come Visit Us</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ready to Experience<br className="hidden sm:block" /> Hangout Alley?
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Reserve your table, browse the full menu, or place an order online. Open every day, 11 AM to 10 PM.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/reserve">
                <Button size="lg" style={{ background: "hsl(36 97% 52%)", color: "#fff" }} className="rounded-full px-8 h-13 text-base font-semibold shadow-xl shadow-accent/20 transition-all duration-200 hover:scale-[1.04] hover:brightness-110 active:scale-[0.97]">
                  Book a Table
                </Button>
              </Link>
              <Link href="/order">
                <Button size="lg" variant="outline" className="border-border/70 text-foreground hover:border-accent/60 hover:text-accent rounded-full px-8 h-13 text-base transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]">
                  Order Online
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </AnimateIn>

    </div>
  );
}
