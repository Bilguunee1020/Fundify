"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Menu, X, Heart, User, Sparkles } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useLanguage } from "@/lib/LanguageContext";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donateDropdownOpen, setDonateDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/95 backdrop-blur-xl transition-all duration-300">
      {/* Container-ийг илүү өргөн (1440px) болгож, хоёр тал руу нь татсан */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Navigation - Текстийг илүү тод, smooth болгосон */}
          <nav className="flex-1 hidden md:flex items-center gap-6">
            <Link
              href="/search"
              className="group flex items-center gap-2 text-[15px] font-bold text-slate-700 hover:text-primary transition-all duration-300 ease-in-out"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Хайх</span>
            </Link>
            
            <div
              className="relative"
              onMouseEnter={() => setDonateDropdownOpen(true)}
              onMouseLeave={() => setDonateDropdownOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-[15px] font-bold text-slate-700 hover:text-primary transition-all duration-300">
                Хандив өгөх
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${donateDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {donateDropdownOpen && (
                <div className="absolute top-full left-0 pt-4 w-[450px] animate-in fade-in slide-in-from-top-3 duration-300 ease-out">
                  <div className="bg-white border border-border rounded-3xl shadow-2xl shadow-primary/10 p-4 overflow-hidden">
                    <Link
                      href="/fundraisers"
                      className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group"
                    >
                      <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        <Search className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-extrabold text-slate-900">Бүх төслүүд</div>
                        <div className="text-sm text-slate-500 font-medium">Шинэ болон онцлох хандивүүд</div>
                      </div>
                    </Link>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {[
                        { href: "/categories", label: "Ангилал", icon: Heart },
                        { href: "/categories?type=crisis", label: "Яаралтай", icon: Sparkles },
                        { href: "/social-impact-funds", label: "Сангууд", icon: Heart },
                        { href: "/supporter-space", label: "Тусламж", icon: User },
                      ].map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex flex-col gap-3 p-4 rounded-2xl border border-transparent hover:border-border hover:bg-slate-50 hover:shadow-sm transition-all group"
                        >
                          <item.icon className="w-6 h-6 text-primary group-hover:scale-125 transition-transform duration-300" />
                          <span className="font-bold text-sm text-slate-800">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/fundraisers"
              className="text-[15px] font-bold text-slate-700 hover:text-primary transition-all duration-300 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-primary hover:after:w-full after:transition-all"
            >
              Хандив цуглуулагчид
            </Link>
          </nav>

          {/* Logo - Төв хэсэгт илүү тод */}
          <Link href="/" className="flex items-center gap-3 group px-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full group-hover:bg-primary/40 transition-all" />
              <div className="relative bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Heart className="w-6 h-6 text-white fill-white/20" />
              </div>
            </div>
            <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary to-slate-900 tracking-tighter">
              Bayn Tugo
            </span>
          </Link>

          {/* Right Navigation */}
          <nav className="flex-1 hidden md:flex items-center gap-4 justify-end">
            <button className="px-3 py-2 text-[15px] font-bold text-slate-600 hover:text-primary transition-colors">
              Тухай
            </button>
            
            <div className="h-6 w-[1px] bg-slate-200 mx-2" />

            <SignedOut>
              <Link
                href="/auth/sign-in"
                className="px-4 py-2 text-[15px] font-bold text-slate-700 hover:text-primary transition-all"
              >
                Нэвтрэх
              </Link>
              <Button asChild className="h-12 px-8 rounded-full font-black text-md shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95 bg-primary">
                <Link href="/donate">Эхлүүлэх</Link>
              </Button>
            </SignedOut>

            <SignedIn>
              <Link
                href="/my-fundraisers"
                className="flex items-center gap-2 px-4 py-2 text-[15px] font-bold text-slate-700 hover:bg-slate-50 rounded-full transition-all"
              >
                <User className="w-5 h-5" />
                Профайл
              </Link>
              <div className="ml-2 scale-110">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 hover:bg-slate-100 rounded-2xl transition-all active:scale-90"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>
    </header>
  );
}