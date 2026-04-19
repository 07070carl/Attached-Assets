import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetFeaturedItems, useGetReviews } from "@workspace/api-client-react";
import { Star, MapPin, Clock, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Home() {
  const { data: featuredItems } = useGetFeaturedItems();
  const { data: reviews } = useGetReviews();

  const approvedReviews = reviews?.filter(r => r.isApproved).slice(0, 3) || [];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center bg-zinc-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <img 
            src="/images/crispy-pata.png" 
            alt="Hangout Alley Atmosphere" 
            className="w-full h-full object-cover object-center opacity-80"
          />
        </div>
        <div className="relative z-20 container text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight text-white">
            Island Dining,<br />Perfected.
          </h1>
          <p className="text-lg md:text-xl text-zinc-200 mb-10 max-w-2xl mx-auto font-light">
            Experience the quiet joy of Siargao. Lush garden setting, spectacular crispy pata, and fresh seafood served with genuine island warmth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/reserve">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90">
                Book a Table
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white">
                View Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-none bg-muted/50">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Location</h3>
                <p className="text-muted-foreground">Dapa, Siargao Island<br />Surigao del Norte, Philippines</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-muted/50">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Hours</h3>
                <p className="text-muted-foreground">Monday - Sunday<br />11:00 AM - 10:00 PM</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-muted/50">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Contact</h3>
                <p className="text-muted-foreground">+63 912 345 6789<br />hello@hangoutalley.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Our Specialties</h2>
            <h3 className="text-4xl font-serif font-bold text-foreground">A Taste of the Island</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems?.slice(0, 3).map((item) => (
              <Card key={item.id} className="overflow-hidden group hover:shadow-lg transition-shadow border-none bg-card">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {item.imageUrl ? (
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No image available
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif text-xl font-semibold">{item.name}</h4>
                    <span className="font-medium text-primary">₱{item.price.toFixed(2)}</span>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
                </CardContent>
              </Card>
            ))}
            
            {/* Fallback items if none are featured */}
            {(!featuredItems || featuredItems.length === 0) && (
              <>
                <Card className="overflow-hidden group hover:shadow-lg transition-shadow border-none bg-card">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src="/images/crispy-pata.png" alt="Crispy Pata" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-xl font-semibold">Signature Crispy Pata</h4>
                      <span className="font-medium text-primary">₱850.00</span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">Perfectly deep-fried pork knuckle with tender meat and crackling skin, served with our special soy-vinegar dip.</p>
                  </CardContent>
                </Card>
                <Card className="overflow-hidden group hover:shadow-lg transition-shadow border-none bg-card">
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img src="/images/seafood.png" alt="Seafood Platter" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-xl font-semibold">Island Seafood Platter</h4>
                      <span className="font-medium text-primary">₱1200.00</span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">Fresh catch of the day including grilled squid, shrimp, and tuna, served with native sauces.</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/menu">
              <Button variant="outline" size="lg" className="px-8">
                Explore Full Menu
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">Testimonials</h2>
            <h3 className="text-4xl font-serif font-bold text-foreground">What Our Guests Say</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {approvedReviews.length > 0 ? (
              approvedReviews.map((review) => (
                <Card key={review.id} className="bg-card border-none shadow-sm">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < review.rating ? "fill-current" : "text-muted opacity-30"}`} />
                      ))}
                    </div>
                    <p className="text-foreground italic mb-6">"{review.comment}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold">
                        {review.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{review.customerName}</p>
                        <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              // Fallback reviews
              <>
                <Card className="bg-card border-none shadow-sm">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground italic mb-6">"The best crispy pata on the island! The garden ambiance makes it incredibly relaxing after a long day of surfing."</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold">M</div>
                      <div>
                        <p className="font-semibold text-sm">Maria Santos</p>
                        <p className="text-xs text-muted-foreground">Local Guide</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-none shadow-sm">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-foreground italic mb-6">"Exceptional service and the seafood is incredibly fresh. A hidden gem in Dapa that shouldn't be missed."</p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold">J</div>
                      <div>
                        <p className="font-semibold text-sm">James Wilson</p>
                        <p className="text-xs text-muted-foreground">Traveler</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
