import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getNovelTypes, getBirthplaces } from '@/api/novelType'

export const useNovelTypeStore = defineStore('novelType', () => {
  const types = ref([])
  const birthplaceMap = ref({})

  async function fetchTypes() {
    const data = await getNovelTypes()
    types.value = data || []
    return data
  }

  async function fetchBirthplaces(background) {
    if (!birthplaceMap.value[background]) {
      const data = await getBirthplaces(background)
      birthplaceMap.value[background] = data || []
    }
    return birthplaceMap.value[background]
  }

  return {
    types,
    birthplaceMap,
    fetchTypes,
    fetchBirthplaces
  }
})
