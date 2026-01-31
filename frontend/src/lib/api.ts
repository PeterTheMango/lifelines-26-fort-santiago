const API_URL = "http://localhost:8000";

export interface Material {
    id: number;
    type: string;
    category: string;
    quantity: string;
    unit: string;
    maxCapacity: number;
    currentAmount: number;
    requiredAmount: number;
    location: string;
    coordinates: { lat: number; lng: number };
    updated: string;
    status: "good" | "low" | "critical" | "warning";
    description?: string;
}

export async function fetchInventory(): Promise<Material[]> {
    const response = await fetch(`${API_URL}/items`);
    if (!response.ok) {
        throw new Error('Failed to fetch inventory');
    }
    return response.json();
}

export async function createInventoryItem(item: any): Promise<Material> {
    const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    });
    if (!response.ok) {
        throw new Error('Failed to create item');
    }
    return response.json();
}

export interface DashboardStats {
    totalResources: number;
    activeMesh: { online: number; total: number };
    estValue: number;
    activeAlerts: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_URL}/dashboard/stats`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
    }
    return response.json();
}
