<template>
    <header class="tariffs-header">
        <h1>Tariffs</h1>
        <p>Welcome to WiFi Tariffs</p>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-else-if="tariffs.length === 0">No tariffs found</p>
    </header>

    <!-- Custom search UI -->
    <div class="search-bar">
        <input type="text" v-model="searchId" placeholder="Search by ID (e.g. basic-plan)" @keyup.enter="searchById" />
        <button @click="searchById">Search</button>
        <button class="reset" @click="reset">Reset</button>
    </div>

    <!-- Keep Vuetify table to benefit from pagination -->
    <v-data-table :headers="headers" :items="tariffs" :items-per-page="5" class="tariffs-table" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchTariffs, fetchTariff } from '../../actions/tariffs'
import type { Tariff } from '../../types/tariffs'

const tariffs = ref<Tariff[]>([])
const error = ref<string | null>(null)
const searchId = ref('')

const headers = [
    { title: 'ID', key: 'id' },
    { title: 'Name', key: 'name' },
    { title: 'Price', key: 'price' }
]

async function loadAll() {
    try {
        error.value = null
        tariffs.value = await fetchTariffs()
    } catch (e: any) {
        error.value = e?.message ?? 'Failed to load tariffs'
        tariffs.value = []
    }
}

async function searchById() {
    if (!searchId.value.trim()) return loadAll()
    try {
        error.value = null
        const t = await fetchTariff(searchId.value.trim())
        tariffs.value = [t]
    } catch (e: any) {
        error.value = e?.message ?? 'Tariff not found'
        tariffs.value = []
    }
}

function reset() {
    searchId.value = ''
    loadAll()
}

onMounted(loadAll)
</script>

<style lang="scss" scoped>
/* Layout & header */
.tariffs-header {
    text-align: center;
    margin-bottom: 1.25rem;

    h1 {
        margin: 0;
        font-size: 2rem;
        color: #2c3e50;
    }

    p {
        margin: 0.25rem 0;
        color: #555;
    }

    .error {
        color: #c0392b;
        font-weight: 600;
    }
}

/* Custom search UI (no Vuetify) */
.search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: .5rem;
    flex-wrap: wrap;
    margin: 0 auto 1rem;
    max-width: 720px;

    input {
        flex: 1 1 280px;
        max-width: 420px;
        padding: .6rem .8rem;
        border: 1px solid #dcdcdc;
        border-radius: 6px;
        font-size: .95rem;
        outline: none;

        &:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, .12);
        }
    }

    button {
        padding: .55rem .9rem;
        border: none;
        border-radius: 6px;
        background: #3498db;
        color: #fff;
        font-weight: 700;
        cursor: pointer;
        transition: background .15s ease;

        &:hover {
            background: #2d86c2;
        }

        &.reset {
            background: #95a5a6;

            &:hover {
                background: #7f8c8d;
            }
        }
    }
}

/* Make Vuetify table visually match our custom style without replacing pagination */
.tariffs-table {
    max-width: 900px;
    margin: 0 auto;

    /* Header row */
    :deep(thead th) {
        background: #f7f8fa;
        color: #2c3e50;
        font-weight: 700;
        border-bottom: 1px solid #e6e6e6;
    }

    /* Cells */
    :deep(tbody td) {
        border-bottom: 1px solid #efefef;
        color: #333;
        font-size: .95rem;
    }

    /* Zebra rows */
    :deep(tbody tr:nth-child(even)) {
        background: #fbfbfb;
    }

    /* Optional: round table corners (wrapper) */
    :deep(.v-table) {
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        overflow: hidden;
    }
}
</style>
