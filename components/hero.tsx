"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Зөөлөн хөдөлгөөнд зориулав

const categories = [
  {
    label: "Your cause",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200&h=200&fit=crop&crop=center",
    className: "top-[10%] left-[15%] lg:left-[18%] w-32 h-32 lg:w-44 lg:h-44",
  },
  {
    label: "Medical",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop&crop=center",
    className: "top-[45%] left-[10%] w-28 h-28 lg:w-40 lg:h-40",
  },
  {
    label: "Emergency",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=center",
    className: "top-[65%] left-[18%] w-32 h-32 lg:w-44 lg:h-44",
  },
  {
    label: "Education",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop&crop=center",
    className: "top-[8%] right-[15%] lg:right-[18%] w-32 h-32 lg:w-44 lg:h-44",
  },
  {
    label: "Animal",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=200&h=200&fit=crop&crop=center",
    className: "top-[40%] right-[12%] w-24 h-24 lg:w-36 lg:h-36",
  },
  {
    label: "Business",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=center",
    className: "top-[60%] right-[18%] w-28 h-28 lg:w-40 lg:h-40",
  },
];

function CategoryCircle({ label, image, className }: { label: string; image: string; className: string }) {
  return (
    <motion.div
      className={`absolute hidden lg:block ${className}`}
      // Хөвөх мэт зөөлөн хөдөлгөөн (Floating effect)
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2, // Дугуй бүр өөр өөр цагт хөдөлнө
      }}
    >
      <motion.div 
        className="relative w-full h-full group cursor-pointer"
        whileHover={{ scale: 1.1, rotate: 2 }} // Хулгана очиход багахан эргэлттэй томорно
        whileTap={{ scale: 0.95 }}
      >
        {/* Ногоон цагираг - Илүү зөөлөн туяатай */}
        <div className="absolute inset-0 rounded-full border-[3px] border-primary/40 group-hover:border-primary transition-colors duration-500 group-hover:shadow-[0_0_30px_rgba(46,118,72,0.4)]" />
        
        {/* Зураг - Дотор талдаа zoom хийнэ */}
        <div className="absolute inset-[5px] rounded-full overflow-hidden border-2 border-background shadow-inner">
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-125"
          />
        </div>

        {/* Текст - Илүү гоёмсог гарч ирэлт */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-bottom-4 transition-all duration-300">
          <div className="bg-card px-4 py-1 rounded-full shadow-xl border border-border">
            <span className="text-xs font-bold text-foreground whitespace-nowrap">{label}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-[600px] lg:min-h-[750px] overflow-hidden bg-background flex items-center">
      {/* Арын бүрсгэр эффектүүд */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[120px]" />

      {/* Дугуйнууд */}
      {categories.map((category) => (
        <CategoryCircle key={category.label} {...category} />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-xs lg:text-sm font-black text-primary tracking-[0.2em] uppercase mb-6">
            Монголын хамгийн анхны хандивын платформ
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl text-foreground leading-[1] mb-12 text-balance font-medium tracking-tight">
            Амжилттай хандивын аян эндээс эхэлнэ
          </h1>
          
          <Button
            size="lg"
            className="
              bg-[#2e7648] 
              hover:bg-[#25613a]
              text-white 
              rounded-full 
              px-14 
              py-8 
              text-xl 
              font-bold 
              shadow-lg
              hover:shadow-[0_20px_40px_-10px_rgba(46,118,72,0.5)]
              transition-all
              duration-300
              active:scale-95
            "
            onClick={() => router.push("/donate")}
          >
            Аян эхлүүлэх
          </Button>
        </motion.div>
      </div>

      {/* Mobile Pills - Илүү зөөлөн харагдац */}
      <div className="absolute bottom-10 left-0 w-full lg:hidden px-4">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <span key={cat.label} className="px-4 py-2 bg-card/80 backdrop-blur-md border border-border rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              {cat.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}