"use client";
import React, { useEffect, useState } from "react";
import {
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  motion,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronRightIcon } from "lucide-react";
import { Button } from "./ui/button";

export const Navbar = ({ className }: { className?: string }) => {
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const navItems = [
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Contact",
      link: "/contact",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Transform values based on scroll progress
  const heightValue = useTransform(scrollYProgress, [0, 0.1], ["80px", "64px"]);

  // Transform for converging animation - logo moves right, nav items move left
  const logoX = useTransform(scrollYProgress, [0, 0.1], ["0%", "20%"]);
  const navItemsX = useTransform(scrollYProgress, [0, 0.1], ["0%", "-20%"]);
  const mainNavOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  // Floating navbar transforms
  const floatingOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const floatingScale = useTransform(scrollYProgress, [0, 0.1], [0.9, 1]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsScrolled(latest > 0.1);
  });

  if (!isMounted) {
    return null; // or a loading state
  }

  const isClient = typeof window !== "undefined";
  const isMobile = isClient ? window.innerWidth < 768 : false;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={true}
        style={{
          height: isClient ? (isMobile ? "64px" : heightValue) : "64px",
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 flex justify-center max-w-6xl mx-auto",
          className,
        )}
      >
        {/* Original Navbar */}
        <motion.div
          initial={true}
          // style={{
          //   opacity: window.innerWidth >= 768 ? mainNavOpacity : 1,
          // }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          className="h-full max-w-7xl flex w-full bg-background/70 backdrop-blur-md md:bg-transparent"
        >
          <div className="flex items-center justify-between w-full px-6">
            {/* Logo with rightward movement */}
            <motion.div
              // style={{
              //   x: window.innerWidth >= 768 ? logoX : 0,
              // }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
            >
              <Link
                href="/"
                className="bg-clip-text text-transparent bg-gradient-to-tr from-primary to-rose-500 text-3xl font-bold tracking-tight"
              >
                returo
              </Link>
            </motion.div>

            {/* Nav items with leftward movement */}
            <motion.div
              style={{
                x: window.innerWidth >= 768 ? navItemsX : 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
              }}
              className="flex items-center gap-6 md:gap-16"
            >
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="text-muted-foreground hover:text-primary transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Floating Navbar - Hidden on small devices */}
        {/* <motion.div */}
        {/*   initial={false} */}
        {/*   style={{ */}
        {/*     opacity: floatingOpacity, */}
        {/*     scale: floatingScale, */}
        {/*   }} */}
        {/*   transition={{ */}
        {/*     duration: 0.2, */}
        {/*     ease: "easeInOut", */}
        {/*   }} */}
        {/*   className="absolute top-2 hidden md:block" */}
        {/* > */}
        {/*   <div className="flex items-center justify-center space-x-2 bg-background/90 border rounded-full p-1 shadow-lg backdrop-blur-sm gap-6 pl-6"> */}
        {/*     {/* <Link href="/" className="text-lg font-bold text-primary"> */}
        {/*     {/*   returo */}
        {/*     {/* </Link> */}
        {/*     {navItems.map((item, idx) => ( */}
        {/*       <Link */}
        {/*         key={idx} */}
        {/*         href={item.link} */}
        {/*         className="text-sm text-muted-foreground hover:text-primary transition-colors" */}
        {/*       > */}
        {/*         {item.name} */}
        {/*       </Link> */}
        {/*     ))} */}
        {/*     <Button className="group px-6 rounded-full"> */}
        {/*       <Link href="#hero" className="flex items-center gap-2"> */}
        {/*         Join Waitlist */}
        {/*         <ChevronRight className="group-hover:translate-x-1 transition" /> */}
        {/*       </Link> */}
        {/*     </Button> */}
        {/*   </div> */}
        {/* </motion.div> */}
      </motion.div>
    </AnimatePresence>
  );
};

export default Navbar;
