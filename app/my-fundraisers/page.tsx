"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { 
  Edit3, 
  ExternalLink, 
  ArrowLeft, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  LayoutGrid,
  Search,
  Sparkles
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Fundraiser {
  _id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  image: string;
  status: "pending" | "active" | "completed" | "rejected";
  createdAt: string;
}

export default function MyFundraisersPage() {
  const { user } = useUser();
  const router = useRouter();
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchFundraisers();
  }, [user]);

  const fetchFundraisers = async () => {
    try {
      const response = await fetch(`/api/fundraisers?creator=${user?.id}`);
      const data = await response.json();
      setFundraisers(data.fundraisers || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Зөөлөн харагдуулах үүднээс бага зэрэг хүлээлт хийнэ
      setTimeout(() => setLoading(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc]">
      <Header />
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      
      <SignedIn>
        <main className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in duration-1000">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-2">
              <button
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all duration-300 text-sm font-medium mb-2"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1.5" /> 
                Буцах
              </button>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Миний аянууд</h1>
              <p className="text-slate-500 text-lg font-medium opacity-80">Сайн үйлсийн аянуудаа нэг дороос удирдах.</p>
            </div>
            
            <Link href="/fundraisers/create">
              <Button className="h-12 px-8 rounded-2xl shadow-lg shadow-emerald-100 hover:shadow-emerald-200 transition-all duration-500 gap-2 bg-emerald-500 hover:bg-emerald-600 border-none text-white font-bold active:scale-95">
                <Plus className="w-5 h-5" /> Шинэ аян үүсгэх
              </Button>
            </Link>
          </div>

          {loading ? (
            <LoadingGrid />
          ) : fundraisers.length === 0 ? (
            <EmptyState />
          ) : (
            <Tabs defaultValue="all" className="space-y-10">
              <div className="flex items-center border-b border-slate-100/80">
                <TabsList className="bg-transparent h-auto p-0 gap-10">
                  <TabTrigger value="all" label="Бүх аян" count={fundraisers.length} />
                  <TabTrigger value="active" label="Идэвхтэй" count={fundraisers.filter(f => f.status === 'active').length} />
                  <TabTrigger value="pending" label="Хүлээгдэж буй" count={fundraisers.filter(f => f.status === 'pending').length} />
                </TabsList>
              </div>

              <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 outline-none animate-in slide-in-from-bottom-4 duration-700">
                {fundraisers.map((f) => <FundraiserCard key={f._id} fundraiser={f} />)}
              </TabsContent>
              
              <TabsContent value="active" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 outline-none animate-in slide-in-from-bottom-4 duration-700">
                {fundraisers.filter(f => f.status === 'active').map((f) => <FundraiserCard key={f._id} fundraiser={f} />)}
              </TabsContent>

              <TabsContent value="pending" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 outline-none animate-in slide-in-from-bottom-4 duration-700">
                {fundraisers.filter(f => f.status === 'pending').map((f) => <FundraiserCard key={f._id} fundraiser={f} />)}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </SignedIn>
    </div>
  );
}

// Custom Tab Trigger - Энгийн үед тод текст, hover/active үед ногоон зураас
const TabTrigger = ({ value, label, count }: { value: string, label: string, count: number }) => (
  <TabsTrigger 
    value={value} 
    className="group relative bg-transparent shadow-none border-none rounded-none px-0 pb-4 text-slate-900 font-bold text-base transition-all duration-300 data-[state=active]:text-emerald-600"
  >
    <span className="relative z-10">{label}</span>
    <span className="ml-2 text-[10px] bg-slate-100 group-data-[state=active]:bg-emerald-50 px-2 py-0.5 rounded-full transition-colors font-medium">
      {count}
    </span>
    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-emerald-500 scale-x-0 group-hover:scale-x-100 group-data-[state=active]:scale-x-100 transition-transform duration-500 ease-out origin-left" />
  </TabsTrigger>
);

function FundraiserCard({ fundraiser }: { fundraiser: Fundraiser }) {
  const router = useRouter();
  const progress = Math.min((fundraiser.raised / fundraiser.goal) * 100, 100);

  const statusConfig = {
    active: { color: "text-emerald-600 bg-white/90", icon: CheckCircle2 },
    pending: { color: "text-amber-600 bg-white/90", icon: Clock },
    completed: { color: "text-blue-600 bg-white/90", icon: CheckCircle2 },
    rejected: { color: "text-rose-600 bg-white/90", icon: AlertCircle },
  };

  const config = statusConfig[fundraiser.status] || { color: "bg-white", icon: Clock };
  const StatusIcon = config.icon;

  return (
    <div className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.12)] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
      
      {/* Image Container - Overflow hidden fix */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-[2rem]">
        {fundraiser.image ? (
          <img 
            src={fundraiser.image} 
            alt={fundraiser.title} 
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-50">
            <LayoutGrid className="w-10 h-10 text-slate-200" />
          </div>
        )}
        <div className="absolute top-5 left-5 overflow-hidden rounded-xl">
          <Badge className={`${config.color} border-none backdrop-blur-md font-bold px-3 py-1.5 flex items-center gap-2 shadow-sm uppercase text-[10px]`}>
            <StatusIcon className="w-3 h-3" />
            {fundraiser.status}
          </Badge>
        </div>
      </div>

      <div className="p-7">
        <h3 className="font-bold text-slate-900 text-lg leading-tight mb-6 line-clamp-1 group-hover:text-emerald-600 transition-colors duration-300">
          {fundraiser.title}
        </h3>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Цугларсан</p>
              <p className="text-xl font-black text-slate-900 tracking-tight italic">₮{fundraiser.raised.toLocaleString()}</p>
            </div>
            <p className="text-sm font-black text-emerald-500">{Math.round(progress)}%</p>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-[1500ms] ease-in-out shadow-[0_0_8px_rgba(16,185,129,0.3)]" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 h-11 rounded-xl border-slate-100 hover:border-emerald-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 font-bold transition-all duration-300" 
            disabled={fundraiser.status === 'pending'}
            onClick={() => router.push(`/fundraisers/edit/${fundraiser._id}`)}
          >
            <Edit3 className="w-4 h-4 mr-2" /> Засах
          </Button>
          <Button 
            className="flex-1 h-11 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold transition-all duration-500 shadow-sm active:scale-95"
            onClick={() => router.push(`/fundraisers/${fundraiser._id}`)}
          >
            Харах
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white border-2 border-dashed border-emerald-50 rounded-[3rem] animate-in fade-in zoom-in duration-700">
      <div className="p-8 bg-emerald-50 rounded-full mb-8 relative">
        <Search className="w-12 h-12 text-emerald-500 relative z-10" />
        <div className="absolute inset-0 bg-emerald-100 animate-ping rounded-full opacity-30" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Одоогоор аян байхгүй</h3>
      <p className="text-slate-400 mb-10 max-w-sm text-center font-medium">Танд тусламж хэрэгтэй байгаа хэн нэгэнд зориулж анхны аянаа өнөөдөр эхлүүлээрэй.</p>
      <Link href="/fundraisers/create">
        <Button className="bg-emerald-500 hover:bg-emerald-600 h-14 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-emerald-100 active:scale-95 transition-all duration-300">
          Аян үүсгэж эхлэх
        </Button>
      </Link>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-[2rem] border border-slate-50 p-7 space-y-6 shadow-sm">
          <div className="aspect-[16/10] bg-slate-50 animate-pulse rounded-[1.5rem]" />
          <div className="h-6 bg-slate-50 animate-pulse rounded-md w-3/4" />
          <div className="space-y-3">
            <div className="h-2 bg-slate-50 animate-pulse rounded-full" />
            <div className="h-2 bg-slate-50 animate-pulse rounded-full w-1/2" />
          </div>
          <div className="flex gap-3">
            <div className="h-11 bg-slate-50 animate-pulse rounded-xl flex-1" />
            <div className="h-11 bg-slate-50 animate-pulse rounded-xl flex-1" />
          </div>
        </div>
      ))}
    </div>
  );
}