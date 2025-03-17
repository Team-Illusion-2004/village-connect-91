
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { FormEvent, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Login = () => {
  const { login, requestOtp, isAuthenticated, isLoading, villages } = useAuth();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [villageId, setVillageId] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  const handlePhoneSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone || !villageId) return;
    
    await requestOtp(phone);
    setStep("otp");
  };

  const handleOtpSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    
    await login(phone, otp, villageId);
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto">
            <span className="text-primary-foreground font-bold text-lg">VC</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">VillageConnect</h1>
          <p className="text-muted-foreground">
            Connect with your village community, report issues, and stay updated.
          </p>
        </div>
        
        <div className="bg-card border rounded-xl shadow-sm p-6 space-y-6 animate-slide-up">
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold">Welcome back</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to access your village's updates
            </p>
          </div>

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="village">Your Village</Label>
                <Select value={villageId} onValueChange={setVillageId} required>
                  <SelectTrigger id="village" className="h-11">
                    <SelectValue placeholder="Select your village" />
                  </SelectTrigger>
                  <SelectContent>
                    {villages.map((village) => (
                      <SelectItem key={village.id} value={village.id}>
                        {village.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Request OTP"
                )}
              </Button>
              
              <p className="text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter the OTP sent to your phone"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  For demo, use OTP: 1234
                </p>
              </div>
              
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Verify & Login"
                )}
              </Button>
              
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => setStep("phone")}
              >
                Go back
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
