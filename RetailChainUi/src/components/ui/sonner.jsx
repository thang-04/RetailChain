"use client"

import { Toaster } from "sonner"

export function Sonner() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 5000,
        classNames: {
          success: "bg-green-500 text-white",
          error: "bg-red-500 text-white",
          warning: "bg-yellow-500 text-white",
          info: "bg-blue-500 text-white",
        },
      }}
    />
  )
}
