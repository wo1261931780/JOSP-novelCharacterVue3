<template>
  <div class="detail-page">
    <div class="page-header">
      <el-button text @click="$router.push('/library')" class="back-btn">
        <span>&larr;</span> 返回角色库
      </el-button>
    </div>

    <div v-loading="loading" class="content-wrapper">
      <!-- 角色头部：自动占满整行 -->
      <div v-if="character" class="character-header">
        <div class="avatar-placeholder">
          <span>{{ character.name?.charAt(0) }}</span>
        </div>
        <div class="header-info">
          <h1 class="character-name">{{ character.name }}</h1>
          <div class="basic-tags">
            <el-tag :type="getGenderType(character.gender)">
              {{ character.genderText }}
            </el-tag>
            <el-tag type="info">{{ character.age }}岁</el-tag>
            <el-tag type="warning">{{ character.personality }}</el-tag>
            <el-tag>{{ character.background }}</el-tag>
            <el-tag type="success">{{ character.novelTypeName || '未分类' }}</el-tag>
          </div>
          <div class="status-row">
            <span class="status-label">状态：</span>
            <el-tag :type="getStatusType(character.status)">
              {{ character.statusText }}
            </el-tag>
            <el-button
              v-if="character.status === 0"
              type="primary"
              size="small"
              :loading="generating"
              @click="handleGenerate"
            >
              生成详情
            </el-button>
            <el-button
              v-else-if="character.status === 1"
              type="warning"
              size="small"
              :loading="generating"
              @click="handleGenerate"
            >
              重新生成
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete"
            >
              删除角色
            </el-button>
          </div>
        </div>
      </div>

      <!-- 详细信息 tab -->
      <div v-if="character" class="detail-tabs-wrapper">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="详细信息" name="detail">
            <!-- status=0：尚未生成详情，显示引导卡片 -->
            <div v-if="character.status === 0" class="empty-generate-card">
              <div class="empty-icon">&#128172;</div>
              <h3>角色详情尚未生成</h3>
              <p>点击下方按钮，使用 AI 为角色生成完整的详细信息</p>
              <el-button type="primary" size="large" :loading="generating" @click="handleGenerate">
                生成详情
              </el-button>
            </div>

            <div v-else class="detail-content">
              <div class="detail-section">
                <h3 class="section-title">
                  <span class="icon">&#128065;</span> 外貌描写
                </h3>
                <p class="section-text">{{ character.physicalDesc || '暂无描述' }}</p>
              </div>

              <div class="detail-section">
                <h3 class="section-title">
                  <span class="icon">&#129492;</span> 行为举止
                </h3>
                <p class="section-text">{{ character.behaviorDesc || '暂无描述' }}</p>
              </div>

              <div class="detail-section">
                <h3 class="section-title">
                  <span class="icon">&#128172;</span> 语言风格
                </h3>
                <p class="section-text">{{ character.speechStyle || '暂无描述' }}</p>
              </div>

              <div class="detail-section">
                <h3 class="section-title">
                  <span class="icon">&#129504;</span> 心理活动
                </h3>
                <p class="section-text">{{ character.psychological || '暂无描述' }}</p>
              </div>

              <div class="detail-section">
                <h3 class="section-title">
                  <span class="icon">&#128214;</span> 背景故事
                </h3>
                <p class="section-text">{{ character.backstory || '暂无描述' }}</p>
              </div>

              <div class="detail-section">
                <h3 class="section-title">
                  <span class="icon">&#127942;</span> 角色弧线
                </h3>
                <p class="section-text">{{ character.characterArc || '暂无描述' }}</p>
              </div>

              <div class="detail-row">
                <div class="detail-section half">
                  <h3 class="section-title">
                    <span class="icon">&#9889;</span> 技能特长
                  </h3>
                  <div class="tags-list" v-if="character.skills">
                    <el-tag
                      v-for="(skill, idx) in parseJsonArray(character.skills)"
                      :key="idx"
                      type="primary"
                    >
                      {{ skill }}
                    </el-tag>
                  </div>
                  <p v-else class="section-text">暂无</p>
                </div>

                <div class="detail-section half">
                  <h3 class="section-title">
                    <span class="icon">&#128546;</span> 弱点软肋
                  </h3>
                  <p class="section-text">{{ character.weaknesses || '暂无描述' }}</p>
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">
                  <span class="icon">&#127775;</span> 目标追求
                </h3>
                <div class="tags-list" v-if="character.goals">
                  <el-tag
                    v-for="(goal, idx) in parseJsonArray(character.goals)"
                    :key="idx"
                    type="success"
                  >
                    {{ goal }}
                  </el-tag>
                </div>
                <p v-else class="section-text">暂无</p>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="生平经历" name="events">
            <div class="events-content">
              <div class="events-timeline">
                <div
                  v-for="(event, index) in events"
                  :key="event.id"
                  class="timeline-item"
                >
                  <div class="timeline-marker" :class="getEventTypeClass(event.eventType)">
                    {{ index + 1 }}
                  </div>
                  <div class="timeline-content">
                    <div class="event-header">
                      <h4 class="event-name">{{ event.eventName }}</h4>
                      <el-tag size="small" :type="getEventTypeTagType(event.eventType)">
                        {{ event.eventType }}
                      </el-tag>
                    </div>
                    <p class="event-desc">{{ event.eventDesc }}</p>
                    <div class="event-meta">
                      <span class="event-age">年龄：{{ event.age }}岁</span>
                      <span class="event-importance">
                        重要度：
                        <el-rate v-model="event.importance" disabled size="small" />
                      </span>
                    </div>
                  </div>
                </div>
                <div v-if="events.length === 0" class="empty-events">
                  <p>暂无生平经历</p>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="事件时间线" name="timeline">
            <div class="timeline-chart" ref="timelineChartRef"></div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 六维度雷达图：只在非详情 tab 显示，固定右侧 -->
      <div
        v-if="character && dimensions && activeTab !== 'detail'"
        class="dimension-panel"
      >
        <div class="dimension-chart" ref="dimensionChartRef"></div>
      </div>

      <!-- 无角色时显示空状态 -->
      <el-empty v-if="!character && !loading" description="角色不存在" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCharacterStore } from '@/stores/character'
