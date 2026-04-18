import request from '@/utils/request'

export function getStatsOverview() {
  return request({
    url: '/v1/stats/overview',
    method: 'get'
  })
}
