// components/SpinLoader.jsx
import React from "react";

export default function SpinLoader({
  size = "36px",
  className = "text-primary-text",
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
      }}
      className={`flex justify-center items-center ${className}`}
    >
      <svg
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="w-full h-full animate-spin"
      >
        {/* Background circle with low opacity */}
        <path
          d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z"
          fillOpacity="0.2"
        />
        {/* Foreground arc */}
        <path d="M7.25.75A.75.75 0 018 0a8 8 0 018 8 .75.75 0 01-1.5 0A6.5 6.5 0 008 1.5a.75.75 0 01-.75-.75z" />
      </svg>
    </div>
  );
}
