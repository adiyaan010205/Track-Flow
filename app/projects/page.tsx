"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectsContent from "@/components/projects/projects-content";
import ProjectsSkeleton from "@/components/projects/projects-skeleton";

export default function ProjectsPage() {
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
    return <ProjectsSkeleton />;
  }
  if (!user) return null;
  return <ProjectsContent user={user} />;
}