import { getCharacterEvents, getCharacterDimensions } from '@/api/character'
import * as echarts from 'echarts'

const route = useRoute()
const router = useRouter()
const characterStore = useCharacterStore()

const loading = ref(false)
const generating = ref(false)
const character = ref(null)
const events = ref([])
const dimensions = ref(null)
const activeTab = ref('detail')
const timelineChartRef = ref(null)
const dimensionChartRef = ref(null)
let timelineChart = null
let dimensionChart = null

function getGenderType(gender) {
  const map = { 0: 'danger', 1: '', 2: 'warning' }
  return map[gender] || 'info'
}

function getStatusType(status) {
  const map = { 0: 'info', 1: 'success', 2: 'warning' }
  return map[status] || 'info'
}

function getEventTypeClass(type) {
  const map = {
    '成长': 'growth',
    '转折': 'turning',
    '冲突': 'conflict',
    '成就': 'achievement',
    '悲剧': 'tragedy'
  }
  return map[type] || 'default'
}

function getEventTypeTagType(type) {
  const map = {
    '成长': 'primary',
    '转折': 'warning',
    '冲突': 'danger',
    '成就': 'success',
    '悲剧': 'info'
  }
  return map[type] || 'info'
}

function parseJsonArray(str) {
  if (!str) return []
  try {
    return JSON.parse(str)
  } catch {
    return []
  }
}

async function loadCharacter() {
  loading.value = true
  try {
    console.log('====== LOAD CHARACTER, route.params.id:', route.params.id, '======')
    character.value = await characterStore.fetchCharacter(route.params.id)
  } catch (error) {
    ElMessage.error('加载角色失败')
  } finally {
    loading.value = false
  }
}

async function loadEvents() {
  try {
    events.value = await getCharacterEvents(route.params.id)
    console.log('====== EVENTS LOADED:', events.value.length, '======')
    // 事件加载完成后，如果当前在时间线 tab，立即渲染图表
    if (activeTab.value === 'timeline' && events.value.length > 0) {
      nextTick(() => initTimelineChart())
    }
  } catch (error) {
    console.error('加载事件失败', error)
  }
}

async function loadDimensions() {
  try {
    dimensions.value = await getCharacterDimensions(route.params.id)
    console.log('====== DIMENSIONS LOADED:', dimensions.value, '======')
    if (activeTab.value !== 'detail') {
      nextTick(() => initDimensionChart())
    }
  } catch (error) {
    console.error('加载六维度失败', error)
  }
}

