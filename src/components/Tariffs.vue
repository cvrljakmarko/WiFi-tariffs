<template>
    <div class="tariffs-wrapper">
        <header class="tariffs-header">
            <h1>Tariffs</h1>
            <p>Welcome to WiFi Tariffs</p>

            <!-- Server error banner -->
            <div v-if="error" class="error-banner">
                {{ error }}
                <button class="retry" @click="reload">Retry</button>
            </div>

            <!-- Success banner -->
            <div v-if="success" class="success-banner">
                {{ success }}
            </div>
        </header>

        <!-- Search -->
        <div class="search-bar">
            <input type="text" v-model="searchName" placeholder="Search by Name (e.g. Basic)" />
        </div>

        <!-- Table -->
        <v-data-table show-select :headers="headers" :items="filteredTariffs ?? []" :items-per-page="5"
            class="tariffs-table" />

        <!-- Actions -->
        <div class="actions">
            <v-btn variant="outlined" color="primary" @click="openDialog">
                Create
            </v-btn>
        </div>

        <!-- Create Tariff Modal -->
        <v-dialog v-model="dialog" max-width="420">
            <v-card>
                <v-card-title>Create Tariff</v-card-title>

                <v-card-text>
                    <!-- Name -->
                    <v-text-field v-model.trim="newTariff.name" label="Name" variant="outlined"
                        :error="showErrors && !!nameError" />
                    <p v-if="showErrors && nameError" class="field-error">
                        {{ nameError }}
                    </p>

                    <!-- Price -->
                    <v-text-field v-model.number="newTariff.price" label="Price (€)" type="number" variant="outlined"
                        :error="showErrors && !!priceError" step="0.01" min="0" inputmode="decimal" />
                    <p v-if="showErrors && priceError" class="field-error">
                        {{ priceError }}
                    </p>
                </v-card-text>

                <v-card-actions class="justify-end">
                    <v-btn :disabled="saving" text @click="closeDialog">Cancel</v-btn>
                    <v-btn color="primary" :loading="saving" @click="handleCreate">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { createTariff, fetchTariffs } from '../../actions/tariffs'
import type { Tariff } from '../../types/tariffs'

const tariffs = ref<Tariff[] | null>([])
const error = ref<string | null>(null)
const searchName = ref('')
const loading = ref(false)
const success = ref<string | null>(null)

const headers = [
    { title: 'ID', key: 'id' },
    { title: 'Name', key: 'name' },
    { title: 'Price', key: 'price' }
]

async function reload() {
    loading.value = true
    try {
        error.value = null
        tariffs.value = await fetchTariffs()
    } catch (e: any) {
        error.value = e?.message ?? 'Something went wrong. Please try again.'
        tariffs.value = []
    } finally {
        loading.value = false
    }
}

onMounted(reload)

const filteredTariffs = computed(() => {
    const q = searchName.value.trim().toLowerCase()
    if (!q) return tariffs.value
    return tariffs.value ? tariffs.value.filter(t => t.name?.toLowerCase().includes(q)) : null;
})

/** ---------- Modal / Create ---------- **/
const dialog = ref(false)
const saving = ref(false)
const showErrors = ref(false)
const newTariff = ref<{ name: string; price: number | null }>({ name: '', price: null })

function openDialog() {
    newTariff.value = { name: '', price: null }
    showErrors.value = false
    dialog.value = true
}
function closeDialog() {
    dialog.value = false
}

/** Validation rules */
const NAME_REGEX = /^[\p{L}\p{N}\s\-\.+]{2,50}$/u

const nameError = computed(() => {
    const v = newTariff.value.name?.trim() ?? ''
    if (!v) return 'Name is required.'
    if (v.length < 2) return 'Name must be at least 2 characters.'
    if (v.length > 50) return 'Name must be at most 50 characters.'
    if (!NAME_REGEX.test(v)) return 'Invalid characters.'
    return ''
})

const priceError = computed(() => {
    const p = newTariff.value.price
    if (p === null || p === undefined || Number.isNaN(p)) return 'Price is required.'
    if (p <= 0) return 'Price must be greater than 0.'
    const decimalsOk = Number.isInteger(p * 100)
    if (!decimalsOk) return 'Price can have up to 2 decimals.'
    return ''
})

const formValid = computed(() => !nameError.value && !priceError.value)

async function handleCreate() {
    showErrors.value = true
    if (!formValid.value) return

    saving.value = true
    try {
        const payload = { name: newTariff.value.name.trim(), price: Number(newTariff.value.price) }
        const created = await createTariff(payload)
        tariffs.value = [...tariffs.value ?? [], created]
        success.value = `Tariff "${created.name}" created successfully!`
        error.value = null
        closeDialog()

        // auto-hide success after 3s
        setTimeout(() => (success.value = null), 5000)
    } catch (e: any) {
        error.value = e?.message ?? 'Something went wrong. Please try again.'
    } finally {
        saving.value = false
    }
}
</script>

<style lang="scss" scoped>
.tariffs-wrapper {
    max-width: 960px;
    margin: 2rem auto;
    padding: 1.5rem;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, .05);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
}

.success-banner {
    margin-top: 1.5rem;
    background: #e9f9ed;
    color: #2c7a34;
    border: 1px solid #b6e2c6;
    padding: .6rem .75rem;
    border-radius: 8px;
    font-weight: 500;
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
        margin: .25rem 0;
        color: #555;
    }
}

/* Error banner */
.error-banner {
    margin-top: .5rem;
    background: #fdecea;
    color: #b13028;
    border: 1px solid #f5c2c0;
    padding: .6rem .75rem;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: .5rem;

    .retry {
        background: #b13028;
        color: #fff;
        border: none;
        border-radius: 6px;
        padding: .35rem .6rem;
        cursor: pointer;
    }
}

/* Search */
.search-bar {
    display: flex;
    justify-content: center;
    width: 100%;

    input {
        flex: 1;
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
}

/* Table */
.tariffs-table {
    width: 100%;

    :deep(.v-selection-control__input input) {
        opacity: unset;
    }

    :deep(thead th) {
        background: #f7f8fa;
        color: #2c3e50;
        font-weight: 700;
        border-bottom: 1px solid #e6e6e6;
    }

    :deep(tbody td) {
        border-bottom: 1px solid #efefef;
        color: #333;
        font-size: .95rem;
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

/* Inline field error */
.field-error {
    margin: .25rem 0 0;
    color: #b13028;
    font-size: .85rem;
}
</style>
