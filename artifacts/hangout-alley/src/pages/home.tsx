import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetFeaturedItems, useGetReviews } from "@workspace/api-client-react";
import { Star, ArrowRight, Quote } from "lucide-react";

export function Home() {
  const { data: featuredItems } = useGetFeaturedItems();
  const { data: reviews } = useGetReviews();

  const approvedReviews = reviews?.filter(r => r.isApproved).slice(0, 3) || [];
  const featured = featuredItems?.slice(0, 3) || [];

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[640px] flex flex-col justify-end bg-zinc-950">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/images/crispy-pata.png"
            alt="Hangout Alley Siargao"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-900/60 to-zinc-900/20" />
        </div>

        {/* Rating pill */}
        <div className="relative z-10 container px-4 md:px-6 pb-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-6">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className={`w-3 h-3 ${i <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400/40 text-amber-400/40"}`} />
              ))}
            </div>
            <span className="text-white/90 text-xs font-medium">4.7 on Google · Siargao's Favorite</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-none tracking-tight mb-6 max-w-3xl">
            Island<br />Dining,<br />
            <span className="italic text-white/70">Perfected.</span>
          </h1>

          <p className="text-white/60 text-lg max-w-lg mb-10 font-light leading-relaxed">
            Lush garden setting, spectacular crispy pata, and fresh seafood served with genuine island warmth in Dapa, Siargao.
          </p>

          <div className="flex flex-wrap gap-3 pb-16">
            <Link href="/reserve">
              <Button size="lg" className="h-13 px-8 text-base bg-white text-zinc-900 hover:bg-white/90 rounded-full font-semibold">
                Book a Table
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="h-13 px-8 text-base border-white/25 text-white hover:bg-white/10 hover:text-white rounded-full">
                View Menu
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 right-6 z-10 hidden md:flex flex-col items-center gap-2">
          <div className="h-12 w-px bg-gradient-to-b from-white/0 to-white/30" />
          <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] rotate-90 origin-center translate-x-6">Scroll</span>
        </div>
      </section>

      {/* ── Info Strip ─────────────────────────────────────── */}
      <section className="bg-primary text-primary-foreground py-5">
        <div className="container px-4 md:px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-3 text-sm text-primary-foreground/80">
            <span className="font-medium text-primary-foreground">Open Daily 11 AM – 10 PM</span>
            <span className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
            <span>Dapa, Siargao Island, Philippines</span>
            <span className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
            <span>+63 912 345 6789</span>
            <span className="hidden sm:block w-px h-4 bg-primary-foreground/20" />
            <Link href="/reserve" className="text-primary-foreground underline underline-offset-2 font-medium hover:text-white transition-colors">
              Reserve your table today
            </Link>
          </div>
        </div>
      </section>

      {/* ── Our Story ─────────────────────────────────────── */}
      <section className="py-24 bg-background overflow-hidden">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-primary/15 rounded-2xl" />
              <img
                src="/images/bbq-pork-ribs.png"
                alt="BBQ Pork Ribs at Hangout Alley"
                className="w-full aspect-[4/5] object-cover rounded-2xl relative z-10 shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-xl z-20 hidden sm:block">
                <p className="font-serif text-3xl font-bold text-primary">4.7</p>
                <div className="flex gap-0.5 my-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-3 h-3 ${i <= 4 ? "fill-amber-400 text-amber-400" : "fill-amber-400/30 text-amber-400/30"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Over 200 happy guests</p>
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-4">Our Story</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Where Siargao Comes<br />Together to Eat
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Nestled along the quiet streets of Dapa, Hangout Alley was born from a simple belief — that great food shared in a beautiful setting creates memories that last a lifetime.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-10">
                Every dish is crafted from locally sourced ingredients, cooked with traditions passed down through generations. From the crackling skin of our signature crispy pata to the citrusy freshness of our kinilaw, this is the taste of the island, served with love.
              </p>
              <div className="flex gap-10 mb-10">
                <div>
                  <p className="font-serif text-4xl font-bold text-foreground">5+</p>
                  <p className="text-sm text-muted-foreground mt-1">Years Serving Siargao</p>
                </div>
                <div>
                  <p className="font-serif text-4xl font-bold text-foreground">20+</p>
                  <p className="text-sm text-muted-foreground mt-1">Signature Dishes</p>
                </div>
                <div>
                  <p className="font-serif text-4xl font-bold text-foreground">10</p>
                  <p className="text-sm text-muted-foreground mt-1">Private Tables</p>
                </div>
              </div>
              <Link href="/menu">
                <Button variant="outline" className="rounded-full px-6 gap-2">
                  See Our Full Menu <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Dishes ─────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Our Specialties</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
                A Taste of<br />the Island
              </h2>
            </div>
            <Link href="/menu">
              <Button variant="outline" className="rounded-full px-6 shrink-0 gap-2">
                Explore Full Menu <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(featured.length > 0 ? featured : [
              { id: 1, name: "Crispy Pata", price: 695, description: "Deep-fried pork knuckle until golden and crackling, served with sawsawan dipping sauce.", imageUrl: "/images/crispy-pata.png", isFeatured: true },
              { id: 2, name: "Bulalo", price: 520, description: "Slow-simmered beef shank and marrow bones with corn and vegetables in a clear, rich broth.", imageUrl: "/images/bulalo.png", isFeatured: false },
              { id: 3, name: "Kinilaw na Tuna", price: 380, description: "Fresh tuna ceviche with vinegar, ginger, red onion, and chili — a true island classic.", imageUrl: "/images/kinilaw-na-tuna.png", isFeatured: false },
            ] as any[]).map((item, idx) => (
              <div key={item.id} className="group relative overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="aspect-[3/4] overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/10 to-transparent" />
                </div>

                {/* Number label */}
                <div className="absolute top-4 left-4 font-serif text-6xl font-bold text-white/10 leading-none select-none">
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {item.isFeatured && (
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Signature
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-2xl font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-white/60 text-sm line-clamp-2 mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-lg">₱{Number(item.price).toFixed(2)}</span>
                    <Link href="/order">
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm rounded-full text-xs">
                        Order Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Atmosphere Quote Banner ──────────────────────── */}
      <section className="relative py-32 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/pancit-bihon-guisado.png"
            alt="Hangout Alley atmosphere"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/90 via-zinc-950/70 to-zinc-950/90" />
        </div>
        <div className="relative z-10 container px-4 md:px-6 text-center max-w-3xl mx-auto">
          <Quote className="w-10 h-10 text-primary/40 mx-auto mb-8" />
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-white font-bold leading-tight italic mb-8">
            "Not just a meal. A reason to stay one more day in Siargao."
          </blockquote>
          <p className="text-white/40 text-sm uppercase tracking-widest">— A guest, 2024</p>
        </div>
      </section>

      {/* ── Reviews ─────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Testimonials</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
              What Our Guests Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(approvedReviews.length > 0 ? approvedReviews : [
              { id: 1, customerName: "Maria Santos", rating: 5, comment: "The best crispy pata on the island! The garden ambiance makes it incredibly relaxing after a long day of surfing." },
              { id: 2, customerName: "James Wilson", rating: 5, comment: "Exceptional service and the seafood is incredibly fresh. A hidden gem in Dapa that shouldn't be missed." },
              { id: 3, customerName: "Ana Reyes", rating: 5, comment: "The kinilaw na tuna was unbelievably good. Felt like true Siargao flavors. Will be back every visit." },
            ] as any[]).map((review) => (
              <div key={review.id} className="relative bg-card border border-border/50 rounded-2xl p-8 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20 fill-muted-foreground/10"}`} />
                  ))}
                </div>
                <p className="text-foreground leading-relaxed mb-8 italic">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-serif font-bold text-primary">
                    {review.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString("en-PH", { year: "numeric", month: "long" }) : "Verified Guest"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/reviews">
              <Button variant="outline" className="rounded-full px-6 gap-2">
                Read All Reviews <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────── */}
      <section className="py-24 bg-primary">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Ready to Experience Hangout Alley?
          </h2>
          <p className="text-primary-foreground/70 text-lg mb-10 max-w-xl mx-auto">
            Reserve your table, browse the full menu, or place an order online. We're open every day.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/reserve">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-8 h-13 text-base font-semibold">
                Book a Table
              </Button>
            </Link>
            <Link href="/order">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-full px-8 h-13 text-base">
                Order Online
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
