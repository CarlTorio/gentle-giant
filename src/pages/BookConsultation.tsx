import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Facebook, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const holisticServices = [
  "Stroke Management",
  "Sciatica Remedies",
  "Frozen Shoulder",
  "Body/Back Pain",
  "Sprain Recovery",
  "Scoliosis Management",
  "Bone Manipulation",
  "Nerve Therapy",
  "Filipino Hilot",
];

const tcmServices = [
  "Auriculo Therapy",
  "Guasha Therapy",
  "Moxibustion",
  "Cupping / Ventoza",
  "Electro Acupuncture",
  "Laser Acupuncture",
  "Bioresonator",
];

const timeSlots = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const BookConsultation = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    serviceCategory: "",
    specificService: "",
    preferredDate: "",
    preferredTime: "",
    conditionDescription: "",
  });

  const getAvailableServices = () => {
    switch (formData.serviceCategory) {
      case "holistic":
        return holisticServices;
      case "tcm":
        return tcmServices;
      case "both":
        return [...holisticServices, ...tcmServices];
      default:
        return [];
    }
  };

  // Disable Sundays in date picker
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email.toLowerCase().trim(),
        service_category: formData.serviceCategory || null,
        specific_service: formData.specificService || null,
        preferred_date: formData.preferredDate || null,
        preferred_time: formData.preferredTime || null,
        condition_description: formData.conditionDescription || null,
        status: 'pending',
      });

      if (error) throw error;

      toast.success("Salamat! Your appointment request has been received. We will confirm your schedule within 24 hours.");
      navigate("/thank-you", {
        state: {
          name: formData.fullName,
          email: formData.email,
          date: formData.preferredDate,
          time: formData.preferredTime,
        }
      });
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error("Failed to book appointment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          {/* Two Column Layout */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-elevated"
          >
            {/* Left Column - Contact Info */}
            <div className="bg-muted p-4 md:p-12 flex flex-col justify-center">
              <h2 className="font-display text-xl md:text-4xl text-foreground mb-2 md:mb-4">
                Get in Touch
              </h2>
              <p className="text-foreground/70 text-xs md:text-base mb-4 md:mb-8">
                Book your appointment with Esperanza's Holistic Wellness Clinic. By appointment only.
              </p>

              {/* Contact Information */}
              <div className="mb-4 md:mb-8">
                <h3 className="text-foreground font-semibold text-sm md:text-base mb-2 md:mb-4">Contact Information</h3>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-1 md:space-y-3 md:gap-0">
                  <div className="flex items-center gap-2 md:gap-3 text-foreground/80">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-primary flex items-center justify-center">
                      <Phone className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                    <span className="text-xs md:text-base">0995 905 5286</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-foreground/80">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-primary flex items-center justify-center">
                      <Mail className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                    <span className="text-xs md:text-base truncate">esperanzateodosiolopez@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-foreground/80">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-primary flex items-center justify-center">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                    <span className="text-xs md:text-base">Novaliches, QC</span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3 text-foreground/80">
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-primary flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                    </div>
                    <span className="text-xs md:hidden">8AM - 5PM</span>
                    <div className="hidden md:flex flex-col">
                      <span>Mon - Sat: 8:00 AM - 5:00 PM</span>
                      <span className="text-primary font-medium">By Appointment Only</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="flex md:block items-center gap-3">
                <h3 className="text-foreground font-semibold text-sm md:text-base md:mb-4">Follow Us</h3>
                <div className="flex items-center gap-2 md:gap-3">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Facebook className="w-4 h-4 md:w-5 md:h-5 text-primary hover:text-primary-foreground" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="bg-primary p-4 md:p-12">
              <div className="mb-3 md:mb-6">
                <h2 className="font-display text-lg md:text-3xl text-primary-foreground mb-1 md:mb-2">
                  Book a Consultation
                </h2>
                <p className="text-primary-foreground/70 text-xs md:text-sm">
                  By appointment only. Monday to Saturday, 8 AM to 5 PM.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                {/* Full Name */}
                <div>
                  <Input
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                  <Input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                </div>

                {/* Service Category */}
                <Select
                  value={formData.serviceCategory}
                  onValueChange={(value) => setFormData({ ...formData, serviceCategory: value, specificService: "" })}
                >
                  <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                    <SelectValue placeholder="Select Service Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="holistic">Holistic Wellness Treatment</SelectItem>
                    <SelectItem value="tcm">Traditional Chinese Medicine</SelectItem>
                    <SelectItem value="both">Both / Not Sure</SelectItem>
                  </SelectContent>
                </Select>

                {/* Specific Service */}
                {formData.serviceCategory && (
                  <Select
                    value={formData.specificService}
                    onValueChange={(value) => setFormData({ ...formData, specificService: value })}
                  >
                    <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                      <SelectValue placeholder="Select Specific Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableServices().map((service) => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Input
                      type="date"
                      min={getMinDate()}
                      value={formData.preferredDate}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (date.getDay() === 0) {
                          toast.error("Sundays are not available. Please select another day.");
                          return;
                        }
                        setFormData({ ...formData, preferredDate: e.target.value });
                      }}
                      className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground"
                    />
                  </div>
                  <Select
                    value={formData.preferredTime}
                    onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
                  >
                    <SelectTrigger className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground">
                      <SelectValue placeholder="Preferred Time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition Description */}
                <Textarea
                  placeholder="Brief description of your health concern"
                  value={formData.conditionDescription}
                  onChange={(e) => setFormData({ ...formData, conditionDescription: e.target.value })}
                  rows={3}
                  className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground placeholder:text-primary-foreground/50"
                />

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-semibold"
                >
                  {isSubmitting ? "Booking..." : "Book Appointment"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookConsultation;
