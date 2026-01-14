import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowLeft, Home, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import html2canvas from "html2canvas";
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
  const stubRef = useRef<HTMLDivElement>(null);
  const [showDownloadPrompt, setShowDownloadPrompt] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

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
  const handleDownload = async () => {
    if (!stubRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(stubRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      const link = document.createElement("a");
      link.download = `hilome-booking-${bookingNumber}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setShowDownloadPrompt(false);
    } catch (error) {
      console.error("Error downloading receipt:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  if (!bookingDetails) {
    return null;
  }
  const formattedDate = bookingDetails.date ? format(new Date(bookingDetails.date), "MMMM d, yyyy") : "";
  const dayOfWeek = bookingDetails.date ? format(new Date(bookingDetails.date), "EEEE") : "";
  return <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Download Prompt Modal */}
          {showDownloadPrompt && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <motion.div initial={{
            scale: 0.9,
            opacity: 0
          }} animate={{
            scale: 1,
            opacity: 1
          }} className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-elevated text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-foreground/70 text-sm mb-6">
                  Would you like to download your booking receipt? You can show this to our staff when you arrive.
                </p>
                <div className="flex flex-col gap-3">
                  <Button onClick={handleDownload} disabled={isDownloading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    {isDownloading ? "Downloading..." : "Download Receipt"}
                  </Button>
                  <Button onClick={() => setShowDownloadPrompt(false)} variant="ghost" className="w-full text-foreground/60">
                    Maybe Later
                  </Button>
                </div>
              </motion.div>
            </motion.div>}

          <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} className="max-w-lg mx-auto">
            {/* Thank You Message */}
            <div className="text-center mb-8">
              <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              type: "spring",
              stiffness: 200,
              delay: 0.2
            }} className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <CheckCircle className="w-10 h-10 text-primary" />
              </motion.div>
              
              <motion.h1 initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.3
            }} className="font-display text-3xl md:text-4xl text-foreground mb-2">
                Thank You!
              </motion.h1>
              
              <motion.p initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.4
            }} className="text-foreground/70">
                Your booking has been confirmed. Please arrive 10 minutes before your scheduled appointment.
              </motion.p>
            </div>

            {/* Booking Stub - Paper Style with Background Image */}
            

            {/* Download Button */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.6
          }} className="text-center mb-6">
              <Button onClick={handleDownload} disabled={isDownloading} className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 mx-auto">
                <Download className="w-4 h-4" />
                {isDownloading ? "Downloading..." : "Download Receipt"}
              </Button>
            </motion.div>

            {/* Action Buttons */}
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.7
          }} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate("/book-consultation")} variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Book Another
              </Button>
              <Button onClick={() => navigate("/")} variant="outline" size="sm" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>;
};
export default ThankYou;