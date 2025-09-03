import { AxiosResponse } from 'axios'
import client from '../api/client'
import type { Tariff } from '../types/tariffs'

export const fetchTariffs = async () => {
    try {
        const { data }: AxiosResponse<Tariff[]> = await client.get('/tariffs')
        return data
    } catch (error) {
        console.error('Error:', error)
        return null
    }
}

export const fetchTariff = async (id: number): Promise<Tariff | null> => {
    try {
        const { data }: AxiosResponse<Tariff> = await client.get(`/tariffs/${id}`)
        return data
    } catch (error) {
        console.error(`[fetchTariff] Failed for id="${id}":`, error)
        return null
    }
}

export async function createTariff(payload: Pick<Tariff, 'name' | 'price'>): Promise<Tariff> {
    const { data } = await client.post<Tariff>('/tariffs', payload)
    return data
}
