"use client";

import Image from "next/image";
import AnimatedForm from "@/components/Animated-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { useState } from "react";
import { motion } from "framer-motion";
// import { BackgroundBeams } from "@/components/ui/background-beams";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  // TODO: consider moving to another comp file w/ cli part
  const [cliLoading, setCliLoading] = useState(false);

  // TODO: consider using constants instead /lib/constants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  // TODO: consider using constants instead /lib/constants
  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen" id="hero">
      <div className="max-w-6xl mx-auto px-6 py-16 pt-20 md:pt-40">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-28"
        >
          {/* Header Section */}
          <motion.div
            variants={childVariants}
            className="space-y-6 flex flex-col items-center"
          >
            {/* <BackgroundBeams className="-z-50" /> */}
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-center w-[75vw] md:w-[40vw]">
              Production-Ready{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-tr from-redis to-rose-500">
                Redis
              </span>{" "}
              in Minutes
            </h1>

            <div className="space-y-4 text-center md:w-[40vw]">
              <p className="text-xl text-muted-foreground">
                Stop wrestling with infrastructure. Start building features.
              </p>
              <p className="text-xl text-muted-foreground">
                Get enterprise-grade Redis with queues, caching, and real-time
                features. All in one, simplified API.
              </p>
            </div>

            {/* Form Section */}
            <AnimatedForm />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
