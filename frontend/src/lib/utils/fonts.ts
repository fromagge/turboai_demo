import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const inriaSerif = localFont({
  src: "../../app/fonts/InriaSerif-Bold.ttf",
  weight: "700",
  variable: "--font-inria-serif",
});

export const fontVariables = `${inter.variable} ${inriaSerif.variable}`;
