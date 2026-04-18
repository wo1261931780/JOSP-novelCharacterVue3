import request from '@/utils/request'

export function createCharacter(data) {
  // 移除前端表单中的 category 字段（用于选择分类），后端 DTO 不接收此字段
  const { category, ...rest } = data
  return request({
    url: '/v1/characters',
    method: 'post',
    data: rest
  })
}

export function getCharacter(id) {
  return request({
    url: `/v1/characters/${id}`,
    method: 'get'
  })
}

export function updateCharacter(id, data) {
  return request({
    url: `/v1/characters/${id}`,
    method: 'put',
    data
  })
}

export function deleteCharacter(id) {
  return request({
    url: `/v1/characters/${id}`,
    method: 'delete'
  })
}

export function generateCharacter(id) {
  return request({
    url: `/v1/characters/${id}/generate`,
    method: 'post'
  })
}

export function getCharacterPage(params) {
  return request({
    url: '/v1/characters',
    method: 'get',
    params
  })
}

export function getCharacterEvents(characterId) {
  return request({
    url: `/v1/characters/${characterId}/events`,
    method: 'get'
  })
}

export function createCharacterEvent(characterId, data) {
  return request({
    url: `/v1/characters/${characterId}/events`,
    method: 'post',
    data
  })
}

export function updateCharacterEvent(characterId, eventId, data) {
  return request({
    url: `/v1/characters/${characterId}/events/${eventId}`,
    method: 'put',
    data
  })
}

export function deleteCharacterEvent(characterId, eventId) {
  return request({
    url: `/v1/characters/${characterId}/events/${eventId}`,
    method: 'delete'
  })
}

export function getCharacterDimensions(characterId) {
  return request({
    url: `/v1/characters/${characterId}/dimensions`,
    method: 'get'
  })
}
