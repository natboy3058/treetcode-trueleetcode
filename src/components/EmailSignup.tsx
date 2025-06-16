
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simple validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission success
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to Treetcode updates.",
        className: "bg-green-600 border-green-600 text-white"
      });
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Stay Updated with Treetcode
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            Enter your email to get Treetcode updates - new problems released every week
          </p>
        </div>
        
        <form name="treetcode-updates" netlify onSubmit={handleSubmit} className="space-y-3">
          <input type="hidden" name="form-name" value="treetcode-updates" />
          <Input
            type="email"
            name="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-green-300 dark:border-green-700 focus:border-green-500 dark:focus:border-green-400"
            required
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? "Subscribing..." : "Get Updates"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
