"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import { Navbar } from "@/components/Navbar";
import { paymentAPI } from "@/lib/api";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  billingCycle: string;
  features: string;
  maxCourses: number | null;
  maxStudents: number | null;
}

const paymentSchema = z.object({
  cardNumber: z.string().min(13, "Card number must be at least 13 digits"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry date must be MM/YY"),
  cvv: z.string().min(3, "CVV must be at least 3 digits"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export default function PaymentPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { selectedPlanId, setSelectedPlanId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [plansLoading, setPlansLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  // Check if user has active subscription and redirect if they do
  useEffect(() => {
    const checkSubscription = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      if (!token) {
        error("Authentication required. Please register first.");
        setTimeout(() => {
          router.push("/register");
        }, 1500);
        return;
      }

      try {
        const response = await fetch("http://localhost:8082/api/payments/subscriptions/active", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.hasActiveSubscription) {
            // User already has active subscription, redirect to dashboard
            success("You already have an active subscription!");
            setTimeout(() => {
              router.push("/student/dashboard");
            }, 1000);
            return;
          }
        }
      } catch (err) {
        console.error("Error checking subscription:", err);
      }
    };

    checkSubscription();
  }, [router, error, success]);

  // Initialize token from localStorage on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      error("Authentication required. Please register first.");
      setTimeout(() => {
        router.push("/register");
      }, 1500);
    }
  }, [router, error]);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await paymentAPI.getPlans() as SubscriptionPlan[];
        setPlans(data);

        // Set selected plan if planId is provided
        if (selectedPlanId) {
          const plan = data.find((p: SubscriptionPlan) => p.id === selectedPlanId);
          if (plan) setSelectedPlan(plan);
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        error("Failed to load subscription plans");
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, [selectedPlanId, error]);

  const onSubmit = async (data: PaymentFormData) => {
    if (!selectedPlan) {
      error("Please select a subscription plan");
      return;
    }

    setIsLoading(true);
    try {
      // Get token from localStorage directly
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      
      if (!token) {
        error("Authentication required. Please register first.");
        return;
      }

      const paymentData = {
        planId: selectedPlan.id,
        cardNumber: data.cardNumber,
        cardholderName: data.cardholderName,
        expiryDate: data.expiryDate,
        cvv: data.cvv,
      };

      await paymentAPI.processPayment(paymentData);
      success("Payment successful! Subscription activated.");
      
      // Clear selected plan
      setSelectedPlanId(null);
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/student/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("Payment error:", err);
      error(err.message || "Payment processing failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (plansLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-100 pt-20">
          <div className="text-center">
            <p className="text-gray-600">Loading subscription plans...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-100 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* Plans Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
              Choose Your Subscription Plan
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Select a plan to get started with our e-learning platform
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all ${
                    selectedPlan?.id === plan.id
                      ? "border-blue-600 border-2 shadow-lg"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                  onClick={() => setSelectedPlan(plan)}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-blue-600">
                        ${plan.price}
                      </span>
                      <span className="text-gray-600 ml-2">
                        /{plan.billingCycle === "MONTHLY" ? "month" : "year"}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          Features:
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {plan.features && JSON.parse(plan.features).map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center">
                              <span className="text-blue-600 mr-2">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {plan.maxCourses && (
                        <p className="text-sm text-gray-600">
                          Max Courses: {plan.maxCourses}
                        </p>
                      )}
                      {plan.maxStudents && (
                        <p className="text-sm text-gray-600">
                          Max Students: {plan.maxStudents}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Payment Form Section */}
          {selectedPlan && (
            <div className="max-w-md mx-auto">
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>
                    Complete your payment for {selectedPlan.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="4242 4242 4242 4242"
                        {...register("cardNumber")}
                      />
                      {errors.cardNumber && (
                        <p className="text-sm text-red-500">
                          {errors.cardNumber.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        placeholder="John Doe"
                        {...register("cardholderName")}
                      />
                      {errors.cardholderName && (
                        <p className="text-sm text-red-500">
                          {errors.cardholderName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          {...register("expiryDate")}
                        />
                        {errors.expiryDate && (
                          <p className="text-sm text-red-500">
                            {errors.expiryDate.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          {...register("cvv")}
                        />
                        {errors.cvv && (
                          <p className="text-sm text-red-500">
                            {errors.cvv.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Processing Payment..."
                        : `Pay $${selectedPlan.price}`}
                    </Button>
                  </form>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    For testing: Use any card number (e.g., 4242 4242 4242 4242)
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {!selectedPlan && (
            <div className="text-center">
              <p className="text-gray-600">
                Please select a subscription plan to continue
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
