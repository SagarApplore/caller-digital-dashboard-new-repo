"use client";

import { useRouter } from "next/navigation";
import { ClientsPage } from "@/pages/clients";

export default function Clients() {
  const router = useRouter();

  const handlePageChange = (page: string) => {
    if (page === "add-client") {
      router.push("/outbound-campaign-manager/add-client");
    }
  };

  return <ClientsPage onPageChange={handlePageChange} />;
}
