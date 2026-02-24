import { Zap, Clock, Calendar } from "lucide-react";

const trustItems = [
  {
    icon: Zap,
    text: "Үнэ төлбөргүй эхлүүлэх",
  },
  {
    icon: Clock,
    // "1" гэдэг тоог дунд нь оруулж ирсэн
    text: "Секунд тутамд 1 хандив",
    highlight: "1",
  },
  {
    icon: Calendar,
    text: "Өдөр бүр 8,000+ шинэ аян",
    highlight: "8,000+",
  },
];

export function TrustBar() {
  return (
    <section className="bg-[#f9f7f2] py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0">
          {trustItems.map((item, index) => (
            <div key={item.text} className="flex items-center">
              <div className="flex items-center gap-2">
                <item.icon className="w-5 h-5 text-zinc-800" strokeWidth={1.5} />
                <span className="text-sm text-zinc-800 tracking-tight">
                  {item.highlight ? (
                    // Текст доторх тоог хаана ч байсан Bold болгох хэсэг
                    <span>
                      {item.text.split(item.highlight)[0]}
                      <span className="font-bold">{item.highlight}</span>
                      {item.text.split(item.highlight)[1]}
                    </span>
                  ) : (
                    item.text
                  )}
                </span>
              </div>
              
              {/* Цэгүүдийг илүү цэвэрхэн харагдуулсан */}
              {index < trustItems.length - 1 && (
                <div className="hidden md:flex items-center mx-10">
                  <span className="text-zinc-300 tracking-[0.3em]">
                    ··········
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}