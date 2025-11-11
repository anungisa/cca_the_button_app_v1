"use client";

/**
 * Layout Wrapper component for Curling Canada App
 * Provides consistent layout structure
 * Note: Header and footer are now handled within individual page layouts for more control
 */
import { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  return (
    <>
      {children}
    </>
  );
} 