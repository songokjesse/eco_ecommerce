import Link from 'next/link';
import Image from 'next/image';
import { Leaf, Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#1e3a2f] text-white pt-16">
            <div className="container mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative h-10 w-40">
                                <Image
                                    src="/logo.png"
                                    alt="CircuCity Logo"
                                    fill
                                    className="object-contain object-left"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
                            Your trusted marketplace for eco-conscious and organic products that help reduce environmental impact.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-bold mb-6 text-white text-base">Quick Links</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">All Products</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Swap Market</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Eco Tokens</Link></li>
                            <li><Link href="/dashboard" className="hover:text-[#fad050] transition-colors">My Dashboard</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Policies */}
                    <div>
                        <h3 className="font-bold mb-6 text-white text-base">Policies</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Shipping Policy</Link></li>
                            <li><Link href="#" className="hover:text-[#fad050] transition-colors">Return Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Connect With Us */}
                    <div>
                        <h3 className="font-bold mb-6 text-white text-base">Connect With Us</h3>
                        <div className="space-y-6">
                            <a href="mailto:hello@circucity.com" className="flex items-center gap-3 text-gray-300 hover:text-[#fad050] transition-colors">
                                <Mail className="h-5 w-5" />
                                <span className="text-sm">hello@circucity.com</span>
                            </a>

                            <div className="flex items-center gap-4">
                                <Link href="#" className="p-2 bg-[#ffffff]/10 rounded-full hover:bg-[#fad050] hover:text-[#1e3a2f] transition-all">
                                    <Facebook className="h-4 w-4" />
                                </Link>
                                <Link href="#" className="p-2 bg-[#ffffff]/10 rounded-full hover:bg-[#fad050] hover:text-[#1e3a2f] transition-all">
                                    <Twitter className="h-4 w-4" />
                                </Link>
                                <Link href="#" className="p-2 bg-[#ffffff]/10 rounded-full hover:bg-[#fad050] hover:text-[#1e3a2f] transition-all">
                                    <Instagram className="h-4 w-4" />
                                </Link>
                                <Link href="#" className="p-2 bg-[#ffffff]/10 rounded-full hover:bg-[#fad050] hover:text-[#1e3a2f] transition-all">
                                    <Linkedin className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-[#fad050] py-4">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#1e3a2f] font-medium">
                    <p>© 2026 CircuCity. All rights reserved.</p>
                    <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" />
                        <span>Committed to sustainability</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
