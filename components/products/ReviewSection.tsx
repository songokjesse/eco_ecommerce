'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { addReview } from '@/app/actions/review';
import { formatDistanceToNow } from 'date-fns';

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    user: {
        name: string | null;
        image: string | null;
    };
}

interface ReviewSectionProps {
    productId: string;
    reviews: Review[];
    averageRating: number;
    totalReviews: number;
}

export function ReviewSection({ productId, reviews, averageRating, totalReviews }: ReviewSectionProps) {
    const { isSignedIn } = useAuth();
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await addReview(productId, rating, comment);
            if (result.success) {
                toast.success('Review submitted successfully!');
                setRating(0);
                setComment('');
                // Ideally we would optimistically add the review to the list here, 
                // but revalidatePath in the server action will trigger a refresh.
            } else {
                toast.error(result.error || 'Failed to submit review');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-12 border-t border-gray-100" id="reviews">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">Customer Reviews</h2>

            {/* Summary */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'fill-current' : 'text-gray-300'}`}
                        />
                    ))}
                </div>
                <div className="text-lg font-medium text-gray-900">
                    {averageRating.toFixed(1)} <span className="text-gray-500 text-base font-normal">({totalReviews} reviews)</span>
                </div>
            </div>

            {/* Review Form */}
            {isSignedIn ? (
                <div className="bg-gray-50 p-6 rounded-2xl mb-12">
                    <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        <Textarea
                            placeholder="Share your thoughts about this product..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            className="bg-white"
                            rows={4}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#1e3a2f] hover:bg-[#2d5a45] text-white"
                        >
                            {isSubmitting ? 'Submitting...' : 'Post Review'}
                        </Button>
                    </form>
                </div>
            ) : (
                <div className="bg-gray-50 p-6 rounded-2xl mb-12 text-center">
                    <p className="text-gray-600 mb-4">Please sign in to write a review.</p>
                    {/* Link to sign in could go here */}
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-8">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 italic">No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                        {review.user.image ? (
                                            <img src={review.user.image} alt={review.user.name || 'User'} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-5 h-5 text-gray-500" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-gray-900">{review.user.name || 'Anonymous'}</h4>
                                        <span className="text-sm text-gray-500">{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                                    </div>
                                    <div className="flex text-yellow-400 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}
