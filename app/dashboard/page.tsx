"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardContent from "@/components/dashboard/dashboard-content";
import DashboardSkeleton from "@/components/dashboard/dashboard-skeleton";

export default function DashboardPage() {
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
        if (data && data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push("/auth/login");
      });
  }, [router]);

  if (loading) {
    return <DashboardSkeleton />;
  }
  if (!user) return null;
  return <DashboardContent user={user} />;
}
