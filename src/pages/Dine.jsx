import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Clock, MapPin, Phone } from "lucide-react";
import { base44 } from "@/api/base44Client";

const AnimatedElement = ({ children, className, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) { setIsVisible(true); return; }
    const fallback = setTimeout(() => setIsVisible(true), 800 + delay);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { clearTimeout(fallback); setTimeout(() => setIsVisible(true), delay); observer.unobserve(el); }
    }, { threshold: 0.05, rootMargin: "0px 0px 200px 0px" });
    observer.observe(el);
    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [delay]);
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className || ""}`}>
      {children}
    </div>
  );
};

const restaurants = [
  {
    name: "مطعم النخيل",
    cuisine: "مطبخ سعودي عالمي",
    description: "تجربة طهي استثنائية تجمع بين النكهات السعودية الأصيلة والمطبخ العالمي الراقي.",
    hours: "١٢:٠٠ - ٢٣:٠٠",
    image_url: "https://media.base44.com/images/public/69ffa3030b658fe6093efead/4ddb85a07_www_viariyadh_com_explore_desktop_dine_60eba179ba_53d63d1d4c_a9c7513a.webp",
    rating: 5,
    tag: "مميز"
  },
  {
    name: "مطعم الواحة",
    cuisine: "مأكولات بحرية",
    description: "أطازج المأكولات البحرية المحضرة بأرقى الأساليب في أجواء تحاكي جمال الطبيعة.",
    hours: "١٣:٠٠ - ٢٤:٠٠",
    image_url: "https://media.base44.com/images/public/69ffa3030b658fe6093efead/f05b64c4c_www_viariyadh_com_Deluxe_Double_Room_40e249cc77_83195fa0.jpg",
    rating: 5,
    tag: "جديد"
  },
  {
    name: "بيسترو لومير",
    cuisine: "مطبخ فرنسي",
    description: "ذوق الطراز الباريسي الأصيل في قلب الرياض مع قائمة طعام مستوحاة من باريس.",
    hours: "١٢:٠٠ - ٢٣:٣٠",
    image_url: "https://media.base44.com/images/public/69ffa3030b658fe6093efead/19d10f500_www_viariyadh_com_DSC_01376_f086307239_832682df.jpg",
    rating: 4,
    tag: ""
  },
  {
    name: "كاياكو",
    cuisine: "مطبخ ياباني",
    description: "فن الطهي الياباني على أعلى مستوى مع أرقى أنواع السوشي والمأكولات اليابانية.",
    hours: "١٢:٠٠ - ٢٣:٠٠",
    image_url: "https://media.base44.com/images/public/69ffa3030b658fe6093efead/af5704e90_www_viariyadh_com_Our_heritage_ace712fb87_f692a56b2f_964e66dd.webp",
    rating: 5,
    tag: ""
  },
];

export default function Dine() {
  return (
    <div className="bg-background text-foreground" dir="rtl">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img
          src="https://media.base44.com/images/public/69ffa3030b658fe6093efead/4ddb85a07_www_viariyadh_com_explore_desktop_dine_60eba179ba_53d63d1d4c_a9c7513a.webp"
          alt="مطاعم ڤيا رياض"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-16"
        >
          <span className="text-primary text-xs tracking-[0.3em] uppercase block mb-4">ڤيا رياض</span>
          <h1
            className="font-bold text-foreground mb-4"
            style={{ fontFamily: "'El Messiri', system-ui, sans-serif", fontSize: "clamp(2rem, 6vw, 4rem)" }}
          >
            <span className="bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent animate-gradient-x">
              مطاعم ڤيا رياض
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            استمتع بأرقى التجارب الغذائية العالمية في قلب الرياض
          </p>
        </motion.div>
      </section>

      {/* Intro */}
      <AnimatedElement>
        <section className="bg-secondary py-16 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: <UtensilsCrossed className="w-8 h-8 text-primary mx-auto mb-3" />, label: "٢٠+ مطعم", desc: "تجارب طهو متنوعة" },
              { icon: <Star className="w-8 h-8 text-primary mx-auto mb-3" />, label: "مستوى عالمي", desc: "شيفات من حول العالم" },
              { icon: <Clock className="w-8 h-8 text-primary mx-auto mb-3" />, label: "مفتوح يومياً", desc: "من الظهيرة حتى منتصف الليل" },
            ].map((item, i) => (
              <AnimatedElement key={i} delay={i * 100}>
                <div className="p-8 bg-muted border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_hsl(var(--primary)/0.2)]">
                  {item.icon}
                  <div className="text-foreground font-bold text-xl mb-1" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>{item.label}</div>
                  <div className="text-muted-foreground text-sm">{item.desc}</div>
                </div>
              </AnimatedElement>
            ))}
          </div>
        </section>
      </AnimatedElement>

      {/* Restaurant Grid */}
      <AnimatedElement delay={100}>
        <section className="bg-background py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <span className="text-primary text-xs tracking-[0.3em] uppercase block mb-4">قائمة مطاعمنا</span>
              <h2
                className="text-foreground text-3xl md:text-4xl font-bold"
                style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}
              >
                تجارب طهو استثنائية
              </h2>
              <div className="w-12 h-px bg-primary mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {restaurants.map((r, i) => (
                <AnimatedElement key={i} delay={i * 100}>
                  <div className="group relative overflow-hidden bg-card hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.3)] transition-all duration-500">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <img src={r.image_url} alt={r.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card-foreground/80 to-transparent" />
                      {r.tag && (
                        <span className="absolute top-4 start-4 bg-primary text-primary-foreground text-xs px-3 py-1 tracking-wider">
                          {r.tag}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-card-foreground text-xl font-bold" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>{r.name}</h3>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                      <span className="text-primary text-xs tracking-wider uppercase block mb-3">{r.cuisine}</span>
                      <p className="text-card-foreground/70 text-sm mb-4 leading-relaxed">{r.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-card-foreground/60 text-xs flex items-center gap-1"><Clock className="w-3 h-3" />{r.hours}</span>
                        <a href="#" className="text-primary text-sm border border-primary/40 px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center gap-2">
                          <span>احجز الآن</span>
                          <ArrowLeft className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </div>
        </section>
      </AnimatedElement>

      {/* CTA */}
      <AnimatedElement delay={100}>
        <section className="bg-secondary py-20 px-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-2xl mx-auto text-center relative z-10">
            <span className="text-primary text-xs tracking-[0.3em] uppercase block mb-4">تواصل معنا</span>
            <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>
              احجز طاولتك اليوم
            </h2>
            <p className="text-muted-foreground mb-8">للحجوزات والاستفسارات، تواصل معنا مباشرة</p>
            <a
              href="mailto:info@viariyadh.com"
              className="relative overflow-hidden inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-wide hover:opacity-90 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_hsl(var(--primary)/0.5)]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_100%]" />
              <span className="relative">تواصل معنا</span>
              <Phone className="w-4 h-4 relative" />
            </a>
          </div>
        </section>
      </AnimatedElement>
    </div>
  );
}

function UtensilsCrossed(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/>
      <path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/>
      <path d="m2 22 3-3"/>
    </svg>
  );
}