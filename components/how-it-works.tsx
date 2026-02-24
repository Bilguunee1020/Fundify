"use client";

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Share2, DollarSign, CheckCircle } from "lucide-react"
import { motion } from "framer-motion";

const steps = [
  {
    icon: FileText,
    step: "01",
    title: "Аянаа үүсгэх",
    description: "Хэдхэн минутын дотор аянаа нээгээрэй. Түүхээ хуваалцаж, зураг нэмж, зорилтот дүнгээ тохируулахад л хангалттай.",
  },
  {
    icon: Share2,
    step: "02",
    title: "Түгээх",
    description: "Сошиал медиа, имэйл болон мессежээр аянаа бусдад дуулгаж, олон хүнд хүргээрэй.",
  },
  {
    icon: DollarSign,
    step: "03",
    title: "Хандив хүлээн авах",
    description: "Хандивыг бодит цаг хугацаанд хянаж, дэмжигчдийнхээ халуун сэтгэлийг мэдрээрэй.",
  },
  {
    icon: CheckCircle,
    step: "04",
    title: "Мөнгөө шилжүүлж авах",
    description: "Цугларсан хандивыг өөрийн банкны данс руу хялбархан татаж аваарай. Ямар нэгэн далд торгууль байхгүй.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            FundRise хэрхэн ажилладаг вэ?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Хандив цуглуулж эхлэхэд хялбар бөгөөд үнэ төлбөргүй.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <div className="bg-card rounded-2xl p-6 h-full border border-border hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-4xl font-bold text-border">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
                {/* Алхам хоорондын зураас - Зөвхөн том дэлгэцэнд */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <motion.div>
          <Link href="/donate">
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
                hover:shadow-[0_20px_40px_-10px_rgba(46,118,72,0.3)]
                transition-all
                duration-300
                active:scale-95
              "
            >
              Аян эхлүүлэх
            </Button>
          </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}