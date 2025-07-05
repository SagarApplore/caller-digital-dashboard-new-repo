"use client";

import { useRouter } from "next/navigation";
import { AddClientPage } from "@/pages/add-client";

export default function AddClient() {
  const router = useRouter();

  const handlePageChange = (page: string) => {
    if (page === "clients") {
      router.push("/outbound-campaign-manager/clients");
    }
  };

  return <AddClientPage onPageChange={handlePageChange} />;
}
