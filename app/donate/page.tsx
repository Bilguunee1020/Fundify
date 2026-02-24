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
  Info,
  Phone,
  Mail,
  AlertTriangle,
  FileText
} from "lucide-react";

// 1. БҮХ КАТЕГОРИЙН КОНТЕНТ (ДУТУУ ГАРСАН ХЭСГҮҮД НЭМЭГДСЭН)
const categoryContent: Record<string, any> = {
  medical: {
    goalLabel: "Эмчилгээнд хэдэн төгрөг шаардлагатай vэ?",
    goalHint: "Эмчилгээний зардал, замын зардал зэргийг тооцож бичээрэй.",
    imageLabel: "Өвчтөний эсвэл эмнэлгийн дүгнэлтийн зураг",
    titlePlaceholder: "Жнь: Бат-Эрдэнэд амьдрал бэлэглэе",
    descPlaceholder: "Онош, эмчилгээний төлөвлөгөө болон яагаад яаралтай тусламж хэрэгтэй байгаа талаар дэлгэрэнгүй бичнэ үү...",
    minGoal: "20,000,000₮",
    maxGoal: "100,000,000₮",
    suggestedGoal: "20000000"
  },
  memorial: {
    goalLabel: "Буяны ажилд хэдэн төгрөг хэрэгтэй вэ?",
    goalHint: "Оршуулгын зардал болон ар гэрт нь дэмжлэг үзүүлэх дүн.",
    imageLabel: "Дурсгалын зураг оруулах",
    titlePlaceholder: "Жнь: Хайрт аавынхаа гэгээн дурсгалд",
    descPlaceholder: "Талийгаачийн тухай сайхан дурсамж болон ар гэрт нь ямар дэмжлэг хэрэгтэй байгааг бичээрэй...",
    minGoal: "5,000,000₮",
    maxGoal: "20,000,000₮",
    suggestedGoal: "8000000"
  },
  education: {
    goalLabel: "Сургалтын төлбөрт хэдэн төгрөг дутуу байна вэ?",
    goalHint: "Сургалтын төлбөр, ном сурах бичиг, байрны төлбөр.",
    imageLabel: "Өөрийн зураг эсвэл сургуулийн урилга",
    titlePlaceholder: "Жнь: Харвардад сурах мөрөөдөлд минь туслаач",
    descPlaceholder: "Ямар сургуульд, ямар мэргэжлээр сурах гэж байгаа болон ирээдүйн зорилгоо бичнэ үү...",
    minGoal: "3,000,000₮",
    maxGoal: "15,000,000₮",
    suggestedGoal: "5000000"
  },
  emergency: {
    goalLabel: "Хохирлыг барагдуулахад хэдэн төгрөг хэрэгтэй вэ?",
    goalHint: "Гэр орон, эд хөрөнгийг сэргээн босгох зардал.",
    imageLabel: "Болсон явдлыг харуулах зураг",
    titlePlaceholder: "Жнь: Гал түймэрт өртсөн гэр бүлд туслаач",
    descPlaceholder: "Юу тохиолдсон, ямар хохирол учирсан талаар үнэн зөв мэдээлэл бичээрэй...",
    minGoal: "10,000,000₮",
    maxGoal: "50,000,000₮",
    suggestedGoal: "15000000"
  },
  animals: {
    goalLabel: "Амьтдыг аврахад хэдэн төгрөг хэрэгтэй вэ?",
    goalHint: "Эмчилгээ, хоол тэжээл, хамгаалах байрны зардал.",
    imageLabel: "Амьтны зураг",
    titlePlaceholder: "Жнь: Гудамжны нохдод хоол хэрэгтэй байна",
    descPlaceholder: "Амьтдад ямар тусламж хэрэгтэй байгаа талаар...",
    minGoal: "1,000,000₮",
    maxGoal: "10,000,000₮",
    suggestedGoal: "2000000"
  },
  default: {
    goalLabel: "Зорилтот дүнгээ оруулна уу",
    goalHint: "Төслөө хэрэгжүүлэхэд шаардлагатай нийт дүн.",
    imageLabel: "Зураг нэмэх",
    titlePlaceholder: "Хандивын аяны гарчиг",
    descPlaceholder: "Ямар зорилгоор хандив цуглуулж байгаа тухайгаа бичнэ үү...",
    minGoal: "1,000,000₮",
    maxGoal: "20,000,000₮",
    suggestedGoal: "1000000"
  }
};

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
    phone: "",
    contactEmail: user?.primaryEmailAddress?.emailAddress || "",
    isAgreed: false,
  });

  const getContent = () => {
    return categoryContent[formData.category] || categoryContent.default;
  };

  const handleSubmit = async () => {
    if (!user || !formData.isAgreed) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/fundraisers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          creator: user.id,
          userEmail: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          status: "pending" // Админ зөвшөөрөх хүлээгдэж буй төлөв
        }),
      });

      if (response.ok) {
        router.push('/my-fundraisers');
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Хандив үүсгэхэд алдаа гарлаа' });
      }
    } catch (error) {
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
    const content = getContent();

    switch (currentStep) {
      case 1: // Category Select
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
                      ? "bg-gradient-to-br from-green-600 to-green-700 border-transparent text-white shadow-lg scale-95"
                      : "bg-white/60 border-gray-100 hover:border-green-400 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-full ${isSelected ? "bg-white/20" : "bg-green-50 group-hover:bg-green-100"}`}>
                      <Icon className={`w-6 h-6 ${isSelected ? "text-white" : "text-green-700"}`} />
                    </div>
                    <span className="text-xs font-semibold">{cat.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );
      case 2: // Beneficiary Select
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
                    ? "bg-gradient-to-r from-green-600 to-green-700 border-transparent text-white shadow-xl" 
                    : "bg-white/60 border-gray-100 hover:border-green-400"
                }`}
              >
                <item.icon className={`w-8 h-8 ${formData.forWhom === item.id ? "text-white" : "text-green-600"}`} />
                <div className="text-left">
                  <div className="font-bold text-lg">{item.title}</div>
                  <div className={`text-sm ${formData.forWhom === item.id ? "text-white/80" : "text-gray-500"}`}>{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
        );
      case 3: // Goal Input
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
             <h2 className="text-2xl font-bold text-gray-800">{content.goalLabel}</h2>
             <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-green-600">₮</span>
                <input 
                  type="number" 
                  autoFocus
                  onChange={(e) => setFormData({...formData, goal: parseFloat(e.target.value)})}
                  className="w-full pl-12 pr-4 py-6 text-4xl font-bold bg-transparent border-b-4 border-green-200 focus:border-green-600 outline-none transition-all"
                  placeholder={content.suggestedGoal}
                />
             </div>
             <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex gap-3 items-start">
                <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                   <p className="text-sm text-green-800 font-medium">Зөвлөмж:</p>
                   <p className="text-sm text-gray-600 mt-1">{content.goalHint}</p>
                   <p className="text-xs text-gray-400 mt-2">Санал болгож буй хүрээ: <span className="font-semibold text-gray-600">{content.minGoal} - {content.maxGoal}</span></p>
                </div>
             </div>
          </div>
        );
      case 4: // Image Upload
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold text-gray-800">{content.imageLabel}</h2>
            <div className="relative group cursor-pointer border-2 border-dashed border-green-200 rounded-3xl p-8 bg-white/40 hover:bg-white transition-all text-center">
              <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFormData({ ...formData, image: reader.result as string });
                    reader.readAsDataURL(file);
                  }
                }} className="absolute inset-0 opacity-0 cursor-pointer" />
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="mx-auto max-h-48 rounded-2xl shadow-lg object-cover" />
              ) : (
                <div className="py-8">
                  <Camera className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600" />
                  <p className="text-green-600 font-bold">Зураг оруулах бол энд дарна уу</p>
                </div>
              )}
            </div>
          </div>
        );
      case 5: // Title & Story
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Түүхээ хуваалцана уу</h2>
            <input
              type="text"
              placeholder={content.titlePlaceholder}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-xl font-bold p-4 rounded-xl bg-white/50 border-2 border-transparent focus:border-green-600 outline-none shadow-sm"
            />
            <textarea
              placeholder={content.descPlaceholder}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-[150px] p-4 rounded-xl bg-white/50 border-2 border-transparent focus:border-green-600 outline-none shadow-sm resize-none"
            />
          </div>
        );
      case 6: // Contact Info (NEW STEP)
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Холбоо барих мэдээлэл</h2>
            <p className="text-gray-500 text-sm">Энэ мэдээлэл нь нийтэд харагдахгүй бөгөөд зөвхөн админ тантай холбогдоход ашиглагдана.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border-2 border-transparent focus-within:border-green-600 transition-all">
                <Phone className="text-green-600" />
                <input 
                  type="tel" 
                  placeholder="Утасны дугаар 1" 
                  className="bg-transparent outline-none w-full font-bold"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-4 bg-white/60 p-4 rounded-2xl border-2 border-transparent focus-within:border-green-600 transition-all">
                <Mail className="text-green-600" />
                <input 
                  type="email" 
                  placeholder="Холбоо барих имэйл" 
                  className="bg-transparent outline-none w-full font-bold"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 7: // Review
        return (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="text-2xl font-bold text-gray-800">Мэдээллээ шалгана уу</h2>
            <div className="bg-white/80 p-6 rounded-3xl border-2 border-green-100 space-y-4 shadow-inner">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-black uppercase text-green-600">Зорилтот дүн</span>
                  <span className="text-2xl font-black text-green-700">₮{formData.goal.toLocaleString()}</span>
               </div>
               <div className="border-t pt-4">
                  <h4 className="font-bold text-gray-800 text-lg">{formData.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-3 mt-1">{formData.description}</p>
               </div>
               <div className="flex gap-4 text-sm font-bold text-gray-600 border-t pt-4">
                  <span>📞 {formData.phone}</span>
                  <span>✉️ {formData.contactEmail}</span>
               </div>
               {formData.image && <img src={formData.image} className="w-full h-32 object-cover rounded-xl mt-2" />}
            </div>
          </div>
        );
      case 8: // Final Agreement & Warning (NEW STEP)
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] space-y-4">
              <div className="flex items-center gap-3 text-amber-600">
                <AlertTriangle className="w-8 h-8" />
                <h2 className="text-2xl font-black uppercase">Анхааруулга</h2>
              </div>
              <div className="space-y-4 text-gray-700">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0 font-bold text-xs">1</div>
                  <p className="text-sm font-medium">Таны оруулсан мэдээлэл үнэн зөв болохыг батлах <strong>холбогдох баримт бичгүүдтэйгээ</strong> биеэр ирж уулзах шаардлагатай.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0 font-bold text-xs">2</div>
                  <p className="text-sm font-medium">Бид тантай гэрээ байгуулж, албан ёсоор баталгаажуулсны дараа таны хандив <strong>нийтэд нээлттэй харагдах</strong> болно.</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0 font-bold text-xs">3</div>
                  <p className="text-sm font-medium">Таны утасны дугаар болон имэйл хаяг <strong>бусад хэрэглэгчдэд харагдахгүй</strong> бөгөөд зөвхөн админ хяналтад байна.</p>
                </div>
              </div>

              <div className="pt-4">
                <label className="flex items-center gap-4 p-4 bg-white/80 rounded-2xl cursor-pointer hover:bg-white transition-all border-2 border-transparent checked:border-green-600 shadow-sm">
                  <input 
                    type="checkbox" 
                    className="w-6 h-6 accent-green-600"
                    checked={formData.isAgreed}
                    onChange={(e) => setFormData({...formData, isAgreed: e.target.checked})}
                  />
                  <span className="text-sm font-bold text-gray-800">Би дээрх нөхцөлийг хүлээн зөвшөөрч, бичиг баримтаар баталгаажуулж гэрээ байгуулахад бэлэн байна.</span>
                </label>
              </div>
            </div>
            {errors.submit && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{errors.submit}</div>}
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
          <div className="max-w-7xl w-full flex flex-col lg:flex-row bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden relative z-10">
            
            {/* Sidebar (Steps) */}
            <div className="lg:w-1/3 p-8 lg:p-12 bg-gradient-to-b from-green-600/10 to-transparent border-r border-white/20">
              <button onClick={() => router.back()} className="flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all mb-12">
                <ArrowLeft className="w-4 h-4" /> Буцах
              </button>
              
              <div className="space-y-6">
                <h1 className="text-4xl font-black text-gray-900 leading-tight">
                  Өөрчлөлтийг <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-700">Эхлүүл</span>
                </h1>
                <p className="text-gray-600 text-lg">Хүсэлтээ илгээж, бидэнтэй гэрээ байгуулснаар хандивын аяныг албан ёсоор эхлүүлэх боломжтой.</p>

                <div className="pt-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {currentStep}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-green-600 uppercase tracking-widest">Одоогийн алхам</div>
                      <div className="font-bold text-gray-800 uppercase tracking-tighter">8-аас {currentStep}-р алхам</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-1000 ease-out" style={{ width: `${(currentStep / 8) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:w-2/3 p-8 lg:p-16 flex flex-col min-h-[600px]">
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-bold text-gray-400">0{currentStep} —</h3>
                   {currentStep > 1 && (
                     <button onClick={prevStep} className="text-sm font-bold text-green-600 hover:underline">← Өмнөх алхам</button>
                   )}
                </div>
                <div className="relative">{renderStep()}</div>
              </div>

              <div className="mt-12 flex justify-end gap-4">
                {currentStep >= 3 && currentStep < 8 && (
                  <Button 
                    onClick={nextStep}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:shadow-xl rounded-full px-12 py-7 text-lg font-bold transition-all hover:scale-105"
                  >
                    Үргэлжлүүлэх <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                )}
                {currentStep === 8 && (
                   <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.isAgreed}
                    className="bg-green-600 hover:bg-green-700 w-full rounded-full py-7 text-xl font-black shadow-xl disabled:opacity-50 transition-all"
                   >
                     {isSubmitting ? "Хүсэлт илгээж байна..." : "ХҮСЭЛТ ИЛГЭЭХ 🚀"}
                   </Button>
                )}
              </div>
            </div>

          </div>
        </div>
      </SignedIn>
    </>
  );
}1