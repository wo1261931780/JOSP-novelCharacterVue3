<template>
  <div class="library-page">
    <div class="page-header">
      <h1>角色库</h1>
      <el-button type="primary" @click="$router.push('/character/create')">
        + 创建角色
      </el-button>
    </div>

    <div class="filter-bar">
      <el-input
        v-model="filters.name"
        placeholder="搜索角色姓名"
        style="width: 200px"
        clearable
        @change="loadCharacters"
      />
      <el-select
        v-model="filters.gender"
        placeholder="性别"
        style="width: 120px"
        clearable
        @change="loadCharacters"
      >
        <el-option label="男" :value="1" />
        <el-option label="女" :value="0" />
        <el-option label="其他" :value="2" />
      </el-select>
      <el-select
        v-model="filters.personality"
        placeholder="性格"
        style="width: 120px"
        clearable
        @change="loadCharacters"
      >
        <el-option label="正义" value="正义" />
        <el-option label="邪道" value="邪道" />
        <el-option label="中立" value="中立" />
        <el-option label="自私" value="自私" />
        <el-option label="善良" value="善良" />
      </el-select>
      <el-select
        v-model="filters.background"
        placeholder="背景"
        style="width: 120px"
        clearable
        @change="loadCharacters"
      >
        <el-option label="现代" value="现代" />
        <el-option label="古代" value="古代" />
        <el-option label="架空古代" value="架空古代" />
        <el-option label="玄幻" value="玄幻" />
        <el-option label="仙侠" value="仙侠" />
        <el-option label="近代" value="近代" />
      </el-select>
      <el-select
        v-model="filters.status"
        placeholder="状态"
        style="width: 120px"
        clearable
        @change="loadCharacters"
      >
        <el-option label="草稿" :value="0" />
        <el-option label="已生成" :value="1" />
        <el-option label="已完善" :value="2" />
      </el-select>
    </div>

    <div v-loading="loading" class="character-grid">
      <div
        v-for="char in characters"
        :key="char.id"
        class="character-card"
        @click="$router.push(`/character/${char.id}`)"
      >
        <div class="card-header">
          <div class="avatar-placeholder">
            <span>{{ char.name?.charAt(0) }}</span>
          </div>
          <div class="card-info">
            <h3 class="card-name">{{ char.name }}</h3>
            <p class="card-meta">
              {{ char.genderText }} · {{ char.age }}岁
            </p>
          </div>
        </div>
        <div class="card-tags">
          <el-tag size="small" type="warning">{{ char.personality }}</el-tag>
          <el-tag size="small">{{ char.background }}</el-tag>
          <el-tag size="small" :type="getStatusType(char.status)">
            {{ char.statusText }}
          </el-tag>
        </div>
        <p class="card-desc">{{ char.backstory?.substring(0, 60) || '暂无描述' }}...</p>
        <div class="card-footer">
          <span class="card-date">{{ formatDate(char.createdAt) }}</span>
          <div class="card-actions">
            <el-button
              type="danger"
              size="small"
              text
              @click.stop="handleDelete(char)"
            >
              删除
            </el-button>
            <el-button
              type="primary"
              size="small"
              text
              @click.stop="$router.push(`/character/${char.id}`)"
            >
              查看详情
            </el-button>
          </div>
        </div>
      </div>

      <div v-if="characters.length === 0 && !loading" class="empty-state">
        <p>暂无角色</p>
        <el-button type="primary" @click="$router.push('/character/create')">
          创建第一个角色
        </el-button>
      </div>
    </div>

    <div class="pagination-wrapper" v-if="total > 0">
      <el-pagination
        v-model:current-page="pagination.page"
        :page-size="pagination.pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadCharacters"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCharacterStore } from '@/stores/character'

const characterStore = useCharacterStore()

const loading = ref(false)
const characters = ref([])
const total = ref(0)

const filters = reactive({
  name: '',
  gender: null,
  personality: '',
  background: '',
  status: null
})

const pagination = reactive({
  page: 1,
  pageSize: 12
})

function getStatusType(status) {
  const map = { 0: 'info', 1: 'success', 2: 'warning' }
  return map[status] || 'info'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

async function handleDelete(char) {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色"${char.name}"吗？删除后可在角色库中恢复。`,
      '删除确认',
      {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await characterStore.remove(char.id)
    ElMessage.success('删除成功')
    loadCharacters()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
    }
  }
}

async function loadCharacters() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null) {
        delete params[key]
      }
    })

    const result = await characterStore.fetchCharacters(params)
    characters.value = result.records || []
    total.value = result.total || 0
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCharacters()
})
</script>

<style scoped>
.library-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.filter-bar {
  max-width: 1200px;
  margin: 0 auto 24px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.character-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.character-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.character-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.avatar-placeholder {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #fff;
  flex-shrink: 0;
}

.card-info {
  flex: 1;
}

.card-name {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin: 0 0 6px 0;
}

.card-meta {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.card-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.card-actions {
  display: flex;
  gap: 4px;
}

.card-date {
  font-size: 13px;
  color: #999;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: #999;
}

.empty-state p {
  margin-bottom: 20px;
}

.pagination-wrapper {
  max-width: 1200px;
  margin: 40px auto 0;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .filter-bar {
    width: 100%;
  }

  .filter-bar > * {
    width: 100%;
  }

  .character-grid {
    grid-template-columns: 1fr;
  }
}
</style>
