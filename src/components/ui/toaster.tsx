"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface ToastData {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
}

let toastId = 0;
const listeners: ((toast: ToastData) => void)[] = [];

export function toast(options: Omit<ToastData, "id">) {
  const id = String(++toastId);
  listeners.forEach((listener) => listener({ id, ...options }));
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener = (t: ToastData) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 5000);
    };

    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-slide-up flex items-start gap-3 rounded-lg border p-4 shadow-lg ${
            t.variant === "error"
              ? "border-red-200 bg-red-50"
              : t.variant === "success"
              ? "border-green-200 bg-green-50"
              : t.variant === "warning"
              ? "border-yellow-200 bg-yellow-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex-1">
            {t.title && <p className="font-medium text-gray-900">{t.title}</p>}
            {t.description && <p className="text-sm text-gray-500">{t.description}</p>}
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
