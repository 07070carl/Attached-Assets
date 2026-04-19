import { useState } from "react";
import { useGetReviews, useCreateReview } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";

const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters."),
  rating: z.number().min(1, "Please select a rating.").max(5),
  comment: z.string().optional(),
});

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`focus:outline-none transition-colors ${
            star <= value ? "text-accent" : "text-muted hover:text-accent/50"
          }`}
        >
          <Star className={`h-8 w-8 ${star <= value ? "fill-current" : ""}`} />
        </button>
      ))}
    </div>
  );
}

export function Reviews() {
  const { data: reviews } = useGetReviews();
  const createReview = useCreateReview();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  const approvedReviews = reviews?.filter(r => r.isApproved) || [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      rating: 5,
      comment: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createReview.mutate(
      {
        data: {
          customerName: values.customerName,
          rating: values.rating,
          comment: values.comment || null,
        }
      },
      {
        onSuccess: () => {
          toast({
            title: "Review Submitted",
            description: "Thank you for your feedback! It will appear once approved.",
          });
          setShowForm(false);
          form.reset();
        }
      }
    );
  }

  return (
    <div className="container py-12 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary mb-2">Guest Reviews</h1>
          <p className="text-muted-foreground">See what others are saying about their experience.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} size="lg">
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-10 border-none shadow-md bg-muted/30">
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        <StarRating 
                          value={field.value} 
                          onChange={field.onChange} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comments (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your food, service, and the ambiance..." 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createReview.isPending}>
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {approvedReviews.length > 0 ? (
          approvedReviews.map((review) => (
            <Card key={review.id} className="bg-card border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-muted opacity-30"}`} />
                  ))}
                </div>
                {review.comment && (
                  <p className="text-foreground italic mb-4 text-sm">"{review.comment}"</p>
                )}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-xs">
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
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No reviews yet. Be the first to share your experience!
          </div>
        )}
      </div>
    </div>
  );
}
