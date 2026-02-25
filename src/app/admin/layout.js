"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminProvider } from "../_provider/adminProvider";

const parseJwtPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
};

export default function AdminPageLayout({ children }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const payload = parseJwtPayload(token);

    if (!payload || payload.role !== "admin") {
      router.replace("/home");
      return;
    }

    setIsAllowed(true);
  }, [router]);

  if (!isAllowed) {
    return <div className="min-h-screen w-full bg-[#E4E4E5]" />;
  }

  return (
    <div className="min-h-screen w-full">
      <AdminProvider>{children}</AdminProvider>
    </div>
  );
}
