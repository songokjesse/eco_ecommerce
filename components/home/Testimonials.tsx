import prisma from '@/lib/prisma';
import Image from 'next/image';
import { Star, User } from 'lucide-react';

export async function Testimonials() {
    // Fetch latest 5-star reviews
    const reviews = await prisma.review.findMany({
        where: { rating: 5 },
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
            user: {
                select: {
                    name: true,
                    image: true,
                }
            }
        }
    });

    // Fallback static testimonials if no real reviews exist
    const testimonials = reviews.length > 0 ? reviews.map(r => ({
        id: r.id,
        text: r.comment || "Great product!",
        author: r.user.name || "Anonymous",
        role: "Verified Buyer",
        avatar: r.user.image,
    })) : [
        {
            id: '1',
            text: "CircuCity has transformed how I shop. I love knowing exactly how much CO2 I save with every purchase!",
            author: "Jessica Thompson",
            role: "Eco Enthusiast",
            avatar: "/placeholder-avatar-1.jpg"
        },
        {
            id: '2',
            text: "The eco-token rewards system is genius. It actually incentivizes sustainable choices.",
            author: "David Chen",
            role: "Sustainable Living Blogger",
            avatar: "/placeholder-avatar-2.jpg"
        },
        {
            id: '3',
            text: "Quality products and fast shipping. Plus, I feel good about every purchase I make here.",
            author: "Maria Gonzalez",
            role: "Green Consumer",
            avatar: "/placeholder-avatar-3.jpg"
        }
    ];

    return (
        <section className="py-16 container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">What Our Community Says</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="bg-[#fcf9f2] p-8 rounded-2xl relative h-full flex flex-col">
                        <div className="flex text-yellow-400 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                        </div>

                        <p className="text-foreground italic mb-6 text-sm leading-relaxed flex-grow">
                            &quot;{testimonial.text}&quot;
                        </p>

                        <div className="flex items-center gap-3 mt-auto">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative flex items-center justify-center">
                                {testimonial.avatar && !testimonial.avatar.includes('placeholder') ? (
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User className="w-5 h-5 text-gray-500" />
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-sm text-foreground">{testimonial.author}</div>
                                <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
