import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getCharacterPage,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  generateCharacter
} from '@/api/character'

export const useCharacterStore = defineStore('character', () => {
  const currentCharacter = ref(null)
  const characters = ref([])
  const total = ref(0)

  async function fetchCharacters(params) {
    const data = await getCharacterPage(params)
    characters.value = data.records || []
    total.value = data.total || 0
    return data
  }

  async function fetchCharacter(id) {
    const data = await getCharacter(String(id))
    currentCharacter.value = data
    return data
  }

  async function create(data) {
    return await createCharacter(data)
  }

  async function update(id, data) {
    return await updateCharacter(id, data)
  }

  async function remove(id) {
    return await deleteCharacter(id)
  }

  async function generate(id) {
    return await generateCharacter(String(id))
  }

  return {
    currentCharacter,
    characters,
    total,
    fetchCharacters,
    fetchCharacter,
    create,
    update,
    remove,
    generate
  }
})
