"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TasksContent from "@/components/tasks/tasks-content";
import TasksSkeleton from "@/components/tasks/tasks-skeleton";

export default function TasksPage() {
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

  if (loading) return <TasksSkeleton />;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <TasksContent user={user} />
    </div>
  );
}
