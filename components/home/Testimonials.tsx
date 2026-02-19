
import Image from 'next/image';
import { Star, User } from 'lucide-react';

export function Testimonials() {
    const testimonials = [
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
        <section className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl text-center mb-12">What Our Community Says</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-[#F5F0E6] p-8 rounded-3xl shadow-sm">
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-[#F4D35E] text-[#F4D35E]" />
                                ))}
                            </div>

                            <p className="text-gray-700 mb-6">
                                &quot;{testimonial.text}&quot;
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-full overflow-hidden relative flex items-center justify-center bg-gray-200">
                                    {testimonial.avatar && !testimonial.avatar.includes('placeholder') ? (
                                        <Image
                                            src={testimonial.avatar}
                                            alt={testimonial.author}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900">{testimonial.author}</div>
                                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
