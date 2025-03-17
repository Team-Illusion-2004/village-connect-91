
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

const Signup = () => {
  const { signup, isAuthenticated, isLoading, villages } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [villageId, setVillageId] = useState("");
  const [role, setRole] = useState<"resident" | "volunteer">("resident");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signup(name, phone, villageId, role);
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
            <h2 className="text-xl font-semibold">Create an account</h2>
            <p className="text-sm text-muted-foreground">
              Join your village's digital community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="h-11"
              />
            </div>

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

            <div className="space-y-2">
              <Label>Account Type</Label>
              <RadioGroup value={role} onValueChange={(v) => setRole(v as "resident" | "volunteer")}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="resident" id="resident" />
                  <Label htmlFor="resident" className="cursor-pointer">
                    Resident
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="volunteer" id="volunteer" />
                  <Label htmlFor="volunteer" className="cursor-pointer">
                    Volunteer
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button type="submit" className="w-full h-11" disabled={isLoading}>
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
