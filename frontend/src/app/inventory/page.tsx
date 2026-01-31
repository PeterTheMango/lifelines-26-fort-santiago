import { Material } from "@/lib/api";
import InventoryPageClient from "./InventoryPageClient";

const API_URL = process.env.API_URL || "http://localhost:8000";

async function getInventory(): Promise<Material[]> {
  try {
    const response = await fetch(`${API_URL}/items`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return [];
    }
    return response.json();
  } catch {
    return [];
  }
}

export default async function InventoryPage() {
  const inventory = await getInventory();
  return <InventoryPageClient inventory={inventory} />;
}
