import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const OurStory = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream to-background" />
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <path
              d="M50,200 Q150,100 250,200 T450,200"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent"
            />
            <path
              d="M50,250 Q150,150 250,250 T450,250"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-accent"
            />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-foreground mb-6">
              Esperanza's Holistic Wellness
            </h1>
            <p className="text-lg md:text-xl text-accent font-display italic">
              The Story of Esperanza Lopez
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                In the heart of Novaliches, Quezon City, Esperanza Lopez discovered her calling—a passion for natural healing that would transform countless lives. What began as a personal journey toward wellness became a mission to share the gift of holistic health with her community.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Esperanza, whose name means "hope" in Spanish, has always believed that true healing comes from within. Her approach combines time-honored Filipino traditional medicine with modern holistic practices, creating a unique path to wellness that honors both heritage and innovation.
              </p>
            </motion.div>

            {/* Section: A Healer's Beginning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] gradient-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  A Healer's Beginning
                </h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pl-16">
                Growing up, Esperanza watched her grandmother prepare herbal remedies and perform traditional healing rituals. These early memories planted the seeds of her lifelong dedication to natural wellness. After years of studying various holistic modalities—from traditional hilot massage to herbal medicine and energy healing—she opened her doors to those seeking an alternative path to health.
              </p>
            </motion.div>

            {/* Section: The Gift of Healing Hands */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] gradient-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  The Gift of Healing Hands
                </h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pl-16">
                Esperanza is known for her intuitive touch and compassionate care. Her clients often describe sessions with her as transformative experiences that address not just physical ailments, but emotional and spiritual imbalances as well. She believes that every person carries the power to heal themselves—she simply helps guide them on that journey.
              </p>
            </motion.div>

            {/* Section: Philosophy of Wellness */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] gradient-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Philosophy of Wellness
                </h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pl-16">
                "Healing is not just about treating symptoms," Esperanza often says. "It's about restoring harmony between body, mind, and spirit." Her practice integrates massage therapy, herbal treatments, dietary guidance, and lifestyle counseling to create personalized wellness plans for each client. She treats every individual as a whole person, not just a collection of symptoms.
              </p>
            </motion.div>

            {/* Section: Serving the Community */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-[2px] gradient-accent" />
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Serving the Community
                </h2>
              </div>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed pl-16">
                For over two decades, Esperanza has been a trusted healer in Novaliches and beyond. Word of her gift has spread through generations of families who have experienced the benefits of her treatments. From chronic pain relief to stress management, from post-surgery recovery to general wellness maintenance, her clients return again and again, often bringing their loved ones along.
              </p>
            </motion.div>

            {/* Closing Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center py-12 border-t border-b border-border"
            >
              <p className="text-lg md:text-xl text-foreground font-display italic mb-6">
                Esperanza's Holistic Wellness – Where traditional healing meets modern care.
                <br />
                Your journey to natural health and recovery begins here.
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-8">
                <span className="text-sm md:text-base font-semibold text-accent tracking-widest">HEALING</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-sm md:text-base font-semibold text-accent tracking-widest">TRADITION</span>
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-sm md:text-base font-semibold text-accent tracking-widest">WELLNESS</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default OurStory;
