"use client";

import Link from 'next/link';
import { ChevronDown, Globe, Check } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/components/context/LanguageContext';

export function TopBar() {
    const { language, setLanguage, t } = useLanguage();

    return (
        <div className="bg-[#fad050] text-[#1e3a2f] py-2 text-xs font-medium">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">

                {/* Left Side: Promo Message */}
                <div className="flex items-center gap-2">
                    <span className="font-bold">{t("free_shipping")}</span>
                </div>

                {/* Right Side: Links & Utility */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 hidden md:flex">
                        <Link href="#" className="hover:underline">{t("swap_market")}</Link>
                        <Link href="#" className="hover:underline">{t("eco_tokens")}</Link>
                        <Link href="#" className="hover:underline">{t("track_impact")}</Link>
                        <Link href="/become-seller" className="hover:underline">{t("become_seller")}</Link>
                        <Link href="#" className="hover:underline">{t("leaderboard")}</Link>
                    </div>

                    <div className="flex items-center border-l border-[#1e3a2f]/20 pl-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="flex items-center gap-1 cursor-pointer outline-none hover:opacity-80">
                                <Globe className="h-3 w-3" />
                                <span>{language === 'EN' ? 'US / EN' : 'SE / SV'}</span>
                                <ChevronDown className="h-3 w-3" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[150px] bg-white">
                                <DropdownMenuItem onClick={() => setLanguage('EN')} className="flex items-center justify-between cursor-pointer">
                                    <span>English (US)</span>
                                    {language === 'EN' && <Check className="h-3 w-3" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setLanguage('SE')} className="flex items-center justify-between cursor-pointer">
                                    <span>Svenska (SE)</span>
                                    {language === 'SE' && <Check className="h-3 w-3" />}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

            </div>
        </div>
    );
}
