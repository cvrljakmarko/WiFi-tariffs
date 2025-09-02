<template>
    <div class="tariffs-wrapper">
        <header class="tariffs-header">
            <h1>Tariffs</h1>
            <p>Welcome to WiFi Tariffs</p>
        </header>

        <!-- Custom search UI -->
        <div class="search-bar">
            <input type="text" v-model="searchName" placeholder="Search by Name (e.g. Basic)"
                @keyup.enter="applySearch" />
        </div>

        <!-- Vuetify table -->
        <v-data-table :headers="headers" :items="filteredTariffs" :items-per-page="5" class="tariffs-table" />

        <!-- Button centered below table -->
        <div class="actions">
            <v-btn variant="outlined" @click="createTariffInMemory">
                Create
            </v-btn>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { createTariff, fetchTariffs } from '../../actions/tariffs'
import type { Tariff } from '../../types/tariffs'

const tariffs = ref<Tariff[]>([])
const error = ref<string | null>(null)
const searchName = ref('')

const headers = [
    { title: 'ID', key: 'id' },
    { title: 'Name', key: 'name' },
    { title: 'Price', key: 'price' }
]

onMounted(async () => {
    try {
        error.value = null
        tariffs.value = await fetchTariffs()
    } catch (e: any) {
        error.value = e?.message ?? 'Failed to load tariffs'
        tariffs.value = []
    }
})

const filteredTariffs = computed(() => {
    const q = searchName.value.trim().toLowerCase()
    if (!q) return tariffs.value
    return tariffs.value.filter(t => t.name?.toLowerCase().includes(q))
})

async function createTariffInMemory() {
    try {
        const created = await createTariff({ name: 'New Plan', price: 0 })
        // Append directly so the new row shows without reloading everything
        tariffs.value = [...tariffs.value, created]
    } catch (e: any) {
        error.value = e?.message ?? 'Something went wrong. Please try again.'
    }
}

function reset() {
    searchName.value = ''
}
</script>

<style lang="scss" scoped>
.tariffs-wrapper {
    max-width: 960px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
}

/* Header */
.tariffs-header {
    text-align: center;

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

/* Search */
.search-bar {
    display: flex;
    justify-content: center;
    width: 100%;

    input {
        flex: 1;
        max-width: 400px;
        padding: 0.6rem 0.8rem;
        border: 1px solid #dcdcdc;
        border-radius: 6px;
        font-size: 0.95rem;
        outline: none;

        &:focus {
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.12);
        }
    }
}

/* Table */
.tariffs-table {
    width: 100%;

    :deep(thead th) {
        background: #f7f8fa;
        color: #2c3e50;
        font-weight: 700;
        border-bottom: 1px solid #e6e6e6;
    }

    :deep(tbody td) {
        border-bottom: 1px solid #efefef;
        color: #333;
        font-size: 0.95rem;
    }

    :deep(tbody tr:nth-child(even)) {
        background: #fbfbfb;
    }

    :deep(.v-table) {
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        overflow: hidden;
    }
}

/* Actions */
.actions {
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>
