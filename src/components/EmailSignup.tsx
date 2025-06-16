// src/components/EmailSignup.tsx

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Helper function to encode form data for submission
const encode = (data: { [key: string]: any }) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);

    try {
      // This is the correct AJAX submission logic for Netlify
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({
          "form-name": "treetcode-updates",
          email: email,
        }),
      });

      // This code now runs only AFTER a successful submission
      toast({
        title: "Success!",
        description: "Thanks for signing up! You'll receive updates about new problems every week.",
        className: "bg-green-600 border-green-600 text-white",
      });
      setEmail(""); // Clear the form on success
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-semibold">Stay Updated</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your email to get Treetcode updates - new problems released every week
        </p>
      </CardHeader>
      <CardContent>
        {/*
          This form is for the user. It no longer needs data-netlify,
          but we keep the name and the hidden input for best practice.
        */}
        <form 
          name="treetcode-updates" 
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input type="hidden" name="form-name" value="treetcode-updates" />
          <div className="flex gap-2">
            <Input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isSubmitting || !email}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}