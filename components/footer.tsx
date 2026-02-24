import Link from "next/link"
import { Heart, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

const footerLinks = {
  fundraise: [
    { label: "Хандив эхлүүлэх", href: "#" },
    { label: "Хэрхэн ажилладаг вэ?", href: "#" },
    { label: "Crowdfunding гэж юу вэ?", href: "#" },
    { label: "Хандив цуглуулах зөвлөмж", href: "#" },
    { label: "Амжилтын түүхүүд", href: "#" },
  ],
  learn: [
    { label: "Тусламжийн төв", href: "#" },
    { label: "Блог", href: "#" },
    { label: "Хэвлэл мэдээлэл", href: "#" },
    { label: "Ажлын байр", href: "#" },
    { label: "Бидний тухай", href: "#" },
  ],
  resources: [
    { label: "Буяны хандив", href: "#" },
    { label: "Багийн хандив", href: "#" },
    { label: "Үйлчилгээний хураамж", href: "#" },
    { label: "Дэмжигдсэн улс орнууд", href: "#" },
    { label: "Байгууллагын бүртгэл", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">FundRise</span>
            </Link>
            <p className="text-background/70 text-sm mb-4">
              Онлайн хандив цуглуулах хамгийн найдвартай платформ. 2026 оноос хойш хүмүүст туслахад зуучилж байна.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-background/70 hover:text-background transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-background transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-background transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-background/70 hover:text-background transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Хандив цуглуулах</h3>
            <ul className="space-y-2">
              {footerLinks.fundraise.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Илүү ихийг мэдэх</h3>
            <ul className="space-y-2">
              {footerLinks.learn.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Нөөц боломж</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="text-sm text-background/70 hover:text-background transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-background/70">
              © 2026 FundRise. Бүх эрх хуулиар хамгаалагдсан.
            </p>
            <div className="flex gap-6">
              <Link href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                Үйлчилгээний нөхцөл
              </Link>
              <Link href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                Нууцлал
              </Link>
              <Link href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                Хуулийн заалт
              </Link>
              <Link href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                Хүртээмжтэй байдал
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}