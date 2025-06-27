"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdvancedReportsContent from "@/components/reports/advanced-reports-content";
import MainLayout from "@/components/layout/main-layout";

export default function AdvancedReportsPage() {
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

  if (loading) return <MainLayout><div>Loading...</div></MainLayout>;
  if (!user) return null;

  return (
    <MainLayout>
      <AdvancedReportsContent user={user} />
    </MainLayout>
  );
}
