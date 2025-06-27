"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TimeTrackingContent from "@/components/time-tracking/time-tracking-content";
import TimeTrackingSkeleton from "@/components/time-tracking/time-tracking-skeleton";

export default function TimeTrackingPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => {
        if (res.status === 401) {
          router.push("/auth/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/auth/login");
      });
  }, [router]);

  if (loading) return <TimeTrackingSkeleton />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <TimeTrackingContent user={user} />
    </div>
  );
}