async function handleGenerate() {
  generating.value = true
  try {
    await characterStore.generate(route.params.id)
    ElMessage.success('生成成功')
    await loadCharacter()
  } catch (error) {
    ElMessage.error(error.message || '生成失败')
  } finally {
    generating.value = false
  }
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色"${character.value?.name}"吗？删除后可重新创建。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await characterStore.remove(route.params.id)
    ElMessage.success('删除成功')
    router.push('/library')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

function initTimelineChart() {
  if (!timelineChartRef.value || events.value.length === 0) {
    console.log('====== TIMELINE SKIP: no ref or no events, events:', events.value.length, '======')
    return
  }

  if (timelineChart) {
    timelineChart.dispose()
  }

  timelineChart = echarts.init(timelineChartRef.value)

  const categories = ['成长', '转折', '冲突', '成就', '悲剧']
  const categoryColors = {
    '成长': '#409eff',
    '转折': '#e6a23c',
    '冲突': '#f56c6c',
    '成就': '#67c23a',
    '悲剧': '#909399'
  }

  const typeIndexMap = {}
  categories.forEach((cat, i) => { typeIndexMap[cat] = i })

  const scatterData = events.value
    .filter(event => event.age != null)
    .map(event => {
      const baseY = typeIndexMap[event.eventType] ?? 2
      const sameTypeCount = events.value.filter(e => e.eventType === event.eventType && e.age <= event.age).length
      const yOffset = (sameTypeCount - 1) * 0.3
      return {
        name: event.eventName,
        value: [event.age, baseY + yOffset, event.eventName, event.eventType, event.importance],
        itemStyle: { color: categoryColors[event.eventType] || '#909399' }
      }
    })

  const maxAge = Math.max(character.value?.age || 100, ...events.value.map(e => e.age || 0))

  const option = {
    tooltip: {
      formatter: function(params) {
        const d = params.data
        return `<strong>${d.value[2]}</strong><br/>
                类型：${d.value[3]}<br/>
                年龄：${d.value[0]}岁<br/>
                重要度：${'★'.repeat(d.value[4])}`
      }
    },
    title: {
      text: '角色生命时间线（0-' + maxAge + '岁）',
      left: 'center',
      textStyle: { fontSize: 18 }
    },
    legend: {
      data: categories,
      top: 40,
      textStyle: { fontSize: 11 }
    },
    grid: {
      left: '60',
      right: '40',
      top: '90',
      bottom: '60'
    },
    xAxis: {
      type: 'value',
      name: '年龄',
      min: 0,
      max: maxAge + 10,
      axisLabel: { formatter: '{value}岁' }
    },
    yAxis: {
      type: 'category',
      data: categories,
      axisLine: { show: false },
      axisLabel: { fontSize: 12 }
    },
    series: [{
      type: 'scatter',
      data: scatterData,
      symbolSize: function(data) {
        return 14 + (data[4] || 3) * 3
      },
      label: {
        show: true,
        position: 'right',
        formatter: function(params) {
          return params.data.value[0] + '岁'
        },
        fontSize: 10,
        color: '#666'
      }
    }]
  }

  console.log('====== RENDERING TIMELINE with', scatterData.length, 'events ======')
  timelineChart.setOption(option)
}

function initDimensionChart() {
  if (!dimensionChartRef.value || !dimensions.value) {
    console.log('====== DIM CHART SKIP: no ref or no dimensions ======')
    return
  }

  if (dimensionChart) {
    dimensionChart.dispose()
  }

  dimensionChart = echarts.init(dimensionChartRef.value)

  const d = dimensions.value
  const option = {
    title: {
      text: '命运六维度',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 600 }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `<strong>${params.name}</strong><br/>
                指数：${params.value} / 100<br/>
                <span style="color:#888">${getDimensionDesc(params.name, params.value)}</span>`
      }
    },
    radar: {
      indicator: [
        { name: '理智', max: 100 },
        { name: '意志', max: 100 },
        { name: '情感', max: 100 },
        { name: '欲望', max: 100 },
        { name: '信念', max: 100 },
        { name: '韧性', max: 100 }
      ],
      radius: '65%',
      center: ['50%', '55%'],
      axisName: {
        color: '#333',
        fontSize: 13,
        fontWeight: 600
      },
      splitNumber: 4,
      axisTick: { show: false },
      axisLine: { show: true },
      splitLine: {
        lineStyle: { color: '#e4e7ed', width: 1 }
      },
      splitArea: {
        areaStyle: {
          color: ['#fafafa', '#f5f5f5', '#eeeeee', '#e8e8e8']
        }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          d.rationality || 50,
          d.willpower || 50,
          d.empathy || 50,
          d.ambition || 50,
          d.conviction || 50,
          d.resilience || 50
        ],
        name: '六维度',
        lineStyle: {
          color: '#667eea',
          width: 2
        },
        areaStyle: {
          color: 'rgba(102, 126, 234, 0.25)'
        },
        itemStyle: {
          color: '#667eea'
        },
        label: {
          show: true,
          formatter: '{c}',
          fontSize: 11,
          color: '#667eea'
        }
      }]
    }]
  }

  console.log('====== RENDERING DIMENSION CHART ======')
  dimensionChart.setOption(option)
}

