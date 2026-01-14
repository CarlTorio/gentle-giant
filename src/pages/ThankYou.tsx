import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft, Home, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import bookingStubBg from "@/assets/booking-stub.png";

interface BookingDetails {
  name: string;
  email: string;
  contactNumber: string;
  membership: string;
  date: string;
  time: string;
  message?: string;
  bookingNumber?: string;
}

// Generate a unique booking number
const generateBookingNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HLM-${timestamp.slice(-4)}${random}`;
};

const ThankYou = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingDetails = location.state as BookingDetails | null;

  // Generate booking number once and memoize it
  const bookingNumber = useMemo(() => {
    return bookingDetails?.bookingNumber || generateBookingNumber();
  }, [bookingDetails?.bookingNumber]);

  useEffect(() => {
    // If no booking details, redirect to home
    if (!bookingDetails) {
      navigate("/");
    }
  }, [bookingDetails, navigate]);

  if (!bookingDetails) {
    return null;
  }

  const formattedDate = bookingDetails.date 
    ? format(new Date(bookingDetails.date), "MMMM d, yyyy")
    : "";

  const dayOfWeek = bookingDetails.date
    ? format(new Date(bookingDetails.date), "EEEE")
    : "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            {/* Success Message */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4"
              >
                <CheckCircle className="w-12 h-12 text-primary" />
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-display text-3xl md:text-4xl text-foreground mb-2"
              >
                Booking Confirmed!
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-foreground/70"
              >
                Please save or screenshot your booking stub below
              </motion.p>
            </div>

            {/* Booking Stub - Paper Style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="relative mx-auto mb-8"
              style={{ maxWidth: "380px" }}
            >
              {/* Paper Background */}
              <div 
                className="relative rounded-lg overflow-hidden shadow-elevated"
                style={{
                  backgroundImage: `url(${bookingStubBg})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  aspectRatio: "3/4",
                }}
              >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-primary/80" />
                
                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-between p-6 text-center">
                  {/* Header */}
                  <div className="pt-4">
                    <h2 className="font-display text-3xl text-primary-foreground tracking-wider">
                      HILOMÈ
                    </h2>
                    <p className="text-primary-foreground/70 text-xs tracking-widest uppercase mt-1">
                      Skin & Body Clinic
                    </p>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 flex flex-col items-center justify-center py-6 w-full">
                    {/* Booking Number */}
                    <div className="mb-6">
                      <p className="text-primary-foreground/60 text-xs tracking-widest uppercase mb-1">
                        Booking Number
                      </p>
                      <p className="font-display text-2xl md:text-3xl text-primary-foreground font-bold tracking-wide">
                        {bookingNumber}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="w-24 h-px bg-primary-foreground/30 mb-6" />

                    {/* Guest Name */}
                    <div className="mb-4">
                      <p className="text-primary-foreground/60 text-xs tracking-widest uppercase mb-1">
                        Guest
                      </p>
                      <p className="font-display text-xl text-primary-foreground">
                        {bookingDetails.name}
                      </p>
                    </div>

                    {/* Date & Time */}
                    <div className="mb-4">
                      <p className="text-primary-foreground/60 text-xs tracking-widest uppercase mb-1">
                        Schedule
                      </p>
                      <p className="text-primary-foreground font-medium">
                        {dayOfWeek}
                      </p>
                      <p className="text-primary-foreground text-lg font-semibold">
                        {formattedDate}
                      </p>
                      <p className="text-primary-foreground/80 text-sm mt-1">
                        {bookingDetails.time}
                      </p>
                    </div>

                    {/* Membership Badge */}
                    <div className="mt-2">
                      <span className="inline-block px-4 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs tracking-wide">
                        {bookingDetails.membership}
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pb-4">
                    <p className="text-primary-foreground/50 text-[10px] tracking-wide">
                      Please arrive 10 minutes before your appointment
                    </p>
                    <p className="text-primary-foreground/40 text-[10px] mt-1">
                      Contact: 0977 334 4200
                    </p>
                  </div>
                </div>

                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary-foreground/30" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary-foreground/30" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary-foreground/30" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary-foreground/30" />
              </div>
            </motion.div>

            {/* Reminder Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-muted rounded-xl p-5 mb-6 text-center"
            >
              <p className="text-foreground font-medium mb-1 text-sm">
                📱 Take a screenshot of your booking stub!
              </p>
              <p className="text-foreground/70 text-xs">
                Show this to our staff when you arrive. A confirmation will also be sent to {bookingDetails.email}
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Button
                onClick={() => navigate("/book-consultation")}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Book Another
              </Button>
              <Button
                onClick={() => navigate("/")}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
