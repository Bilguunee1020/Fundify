import { Heart, Users, Globe, Shield } from "lucide-react"

const stats = [
  {
    icon: Heart,
    value: "100+ Тэрбум", // $30B+ гэдгийг Тэрбум гэж бичвэл илүү сүртэй
    label: "Нийт цугларсан",
    description: "Үйл ажиллагаа эхэлснээс хойш",
  },
  {
    icon: Users,
    value: "150М+",
    label: "Хандивлагчид",
    description: "Сэтгэлээрээ нэгдсэн хүмүүс",
  },
  {
    icon: Globe,
    value: "19",
    label: "Улс орон",
    description: "Дэлхий даяарх хамрах хүрээ",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Найдвартай",
    description: "Бүрэн хамгаалагдсан гүйлгээ",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Итгэл дээр тогтсон хандивын платформ
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Сайн үйлсийн төлөө нэгдсэн сая сая хүмүүстэй хамт эерэг өөрчлөлтийг бүтээгээрэй
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-primary-foreground/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-lg font-medium">{stat.label}</div>
                <div className="text-sm text-primary-foreground/70">{stat.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}