function getDimensionDesc(name, value) {
  const descs = {
    '理智': value > 70 ? '冷静理性，善于分析' : value > 40 ? '思考与冲动并存' : '易感情用事',
    '意志': value > 70 ? '百折不挠，意志如钢' : value > 40 ? '普通意志力' : '轻易动摇放弃',
    '情感': value > 70 ? '重情重义，人情味浓' : value > 40 ? '情感能力一般' : '冷漠疏离',
    '欲望': value > 70 ? '野心勃勃，渴求权力' : value > 40 ? '有目标追求' : '淡泊无欲',
    '信念': value > 70 ? '坚守原则，毫不动摇' : value > 40 ? '有道德底线' : '缺乏立场原则',
    '韧性': value > 70 ? '历经苦难，浴火重生' : value > 40 ? '能承受压力' : '脆弱易碎'
  }
  return descs[name] || ''
}

// tab 切换时触发的图表渲染
watch(activeTab, (tab) => {
  if (tab === 'timeline' && events.value.length > 0) {
    nextTick(() => initTimelineChart())
  }
  if (tab !== 'detail' && dimensions.value) {
    nextTick(() => initDimensionChart())
  }
  // detail tab 时不渲染右侧面板（dimension-panel 通过 v-if 控制）
})

// events 数据变化时，如果是 timeline tab，重新渲染
watch(events, (evts) => {
  if (activeTab.value === 'timeline' && evts.length > 0) {
    nextTick(() => initTimelineChart())
  }
}, { deep: true })

// dimensions 数据变化时，如果是 events/timeline tab，重新渲染
watch(dimensions, (dims) => {
  if (dims && activeTab.value !== 'detail') {
    nextTick(() => initDimensionChart())
  }
}, { deep: true })

onMounted(async () => {
  await loadCharacter()
  // 角色加载完成后并行加载事件和维度
  await Promise.all([loadEvents(), loadDimensions()])
  // 所有数据加载完后，如果是 timeline tab，渲染时间线
  if (activeTab.value === 'timeline' && events.value.length > 0) {
    nextTick(() => initTimelineChart())
  }
  // 如果是 events/timeline tab，渲染雷达图
  if (activeTab.value !== 'detail' && dimensions.value) {
    nextTick(() => initDimensionChart())
  }
})
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 20px;
}

.back-btn {
  font-size: 16px;
  color: #666;
}

.back-btn:hover {
  color: #667eea;
}

/* 主内容区：两列 grid */
.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-rows: auto;
  gap: 20px;
  align-items: start;
}

/* 角色头部：占满整行 */
.character-header {
  grid-column: 1 / -1; /* 占据整行 */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  gap: 30px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #fff;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
  color: #fff;
}

.character-name {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 15px 0;
}

.basic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.basic-tags .el-tag {
  border: none;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  font-size: 14px;
  opacity: 0.9;
}

/* tabs 包装器：左侧列 */
.detail-tabs-wrapper {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.detail-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 600;
}

.detail-tabs :deep(.el-tabs__item.is-active) {
  color: #667eea;
}

.detail-tabs :deep(.el-tabs__active-bar) {
  background: #667eea;
}

.detail-content {
  padding: 10px;
}

.detail-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .icon {
  font-size: 22px;
}

.section-text {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin: 0;
}

.detail-row {
  display: flex;
  gap: 30px;
}

.detail-section.half {
  flex: 1;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.events-timeline {
  padding: 20px 0;
}

.timeline-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 40px;
  bottom: -30px;
  width: 2px;
  background: #e4e7ed;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  font-size: 16px;
}

.timeline-marker.growth { background: #409eff; }
.timeline-marker.turning { background: #e6a23c; }
.timeline-marker.conflict { background: #f56c6c; }
.timeline-marker.achievement { background: #67c23a; }
.timeline-marker.tragedy { background: #909399; }

.timeline-content {
  flex: 1;
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.event-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.event-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.event-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #999;
}

.event-importance {
  display: flex;
  align-items: center;
  gap: 5px;
}

.event-importance :deep(.el-rate) {
  display: inline-flex;
}

.empty-events {
  text-align: center;
  padding: 60px 0;
  color: #999;
}

.empty-generate-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: #f9fafb;
  border-radius: 12px;
  margin: 20px 0;
}

.empty-generate-card .empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-generate-card h3 {
  font-size: 22px;
  color: #333;
  margin: 0 0 12px 0;
}

.empty-generate-card p {
  font-size: 15px;
  color: #888;
  margin: 0 0 30px 0;
  max-width: 400px;
}

.timeline-chart {
  width: 100%;
  height: 400px;
}

/* 六维度雷达图：固定右侧面板 */
.dimension-panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 20px;
}

.dimension-chart {
  width: 100%;
  height: 340px;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .character-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .basic-tags {
    justify-content: center;
  }

  .detail-row {
    flex-direction: column;
  }

  .dimension-panel {
    position: static;
  }
}
</style>
