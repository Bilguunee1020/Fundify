"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";

import {
  Heart,
  GraduationCap,
  Stethoscope,
  Flame,
  PawPrint,
  TreePine,
  Users,
  Church,
  Trophy,
  HandHeart,
  ArrowLeft,
  ChevronRight,
  Camera,
  CheckCircle2,
} from "lucide-react";

const categories = [
  { id: "medical", name: "Эрүүл мэнд", icon: Stethoscope },
  { id: "memorial", name: "Дурсгал", icon: Heart },
  { id: "emergency", name: "Яаралтай тусламж", icon: Flame },
  { id: "nonprofit", name: "Урлаг, соёл", icon: Users },
  { id: "education", name: "Боловсрол", icon: GraduationCap },
  { id: "animals", name: "Амьтан", icon: PawPrint },
  { id: "environment", name: "Байгаль орчин", icon: TreePine },
  { id: "community", name: "Олон нийт", icon: Users },
  { id: "faith", name: "Шашин шүтлэг", icon: Church },
  { id: "family", name: "Гэр бүл", icon: Users },
  { id: "sports", name: "Спорт", icon: Trophy },
  { id: "volunteer", name: "Сайн дурын ажил", icon: HandHeart },
];

export default function StartFundmePage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    forWhom: "",
    goal: 0,
    title: "",
    description: "",
    category: "",
    image: "",
  });

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/fundraisers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          goal: formData.goal,
          category: formData.category,
          image: formData.image,
          forWhom: formData.forWhom,
          creator: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      });

      if (response.ok) {
        router.push('/my-fundraisers');
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Хандив үүсгэхэд алдаа гарлаа' });
      }
    } catch (error) {
      console.error('Error creating fundraiser:', error);
      setErrors({ submit: 'Алдаа гарлаа. Дахин оролдоно уу.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoNext = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 400);
  };

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-3 gap-3 animate-in fade-in zoom-in-95 duration-500">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleAutoNext("category", cat.id)}
                  className={`group p-4 rounded-2xl border-2 transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-500 to-purple-600 border-transparent text-white shadow-lg scale-95"
                      : "bg-white/60 border-gray-100 hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-full ${isSelected ? "bg-white/20" : "bg-purple-50 group-hover:bg-purple-100"}`}>
                      <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-purple-600"}`} />
                    </div>
                    <span className="text-xs font-semibold">{cat.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
            {[
              { id: "myself", title: "Өөртөө", icon: Heart, desc: "Миний хувийн хэрэгцээнд" },
              { id: "someone_else", title: "Бусдад", icon: Users, desc: "Найз нөхөд эсвэл гэр бүлдээ" }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleAutoNext("forWhom", item.id)}
                className={`w-full p-6 rounded-2xl border-2 flex items-center gap-4 transition-all duration-300 ${
                  formData.forWhom === item.id 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 border-transparent text-white shadow-xl" 
                    : "bg-white/60 border-gray-100 hover:border-purple-300"
                }`}
              >
                <item.icon className={`w-8 h-8 ${formData.forWhom === item.id ? "text-white" : "text-purple-500"}`} />
                <div className="text-left">
                  <div className="font-bold text-lg">{item.title}</div>
                  <div className={`text-sm ${formData.forWhom === item.id ? "text-white/80" : "text-gray-500"}`}>{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
             <h2 className="text-2xl font-bold text-gray-800">Зорилтот дүнгээ оруулна уу</h2>
             <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-purple-600">₮</span>
                <input 
                  type="number" 
                  autoFocus
                  onChange={(e) => setFormData({...formData, goal: parseFloat(e.target.value)})}
                  className="w-full pl-12 pr-4 py-6 text-4xl font-bold bg-transparent border-b-4 border-purple-200 focus:border-purple-500 outline-none transition-all"
                  placeholder="0"
                />
             </div>
             <p className="text-gray-500">Ихэнх хандивын аянууд 500,000₮-өөс 5,000,000₮ хооронд байдаг.</p>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Зураг нэмэх</h2>
            <div className="relative group cursor-pointer border-2 border-dashed border-purple-200 rounded-3xl p-8 bg-white/40 hover:bg-white transition-all text-center">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, image: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="mx-auto max-h-48 rounded-2xl shadow-lg object-cover" />
              ) : (
                <div className="py-8">
                  <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-purple-600 font-bold">Зураг оруулах бол энд дарна уу</p>
                </div>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Түүхээ хуваалцана уу</h2>
            <input
              type="text"
              placeholder="Хандивын аяны гарчиг"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xl font-bold p-4 rounded-xl bg-white/50 border-2 border-transparent focus:border-purple-500 outline-none shadow-sm"
            />
            <textarea
              placeholder="Ямар зорилгоор хандив цуглуулж байгаа тухайгаа бичнэ үү..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-[150px] p-4 rounded-xl bg-white/50 border-2 border-transparent focus:border-purple-500 outline-none shadow-sm resize-none"
            />
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Хянах</h2>
            <div className="bg-white/80 p-6 rounded-3xl border-2 border-purple-100 space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-purple-400">Зорилтот дүн</span>
                  <span className="text-2xl font-black text-purple-600">₮{formData.goal}</span>
               </div>
               <div className="border-t pt-4">
                  <h4 className="font-bold text-gray-800">{formData.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{formData.description}</p>
               </div>
               {formData.image && <img src={formData.image} className="w-full h-32 object-cover rounded-xl" />}
            </div>
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-xl">
               <CheckCircle2 className="w-4 h-4" />
               <span className="text-xs font-bold">Нийтлэхэд бэлэн боллоо!</span>
            </div>
            {errors.submit && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">
                {errors.submit}
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <SignedOut><RedirectToSignIn /></SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
          
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-[100px] animate-pulse" />
             <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200/40 rounded-full blur-[100px] animate-pulse" />
          </div>

          <div className="max-w-7xl w-full flex flex-col lg:flex-row bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden relative z-10">
            
            <div className="lg:w-1/3 p-8 lg:p-12 bg-gradient-to-b from-purple-600/10 to-transparent border-r border-white/20">
              <button onClick={() => router.back()} className="flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all mb-12">
                <ArrowLeft className="w-4 h-4" /> Буцах
              </button>
              
              <div className="space-y-6">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                  Өөрчлөлтийг <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Эхлүүл</span>
                </h1>
                <p className="text-gray-600 text-lg">
                  Том өөрчлөлт бүхэн жижиг алхмаас эхэлдэг. Түүхээ бидэнд ярьж өгөөрэй.
                </p>

                <div className="pt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                      {currentStep}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Одоогийн алхам</div>
                      <div className="font-bold text-gray-800 uppercase tracking-tighter">
                         6-аас {currentStep}-р алхам
                      </div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(currentStep / 6) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 p-8 lg:p-16 flex flex-col min-h-[550px]">
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-bold text-gray-400">0{currentStep} —</h3>
                   {currentStep > 1 && (
                     <button onClick={prevStep} className="text-sm font-bold text-purple-500 hover:underline">
                       ← Өмнөх алхам
                     </button>
                   )}
                </div>

                <div className="relative">
                   {renderStep()}
                </div>
              </div>

              <div className="mt-12 flex justify-end">
                {currentStep >= 3 && currentStep < 6 && (
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl hover:shadow-purple-200 rounded-full px-12 py-7 text-lg font-bold transition-all hover:scale-105"
                  >
                    Үргэлжлүүлэх <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
                {currentStep === 6 && (
                   <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700 w-full rounded-full py-7 text-xl font-black shadow-xl disabled:opacity-50"
                   >
                     {isSubmitting ? "Үүсгэж байна..." : "ХАНДИВ ҮҮСГЭХ 🚀"}
                   </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      </SignedIn>
    </>
  );
}