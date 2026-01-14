import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BookConsultation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    preferredBranch: "",
    date: "",
    time: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const branches = [
    "Main Branch - Manila",
    "Makati Branch",
    "Quezon City Branch",
    "BGC Branch",
    "Ortigas Branch",
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      formData.name &&
      formData.email &&
      formData.contactNumber &&
      formData.preferredBranch &&
      formData.date &&
      formData.time
    ) {
      console.log("Form submitted:", formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          preferredBranch: "",
          date: "",
          time: "",
          message: "",
        });
      }, 3000);
    } else {
      alert("Please fill in all required fields");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>

          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              Book Your Consultation
            </h1>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Schedule a free consultation with our expert dermatologists and skincare specialists.
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <div className="bg-primary rounded-2xl p-6 md:p-8 shadow-elevated">
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-primary-foreground font-semibold mb-2">
                    Name <span className="text-red-300">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/50 py-3 px-0 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                {/* Email and Contact Number Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-primary-foreground font-semibold mb-2">
                      Email <span className="text-red-300">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/50 py-3 px-0 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-foreground font-semibold mb-2">
                      Contact Number <span className="text-red-300">*</span>
                    </label>
                    <div className="flex items-center border-b-2 border-primary-foreground/50 focus-within:border-accent transition-colors">
                      <span className="mr-2 text-2xl">🇵🇭</span>
                      <input
                        type="tel"
                        name="contactNumber"
                        placeholder="09XX XXX XXXX"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        className="flex-1 bg-transparent text-primary-foreground placeholder-primary-foreground/50 py-3 px-0 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferred Branch */}
                <div>
                  <label className="block text-primary-foreground font-semibold mb-2">
                    Preferred Branch <span className="text-red-300">*</span>
                  </label>
                  <select
                    name="preferredBranch"
                    value={formData.preferredBranch}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground py-3 px-0 focus:outline-none focus:border-accent transition-colors cursor-pointer"
                    style={{
                      color: formData.preferredBranch
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--primary-foreground) / 0.5)",
                    }}
                  >
                    <option value="" className="bg-primary text-primary-foreground">
                      Select a branch
                    </option>
                    {branches.map((branch, index) => (
                      <option
                        key={index}
                        value={branch}
                        className="bg-primary text-primary-foreground"
                      >
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Schedule */}
                <div>
                  <label className="block text-primary-foreground font-semibold mb-2">
                    Preferred Schedule <span className="text-red-300">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground py-3 px-0 focus:outline-none focus:border-accent transition-colors"
                    />
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground py-3 px-0 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-primary-foreground font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us about your skincare concerns..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-transparent border-b-2 border-primary-foreground/50 text-primary-foreground placeholder-primary-foreground/50 py-3 px-0 focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-accent text-accent-foreground font-bold py-6 rounded-full hover:bg-accent/90 transition-colors text-lg"
                    size="lg"
                  >
                    {submitted ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Consultation Booked!
                      </span>
                    ) : (
                      "Book your FREE consultation now!"
                    )}
                  </Button>
                </motion.div>
              </div>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 text-center text-primary-foreground"
                >
                  <p className="text-lg">Thank you! We'll contact you soon.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookConsultation;
