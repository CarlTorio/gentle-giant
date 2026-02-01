import { motion } from "framer-motion";
import { Facebook, Phone, Mail, MapPin } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const footerSections = {
    Contacts: {
      type: "contact",
      items: [
        { icon: Phone, text: "0995 905 5286", href: "tel:09959055286" },
        { icon: Mail, text: "esperanzateodosiolopez@gmail.com", href: "mailto:esperanzateodosiolopez@gmail.com" },
        { icon: MapPin, text: "Novaliches, Quezon City", href: "#" },
      ]
    },
    Services: {
      type: "links",
      items: [
        { text: "Holistic Wellness", path: "/#services" },
        { text: "Traditional Chinese Medicine", path: "/#services" },
        { text: "HCIBiz Products", path: "/#products" },
        { text: "see all", path: "/#services", isHighlight: true },
      ]
    },
    Help: {
      type: "mixed",
      items: [
        { text: "About Us", path: "/our-story" },
        { text: "Membership", path: "/membership" },
        { text: "Book Appointment", path: "/book-consultation" },
      ]
    },
  };

  const socialLinks = [
    { icon: Facebook, href: "#" },
  ];

  const handleNavClick = (path: string) => {
    if (path.startsWith("/#")) {
      const sectionId = path.substring(2);
      
      if (location.pathname === "/") {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        navigate("/");
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else if (path.startsWith("/")) {
      navigate(path);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground relative z-50 isolation-isolate before:absolute before:inset-0 before:bg-primary before:-z-10">
      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-8 lg:gap-6">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <button 
                onClick={() => navigate("/")}
                className="mb-2 md:mb-3 block"
              >
                <span className="font-display font-bold text-base md:text-lg text-primary-foreground">
                  Esperanza's Holistic Wellness
                </span>
              </button>
              <p className="text-primary-foreground/70 text-[10px] md:text-xs leading-relaxed">
                Your trusted partner in holistic healing and natural wellness.
              </p>
            </motion.div>
          </div>

          {/* Links */}
          {Object.entries(footerSections).map(([title, section], sectionIndex) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">{title}</h4>
              <ul className="space-y-1 md:space-y-1.5">
                {section.type === "contact" ? (
                  section.items.map((item) => (
                    <li key={item.text} className="flex items-center gap-2">
                      {'icon' in item && <item.icon className="w-3 h-3 text-primary-foreground/70" />}
                      <a
                        href={'href' in item ? item.href : '#'}
                        className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-[10px] md:text-xs"
                      >
                        {item.text}
                      </a>
                    </li>
                  ))
                ) : (
                  section.items.map((item) => (
                    <li key={item.text}>
                      {'isHighlight' in item && item.isHighlight ? (
                        <button
                          onClick={() => handleNavClick('path' in item ? item.path : '#')}
                          className="text-primary-foreground/90 hover:text-primary-foreground transition-colors text-[10px] md:text-xs font-medium underline underline-offset-2"
                        >
                          {item.text}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleNavClick('path' in item ? item.path : '#')}
                          className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-[10px] md:text-xs"
                        >
                          {item.text}
                        </button>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          ))}

          {/* Follow Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="col-span-2 md:col-span-1"
          >
            <h4 className="font-semibold text-xs md:text-sm mb-2 md:mb-3">Follow Us</h4>
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-3 h-3 md:w-4 md:h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-6 pt-4 border-t border-primary-foreground/10 text-center"
        >
          <p className="text-primary-foreground/50 text-xs">
            © {new Date().getFullYear()} Esperanza's Holistic Wellness Clinic. All rights reserved.
          </p>
          <p className="text-primary-foreground/40 text-[10px] mt-1">
            Powered by LogiCode.PH
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
