// src/actions/tariffs.ts
import client from '../api/client'
import type { Tariff } from '../types/tariffs'

export async function fetchTariffs(): Promise<Tariff[]> {
    const { data } = await client.get<Tariff[]>('/tariffs')
    if (!Array.isArray(data)) {
        throw new Error('Unexpected response format: expected array')
    }
    return data
}

export async function fetchTariff(id: string): Promise<Tariff> {
    const { data } = await client.get<Tariff>(`/tariffs/${id}`)
    if (!data || typeof data !== 'object') {
        throw new Error('Unexpected response format: expected object')
    }
    return data
}
