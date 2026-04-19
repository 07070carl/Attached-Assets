import { useGetReviews } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export function AdminReviews() {
  const { data: reviews } = useGetReviews();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Moderation</h1>
        <p className="text-muted-foreground">View and manage customer feedback.</p>
      </div>

      <div className="grid gap-4">
        {reviews?.map((review) => (
          <Card key={review.id} className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{review.customerName}</h3>
                    {review.isApproved ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>
                    ) : (
                      <Badge variant="secondary">Pending Review</Badge>
                    )}
                  </div>
                  <div className="flex gap-1 mb-3 text-accent">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-muted opacity-30"}`} />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-foreground mb-4">"{review.comment}"</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Submitted on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {/* We don't have an updateReview hook generated to toggle isApproved, so this is display-only for now */}
              </div>
            </CardContent>
          </Card>
        ))}

        {reviews?.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}
