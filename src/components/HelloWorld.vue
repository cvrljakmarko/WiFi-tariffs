<template>
    <div class="card">
        <DataTable :value="tariffs" tableStyle="min-width: 50rem">
            <Column field="id" header="Code" />
            <Column field="name" header="Name" />
            <Column field="features.bandwidth" header="Bandwidth" />
        </DataTable>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { fetchTariffs } from '../../actions/tariffs'
import type { Tariff } from '../../types/tariffs'

const tariffs = ref<Tariff[]>([])
const error = ref<string | null>(null)

onMounted(async () => {
    try {
        tariffs.value = await fetchTariffs()
    } catch (e: any) {
        error.value = e?.message ?? 'Failed to load tariffs'
        console.error(e)
    }
})
</script>

<style scoped></style>
