import { Leaf, Recycle, Heart } from 'lucide-react';

export function Benefits() {
    return (
        <section className="py-16 px-4 bg-gradient-to-br from-[#2D5F3F] to-[#1a3a28] text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F4D35E]/20 backdrop-blur-sm rounded-full mb-6">
                            <Recycle className="w-5 h-5 text-[#F4D35E]" />
                            <span className="text-sm text-[#F4D35E]">New Feature</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl mb-6">Discover Our Swap Market</h2>

                        <p className="text-xl text-gray-200 mb-8">
                            Join the circular economy! Trade items you no longer need for things you want. Reduce waste, save money, and connect with our eco-conscious community.
                        </p>

                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div>
                                <div className="text-3xl text-[#F4D35E] mb-2">1,247</div>
                                <div className="text-sm text-gray-300">Active Items</div>
                            </div>
                            <div>
                                <div className="text-3xl text-[#F4D35E] mb-2">892</div>
                                <div className="text-sm text-gray-300">Swaps Made</div>
                            </div>
                            <div>
                                <div className="text-3xl text-[#F4D35E] mb-2">3.2k</div>
                                <div className="text-sm text-gray-300">Members</div>
                            </div>
                        </div>

                        <a href="/swap" className="inline-flex items-center gap-2 px-8 py-4 bg-[#F4D35E] text-[#2D5F3F] rounded-full hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Explore Swap Market
                            <Recycle className="w-5 h-5" />
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all">
                            <div className="w-12 h-12 bg-[#F4D35E]/20 rounded-full flex items-center justify-center mb-4">
                                <Recycle className="w-6 h-6 text-[#F4D35E]" />
                            </div>
                            <h3 className="text-lg mb-2">Trade Items</h3>
                            <p className="text-sm text-gray-300">Swap pre-loved items with community members</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all">
                            <div className="w-12 h-12 bg-[#F4D35E]/20 rounded-full flex items-center justify-center mb-4">
                                <Recycle className="w-6 h-6 text-[#F4D35E]" />
                            </div>
                            <h3 className="text-lg mb-2">Reduce Waste</h3>
                            <p className="text-sm text-gray-300">Give items a second life and reduce landfill</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all">
                            <div className="w-12 h-12 bg-[#F4D35E]/20 rounded-full flex items-center justify-center mb-4">
                                <Leaf className="w-6 h-6 text-[#F4D35E]" />
                            </div>
                            <h3 className="text-lg mb-2">Earn Tokens</h3>
                            <p className="text-sm text-gray-300">Get EcoTokens for every successful swap</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all">
                            <div className="w-12 h-12 bg-[#F4D35E]/20 rounded-full flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-[#F4D35E]" />
                            </div>
                            <h3 className="text-lg mb-2">Build Community</h3>
                            <p className="text-sm text-gray-300">Connect with like-minded eco-warriors</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
