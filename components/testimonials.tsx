
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    quote: "FundRise нь хэдхэн долоо хоногийн дотор ээжийн минь мэс засалд зориулан санхүү цуглуулахад тусалсан. Танихгүй хүмүүсийн дэмжлэг нь гайхалтай байлаа, энэ нь хүн төрөлхтний итгэл найдварыг минь сэргээсэн.",
    author: "Jennifer Martinez",
    role: "Эмнэлгийн зардалд зориулан $45,000 цуглуулсан",
    rating: 5,
  },
  {
    quote: "Гэр бүлээсээ анх удаа коллежид суралцаж буй оюутны хувьд сургалтын төлбөрөө төлж чадна гэж хэзээ ч санаагүй. FundRise-ийн хандивлагчдын өгөөмөр сэтгэлийн ачаар би энэ хавар сургуулиа төгсөж байна!",
    author: "Marcus Thompson",
    role: "Боловсролын зардалд зориулан $28,000 цуглуулсан",
    rating: 5,
  },
  {
    quote: "Түймрийн улмаас манай олон нийтийн төв сүйрсний дараа бид FundRise-д хандсан. Ердөө 3 сарын дотор бид төвөө сэргээн босгох, тэр байтугай үйл ажиллагаагаа өргөжүүлэх хангалттай хөрөнгө цуглуулж чадлаа.",
    author: "Sarah Chen",
    role: "Олон нийтийн төвийг сэргээхэд $120,000 цуглуулсан",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Итгэл найдвар ба сайхан сэтгэлийн түүхүүд
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Бодит хүмүүс, бодит үр дүн. FundRise хэрхэн эерэг өөрчлөлт авчирч байгааг үзээрэй.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-primary/20 mb-3" />
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}