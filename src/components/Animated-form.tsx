"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Loader,
  Loader2,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormValues = z.infer<typeof formSchema>;

const AnimatedForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        // The token should be set in the cookie by our middleware
        const response = await fetch("/api/v1/csrf", {
          method: "GET",
          credentials: "include", // Important for cookies
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error("Failed to fetch CSRF token:", error);
        setServerError(
          "Failed to initialize form security. Please refresh the page.",
        );
      }
    };

    getCsrfToken();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: FormValues) => {
    const now = Date.now();
    if (now - lastSubmitTime < 1000) {
      setServerError("Please wait before submitting again.");
      return;
    }

    try {
      setServerError(null);
      setLastSubmitTime(now);

      const response = await fetch("/api/v1/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          // CSRF token validation failed
          setServerError(
            "Security validation failed. Please refresh the page.",
          );
          return;
        }
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitted(true);
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowErrors(true);

    const isValid = await form.trigger();
    if (isValid) {
      form.handleSubmit(onSubmit)(e);
    }
  };

  const errorMessageVariants = {
    initial: {
      opacity: 0,
      y: -10,
      height: 0,
    },
    animate: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <div className="max-w-md mx-auto md:max-w-2xl">
      {!submitted ? (
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex flex-col md:flex-row md:justify-center gap-2">
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className={`transition-all duration-200 md:max-w-md ${
                          showErrors && form.formState.errors.email
                            ? "ring-2 ring-rose-500 focus:ring-2 focus:ring-rose-500"
                            : ""
                        }`}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setShowErrors(false);
                          setServerError(null);
                          field.onChange(e);
                        }}
                        aria-label="Email address"
                        type="email"
                        autoComplete="email"
                      />
                      <Button
                        type="submit"
                        className="px-12 group"
                        disabled={isSubmitting}
                        data-umami-event="waitlist-button"
                      >
                        {isSubmitting ? (
                          <Loader2
                            className="w-5 h-5 animate-spin"
                            aria-hidden="true"
                          />
                        ) : (
                          <>
                            Join Waitlist
                            <ChevronRight
                              className="group-hover:translate-x-1 ml-2 w-4 h-4 transition-all ease-in-out"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <AnimatePresence mode="wait">
                    {showErrors && form.formState.errors.email && (
                      <motion.div
                        key="error-message"
                        variants={errorMessageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="md:text-center"
                      >
                        <FormMessage />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </FormItem>
              )}
            />
            <AnimatePresence mode="wait">
              {showErrors && serverError && (
                <motion.div
                  key="server-error"
                  variants={errorMessageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Alert variant="destructive" role="alert">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert
            className="bg-emerald-50 border-emerald-200 shadow-sm flex leading-5"
            role="alert"
          >
            <CheckCircle
              className="w-4 h-4 text-emerald-600"
              aria-hidden="true"
            />
            <span className="ml-2 text-emerald-800">
              Thanks! We'll notify you when we launch.
            </span>
          </Alert>
        </motion.div>
      )}
    </div>
  );
};

export default AnimatedForm;
