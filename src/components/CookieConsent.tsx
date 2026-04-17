import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) {
      setTimeout(() => setShow(true), 1500);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-5 shadow-lg">
        <div className="flex items-start gap-3">
          <Shield className="text-primary mt-0.5 flex-shrink-0" size={20} />
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-foreground text-sm mb-1">Cookie & Privacy Notice</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This site uses essential cookies and Firebase services for authentication and data storage. 
              We respect your privacy and do not share personal data with third parties.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <Button variant="outline" size="sm" onClick={decline}>Decline</Button>
          <Button size="sm" onClick={accept}>Accept</Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
