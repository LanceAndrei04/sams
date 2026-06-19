"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "./button";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    // Track active element to restore focus on close
    previousFocus.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      
      // Basic focus trapping
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex="0"]'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent body scroll

    // Focus the first action button or modal container
    setTimeout(() => {
      if (dialogRef.current) {
        const firstButton = dialogRef.current.querySelector("button") as HTMLElement;
        if (firstButton) firstButton.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = ""; // Restore body scroll
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render modal to document body via Portal
  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/18 dark:bg-slate-500/24 backdrop-blur-[2px] transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-desc" : undefined}
        className="relative z-10 w-full max-w-md rounded-[24px] border border-white/75 bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(228,233,235,0.92))] p-6 text-foreground shadow-[10px_10px_24px_rgba(163,173,175,0.22),-8px_-8px_20px_rgba(255,255,255,0.94)] animate-scale-up focus:outline-none"
        tabIndex={-1}
      >
        {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 cursor-pointer rounded-full bg-[linear-gradient(145deg,rgba(255,255,255,0.9),rgba(226,231,233,0.8))] p-1.5 text-muted-foreground shadow-[4px_4px_10px_rgba(163,173,175,0.16),-4px_-4px_10px_rgba(255,255,255,0.94)] transition-colors hover:text-foreground"
            aria-label="Close dialog"
          >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h3 id="dialog-title" className="text-lg font-bold text-foreground">
              {title}
            </h3>
            {description && (
              <p id="dialog-desc" className="text-sm text-muted-foreground mt-1.5">
                {description}
              </p>
            )}
          </div>

          {children && <div className="py-2">{children}</div>}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              {cancelLabel}
            </Button>
            {onConfirm && (
              <Button variant="primary" className="focus:ring-red-500/20" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
