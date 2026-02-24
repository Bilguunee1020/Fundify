"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { ArrowLeft, Heart, Share2, Users, DollarSign, Calendar, TrendingUp, Target, CheckCircle, Clock, Leaf, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface Fundraiser {
  _id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  image: string;
  forWhom: string;
  creator: string;
  status: string;
  createdAt: string;
}

export default function FundraiserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchFundraiser();
    }
  }, [params.id]);

  const fetchFundraiser = async () => {
    try {
      const response = await fetch(`/api/fundraisers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setFundraiser(data.fundraiser);
      } else {
        router.push("/404");
      }
    } catch (error) {
      console.error("Error fetching fundraiser:", error);
      router.push("/404");
    } finally {
      setLoading(false);
    }
  };

  const handleDonateClick = () => {
    router.push(`/donate/${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!fundraiser) {
    return (
      <div className="min-h-screen bg-[#f0fdf4] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Fundraiser Not Found
          </h1>
          <Link href="/">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min(
    (fundraiser.raised / fundraiser.goal) * 100,
    100,
  );

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-white to-[#f0fdf4]">
          {/* Header Section */}
          <div className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-emerald-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Буцах</span>
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Title & Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              
              {/* Left Side: Info & Description */}
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1">
                      <Target className="w-3.5 h-3.5 mr-1.5" />
                      {fundraiser.category}
                    </Badge>
                    <Badge className="bg-emerald-600 text-white px-3 py-1">
                      {fundraiser.status === "active" ? "Идэвхтэй" : "Дууссан"}
                    </Badge>
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {fundraiser.title}
                  </h1>

                  <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 w-fit">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                      {fundraiser.forWhom === "myself" ? "P" : "S"}
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Зохион байгуулагч</p>
                      <p className="text-slate-900 font-semibold">
                        {fundraiser.forWhom === "myself" ? "Хувийн тусламж" : "Бусдад туслах аян"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Main Image */}
                <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-video">
                  {fundraiser.image ? (
                    <img
                      src={fundraiser.image}
                      alt={fundraiser.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                      <Leaf className="w-16 h-16 text-emerald-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* Description Card */}
                <Card className="border-none shadow-sm bg-white rounded-[2rem] p-4 lg:p-8">
                  <CardHeader className="px-0">
                    <CardTitle className="text-2xl font-bold text-emerald-900 flex items-center gap-2">
                      <div className="w-2 h-8 bg-emerald-600 rounded-full" />
                      Түүх болон зорилго
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-0">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line text-lg">
                      {fundraiser.description}
                    </p>
                    <Separator className="my-8 bg-emerald-50" />
                    <div className="flex items-center gap-4 text-sm text-slate-500 italic">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      Энэхүү хандив нь системээр баталгаажсан бөгөөд ил тод тайлагнагдах болно.
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Side: Donation Sidebar */}
              <div className="space-y-6 lg:sticky lg:top-24">
                <Card className="border-none shadow-2xl shadow-emerald-200/40 rounded-[2rem] overflow-hidden">
                  <div className="bg-emerald-900 p-8 text-white">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-black">₮{fundraiser.raised.toLocaleString()}</span>
                      <span className="text-emerald-300 text-sm font-medium">цугларсан</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-emerald-800" />
                    <div className="flex justify-between mt-4 text-xs font-bold uppercase tracking-widest text-emerald-300">
                      <span>{progressPercentage.toFixed(1)}% гүйцэтгэл</span>
                      <span>Зорилго:₮{fundraiser.goal.toLocaleString()}</span>
                    </div>
                  </div>

                  <CardContent className="p-8 space-y-6 bg-white">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                        <p className="text-xs text-emerald-600 font-bold mb-1 uppercase">Хандивлагчид</p>
                        <p className="text-xl font-bold text-slate-900">0</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-center">
                        <p className="text-xs text-emerald-600 font-bold mb-1 uppercase">Хоног</p>
                        <p className="text-xl font-bold text-slate-900">
                           {Math.floor((Date.now() - new Date(fundraiser.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleDonateClick}
                      disabled={fundraiser.status !== "active"}
                      className="w-full h-16 text-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1 active:scale-95"
                    >
                      <Heart className="w-6 h-6 mr-2 fill-current" />
                      Хандив өгөх
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-14 border-2 border-emerald-100 text-emerald-700 hover:bg-emerald-50 rounded-2xl font-bold"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Түгээх
                    </Button>
                  </CardContent>
                </Card>

                {/* Extra Stats Card */}
                <Card className="border-emerald-100 bg-emerald-50/30 rounded-[2rem]">
                  <CardContent className="p-6 space-y-4">
                    <h4 className="font-bold text-emerald-900 mb-2">Кампанит ажлын мэдээлэл</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Эхэлсэн огноо:</span>
                        <span className="font-semibold text-slate-900">{new Date(fundraiser.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Төлөв:</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Идэвхтэй
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </div>
      </SignedIn>
    </>
  );
}