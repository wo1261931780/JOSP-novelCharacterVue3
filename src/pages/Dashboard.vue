<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1>数据看板</h1>
      <el-button text @click="$router.push('/')">
        &larr; 返回首页
      </el-button>
    </div>

    <div v-loading="loading" class="dashboard-content">
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
            &#128100;
          </div>
          <div class="stat-info">
            <p class="stat-label">总角色数</p>
            <p class="stat-value">{{ stats.totalCharacters || 0 }}</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c)">
            &#128200;
          </div>
          <div class="stat-info">
            <p class="stat-label">本月新增</p>
            <p class="stat-value">{{ stats.monthNewCharacters || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="charts-grid">
        <el-card class="chart-card">
          <template #header>
            <span>小说类型分布</span>
          </template>
          <div ref="novelTypeChartRef" class="chart-container"></div>
        </el-card>

        <el-card class="chart-card">
          <template #header>
            <span>性格特点分布</span>
          </template>
          <div ref="personalityChartRef" class="chart-container"></div>
        </el-card>

        <el-card class="chart-card wide">
          <template #header>
            <span>月度新增趋势</span>
          </template>
          <div ref="trendChartRef" class="chart-container wide"></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getStatsOverview } from '@/api/stats'
import * as echarts from 'echarts'

const loading = ref(false)
const stats = ref({})
const novelTypeChartRef = ref(null)
const personalityChartRef = ref(null)
const trendChartRef = ref(null)

let novelTypeChart = null
let personalityChart = null
let trendChart = null

async function loadStats() {
  loading.value = true
  try {
    stats.value = await getStatsOverview()
    await initCharts()
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

async function initCharts() {
  await new Promise(resolve => setTimeout(resolve, 100))

  const novelTypeData = stats.value.byNovelType || {}
  const novelTypeDataFormatted = Object.entries(novelTypeData).map(([name, value]) => ({
    name,
    value
  }))

  if (novelTypeChartRef.value) {
    if (novelTypeChart) novelTypeChart.dispose()
    novelTypeChart = echarts.init(novelTypeChartRef.value)

    novelTypeChart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
      legend: { bottom: 10, left: 'center' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' }
        },
        data: novelTypeDataFormatted.length > 0 ? novelTypeDataFormatted : [{ name: '暂无数据', value: 1 }]
      }],
      color: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe']
    })
  }

  const personalityData = stats.value.byPersonality || {}
  const personalityDataFormatted = Object.entries(personalityData).map(([name, value]) => ({
    name,
    value
  }))

  if (personalityChartRef.value) {
    if (personalityChart) personalityChart.dispose()
    personalityChart = echarts.init(personalityChartRef.value)

    personalityChart.setOption({
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '3%', containLabel: true },
      xAxis: { type: 'category', data: Object.keys(personalityData) },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: personalityDataFormatted.map((d, i) => ({
          value: d.value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ])
          }
        })),
        barWidth: '50%',
        itemStyle: { borderRadius: [10, 10, 0, 0] }
      }]
    })
  }

  const trendData = stats.value.monthlyTrend || {}
  const trendKeys = Object.keys(trendData)
  const trendValues = Object.values(trendData)

  if (trendChartRef.value) {
    if (trendChart) trendChart.dispose()
    trendChart = echarts.init(trendChartRef.value)

    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: trendKeys
      },
      yAxis: { type: 'value' },
      series: [{
        type: 'line',
        smooth: true,
        data: trendValues,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 126, 234, 0.5)' },
            { offset: 1, color: 'rgba(118, 75, 162, 0.1)' }
          ])
        },
        lineStyle: { color: '#667eea', width: 3 },
        itemStyle: { color: '#667eea', borderWidth: 2 },
        symbol: 'circle',
        symbolSize: 8
      }]
    })
  }
}

function handleResize() {
  novelTypeChart?.resize()
  personalityChart?.resize()
  trendChart?.resize()
}

onMounted(() => {
  loadStats()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  novelTypeChart?.dispose()
  personalityChart?.dispose()
  trendChart?.dispose()
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.dashboard-content {
  max-width: 1200px;
  margin: 0 auto;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
}

.stat-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #999;
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.chart-card {
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.chart-card :deep(.el-card__header) {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: none;
  padding-bottom: 0;
}

.chart-card.wide {
  grid-column: 1 / -1;
}

.chart-container {
  width: 100%;
  height: 300px;
}

.chart-container.wide {
  height: 350px;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-card.wide {
    grid-column: 1;
  }
}
</style>
