import Link from 'next/link';
import { Leaf, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
    return (
        <footer className="bg-[#1e3a2f] text-white pt-16 pb-8">
            {/* Newsletter / Partner Section */}
            <div className="container mx-auto px-4 mb-16">
                <div className="bg-[#2d4a3e] rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md relative z-10">
                        <div className="inline-flex items-center gap-2 bg-[#ffffff]/10 px-3 py-1 rounded-full w-fit mb-4">
                            <Leaf className="h-3 w-3 text-[#fad050]" />
                            <span className="text-[10px] font-bold text-[#fad050] uppercase tracking-wide">For Sellers</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Partner with CircuCity</h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Join our marketplace of eco-conscious sellers. Reach customers who care about the planet and grow your sustainable business.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <Button className="bg-[#fad050] hover:bg-[#eaca40] text-[#1e3a2f] font-bold rounded-full px-8 py-6">
                            Become a Seller <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    {/* Decorative Shop Icon Background */}
                    <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                        <Leaf className="h-64 w-64" />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Leaf className="h-6 w-6 text-[#fad050]" />
                            <span className="text-xl font-bold">CircuCity</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
                            Your trusted marketplace for eco-conscious and highly sustainable living. Reduce environmental impact.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold mb-4 text-sm">Quick Links</h3>
                        <ul className="space-y-2 text-xs text-gray-400">
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">All Products</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Eco Tokens</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">My Dashboard</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h3 className="font-bold mb-4 text-sm">Policies</h3>
                        <ul className="space-y-2 text-xs text-gray-400">
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Shipping Policy</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Return Policy</Link></li>
                        </ul>
                    </div>

                    {/* Connect With Us */}
                    <div>
                        <h3 className="font-bold mb-4 text-sm">Connect With Us</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <Link href="#" className="p-2 bg-[#2d4a3e] rounded-full hover:bg-[#fad050] hover:text-[#1e3a2f] transition-all">
                                <Facebook className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-[#2d4a3e] rounded-full hover:bg-[#fad050] hover:text-[#1e3a2f] transition-all">
                                <Twitter className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-[#2d4a3e] rounded-full hover:bg-[#fad050] hover:text-[#1e3a2f] transition-all">
                                <Instagram className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="p-2 bg-[#2d4a3e] rounded-full hover:bg-[#fad050] hover:text-[#1e3a2f] transition-all">
                                <Linkedin className="h-4 w-4" />
                            </Link>
                        </div>
                        <div className="start-journey-cta mt-6 text-center">
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[#fad050] mb-2"><Leaf className="h-6 w-6" /></span>
                                <h4 className="font-bold">Start Your Sustainable Journey Today</h4>
                                <p className="text-gray-400 text-xs mb-4">Join thousands of conscious consumers making a difference with every purchase.</p>
                                <Button className="bg-[#fad050] hover:bg-[#eaca40] text-[#1e3a2f] font-bold rounded-full px-6 py-4 h-auto text-xs">
                                    Shop Products <ArrowRight className="ml-2 h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#2d4a3e] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
                    <p>© 2026 CircuCity. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <Leaf className="h-3 w-3" />
                        <span>Committed to Sustainability</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
