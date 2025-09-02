<template>
    <v-card title="Tariffs" flat>
        <template v-slot:text>
            <v-text-field v-model="search" label="Search" prepend-inner-icon="mdi-magnify" variant="outlined"
                hide-details single-line></v-text-field>
        </template>

        <v-data-table :headers="headers" :items="tariffs" :search="search"></v-data-table>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
