import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Coffee, Wifi, Car, Dumbbell } from "lucide-react";

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

const rooms = [
  {
    name: "غرفة ديلوكس",
    type: "غرفة مزدوجة",
    description: "تجربة إقامة فاخرة مع إطلالات رائعة على المدينة وتجهيزات فندقية من الدرجة الأولى.",
    size: "٤٥ م²",
    image_url: "https://media.base44.com/images/public/69ffa3030b658fe6093efead/f05b64c4c_www_viariyadh_com_Deluxe_Double_Room_40e249cc77_83195fa0.jpg",
    featured: true
  },
  {
    name: "جناح سانت ريجس",
    type: "جناح فاخر",
    description: "الفخامة في أبهى صورها مع غرفة معيشة منفصلة وخدمة الباتلر على مدار الساعة.",
    size: "١٢٠ م²",
    image_url: "https://media.base44.com/images/public/69ffa3030b658fe6093efead/af5704e90_www_viariyadh_com_Our_heritage_ace712fb87_f692a56b2f_964e66dd.webp",
    featured: false
  },
  {
    name: "غرفة برستيج",
    type: "إقامة مميزة",
    description: "مساحة واسعة وأناقة لا تضاهى مع مرافق حصرية وخدمات مخصصة لضيوف الشرف.",
    size: "٦٥ م²",
    image_url: "https://media.base44.com/images/public/69ffa3030b658fe6093efead/4ddb85a07_www_viariyadh_com_explore_desktop_dine_60eba179ba_53d63d1d4c_a9c7513a.webp",
    featured: false
  },
];

const amenities = [
  { icon: Coffee, label: "خدمة الغرف ٢٤ ساعة" },
  { icon: Wifi, label: "واي فاي فائق السرعة" },
  { icon: Car, label: "خدمة الإيصال والاستقبال" },
  { icon: Dumbbell, label: "مركز صحي وسبا" },
  { icon: Star, label: "خدمة الباتلر" },
  { icon: Star, label: "مسبح خاص" },
];

export default function Stay() {
  return (
    <div className="bg-background text-foreground" dir="rtl">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-end overflow-hidden">
        <img
          src="https://media.base44.com/images/public/69ffa3030b658fe6093efead/f05b64c4c_www_viariyadh_com_Deluxe_Double_Room_40e249cc77_83195fa0.jpg"
          alt="فندق سانت ريجس"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-16"
        >
          <span className="text-primary text-xs tracking-[0.3em] uppercase block mb-4">انغمس في رفاهية الإقامة</span>
          <h1
            className="font-bold text-foreground mb-4"
            style={{ fontFamily: "'El Messiri', system-ui, sans-serif", fontSize: "clamp(2rem, 6vw, 4rem)" }}
          >
            <span className="bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent animate-gradient-x">
              فندق سانت ريجس في ڤيا رياض
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            تجربة فريدة من نوعها تجمع بين الفخامة المطلقة والضيافة العربية الأصيلة
          </p>
        </motion.div>
      </section>

      {/* Description Split */}
      <AnimatedElement>
        <section className="bg-secondary py-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-xs tracking-[0.3em] uppercase block mb-4">عن الفندق</span>
              <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>
                الفخامة في كل لحظة
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                سانت ريجيس الرياض تقدم الفخامة بكل معنى الكلمة في كل لحظة. إنها تجربة فريدة من نوعها في الرياض، تجمع بين الضيافة الأمريكية الراقية والثقافة العربية الأصيلة.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                يقع الفندق في قلب ڤيا رياض، وجهة الفخامة الأولى في المملكة العربية السعودية، حيث يوفر وصولاً فورياً إلى أفضل المطاعم والمتاجر ووسائل الترفيه.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {amenities.map((a, i) => (
                <AnimatedElement key={i} delay={i * 80}>
                  <div className="bg-muted p-5 border border-border/30 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                    <a.icon className="w-5 h-5 text-primary mb-3" />
                    <span className="text-foreground text-sm">{a.label}</span>
                  </div>
                </AnimatedElement>
              ))}
            </div>
          </div>
        </section>
      </AnimatedElement>

      {/* Rooms */}
      <AnimatedElement delay={100}>
        <section className="bg-background py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <span className="text-primary text-xs tracking-[0.3em] uppercase block mb-4">أنواع الغرف</span>
              <h2 className="text-foreground text-3xl md:text-4xl font-bold" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>
                اختر إقامتك المثالية
              </h2>
              <div className="w-12 h-px bg-primary mt-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {rooms.map((room, i) => (
                <AnimatedElement key={i} delay={i * 120}>
                  <div className="group bg-card overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.3)] transition-all duration-500">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={room.image_url} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      {room.featured && (
                        <span className="absolute top-4 start-4 bg-primary text-primary-foreground text-xs px-3 py-1 tracking-wider">
                          الأكثر طلباً
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-primary text-xs tracking-wider uppercase block mb-2">{room.type}</span>
                      <h3 className="text-card-foreground text-xl font-bold mb-3" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>{room.name}</h3>
                      <p className="text-card-foreground/70 text-sm mb-4 leading-relaxed">{room.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary text-sm font-bold">{room.size}</span>
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

      {/* Heritage CTA */}
      <AnimatedElement delay={100}>
        <section className="bg-muted py-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-12 md:p-16 relative z-10">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
              <span className="text-primary text-xs tracking-[0.3em] uppercase block mb-6">احجز إقامتك</span>
              <h2 className="text-foreground text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'El Messiri', system-ui, sans-serif" }}>
                تجربة لا تُنسى تنتظرك
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                اتصل بنا لحجز إقامتك أو للاستفسار عن العروض الخاصة والباقات المميزة.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://www.marriott.com/en-us/hotels/ruhxr-the-st-regis-riyadh/overview/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative overflow-hidden inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 text-sm tracking-wide hover:opacity-90 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_hsl(var(--primary)/0.5)]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite] bg-[length:200%_100%]" />
                  <span className="relative">احجز الآن</span>
                  <ArrowLeft className="w-4 h-4 relative" />
                </a>
                <a href="tel:+96692000 1819" className="inline-flex items-center gap-3 text-primary border border-primary px-8 py-4 text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                  <span>اتصل بنا</span>
                </a>
              </div>
            </div>
            <div className="relative overflow-hidden min-h-[350px]">
              <img
                src="https://media.base44.com/images/public/69ffa3030b658fe6093efead/af5704e90_www_viariyadh_com_Our_heritage_ace712fb87_f692a56b2f_964e66dd.webp"
                alt="فندق سانت ريجس"
                className="w-full h-full object-cover"
                style={{ minHeight: "350px" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-muted/70 to-transparent" />
            </div>
          </div>
        </section>
      </AnimatedElement>
    </div>
  );
}