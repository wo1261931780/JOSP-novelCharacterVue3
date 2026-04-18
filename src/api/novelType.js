import request from '@/utils/request'

export function getNovelTypes() {
  return request({
    url: '/v1/novel-types',
    method: 'get'
  })
}

export function getBirthplaces(background) {
  return request({
    url: '/v1/novel-types/birthplaces',
    method: 'get',
    params: { background }
  })
}

export function getCategories() {
  return request({
    url: '/v1/novel-types/categories',
    method: 'get'
  })
}

export function getTypesByCategory(category) {
  return request({
    url: '/v1/novel-types/by-category',
    method: 'get',
    params: { category }
  })
}

export function getCompatibleBackgrounds(novelTypeId) {
  return request({
    url: '/v1/novel-types/compatible-backgrounds',
    method: 'get',
    params: { novelTypeId }
  })
}
