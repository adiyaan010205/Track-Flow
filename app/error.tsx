"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Something went wrong!</h1>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
} 