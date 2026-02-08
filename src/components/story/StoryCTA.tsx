import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const StoryCTA = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-cream via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground mb-4">
              Begin Your Healing Journey
            </h2>
            <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Experience the transformative care of Dr. Esperanza T. Lopez CNP. Book your appointment today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/book-consultation">
                <Button
                  size="lg"
                  className="gradient-accent text-primary-foreground hover:opacity-90 rounded-full px-8 text-base transition-all hover:scale-105 hover:shadow-lg w-full sm:w-auto"
                >
                  Book Appointment
                </Button>
              </Link>
              <Link to="/#services">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent/10 rounded-full px-8 text-base transition-all w-full sm:w-auto"
                >
                  View Services
                </Button>
              </Link>
            </div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto"
            >
              <a
                href="tel:09959055286"
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">0995 905 5286</p>
                </div>
              </a>

              <a
                href="mailto:esperanzateodosiolopez@gmail.com"
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground text-sm">esperanzateodosiolopez@gmail.com</p>
                </div>
              </a>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="font-medium text-foreground text-sm">#60 Forest Hill Drive, Forest Hill Subd., Novaliches, QC</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="p-2.5 rounded-lg bg-accent/10 text-accent">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">Hours</p>
                  <p className="font-medium text-foreground text-sm">Monday - Saturday, 8 AM - 5 PM</p>
                  <p className="text-xs text-muted-foreground">(By Appointment)</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StoryCTA;
