<template>
  <div class="create-page">
    <div class="page-header">
      <el-button text @click="$router.push('/')" class="back-btn">
        <span>&larr;</span> 返回
      </el-button>
      <h1>创建角色</h1>
    </div>

    <div class="form-container">
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="character-form"
      >
        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span class="card-icon">&#128100;</span>
              <span>基础信息</span>
            </div>
          </template>

          <el-form-item label="角色姓名" prop="name">
            <div class="input-with-random">
              <el-input
                v-model="form.name"
                placeholder="输入角色姓名（2-20个字符）"
                maxlength="20"
                show-word-limit
              />
              <el-button @click="randomName" class="random-btn">🎲</el-button>
            </div>
          </el-form-item>

          <el-form-item label="性别" prop="gender">
            <div class="radio-group-wrapper">
              <el-radio-group v-model="form.gender">
                <el-radio :value="1">男</el-radio>
                <el-radio :value="0">女</el-radio>
                <el-radio :value="2">其他</el-radio>
              </el-radio-group>
              <el-button @click="randomGender" class="random-btn small">🎲</el-button>
            </div>
          </el-form-item>

          <el-form-item label="年龄" prop="age">
            <div class="input-with-random">
              <el-input-number
                v-model="form.age"
                :min="1"
                :max="999"
                placeholder="输入年龄"
                style="width: 100%"
              />
              <el-button @click="randomAge" class="random-btn">🎲</el-button>
            </div>
          </el-form-item>
        </el-card>

        <el-card class="form-card">
          <template #header>
            <div class="card-header">
              <span class="card-icon">&#127917;</span>
              <span>角色设定</span>
            </div>
          </template>

          <el-form-item label="小说类型" prop="novelTypeId">
            <div class="type-selector">
              <div class="input-with-random">
                <el-select
                  v-model="form.category"
                  placeholder="选择小说大类"
                  style="width: 48%"
                  @change="onCategoryChange"
                >
                  <el-option
                    v-for="cat in categories"
                    :key="cat"
                    :label="cat"
                    :value="cat"
                  />
                </el-select>
                <el-select
                  v-model="form.novelTypeId"
                  placeholder="选择具体类型"
                  style="width: 48%"
                  :disabled="!form.category"
                  @focus="loadTypesByCategory"
                  @change="onNovelTypeChange"
                >
                  <el-option
                    v-for="type in typeList"
                    :key="type.id"
                    :label="type.typeName"
                    :value="type.id"
                  />
                </el-select>
                <el-button @click="randomType" class="random-btn">🎲</el-button>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="性格特点" prop="personality">
            <div class="input-with-random">
              <el-select v-model="form.personality" placeholder="选择性格" style="width: 100%">
                <el-option label="正义" value="正义" />
                <el-option label="邪道" value="邪道" />
                <el-option label="中立" value="中立" />
                <el-option label="自私" value="自私" />
                <el-option label="善良" value="善良" />
              </el-select>
              <el-button @click="randomPersonality" class="random-btn">🎲</el-button>
            </div>
          </el-form-item>

          <el-form-item label="背景环境" prop="background">
            <div class="input-with-random">
              <el-select v-model="form.background" placeholder="选择背景" style="width: 100%" @change="onBackgroundChange">
                <el-option
                  v-for="bg in compatibleBackgrounds"
                  :key="bg"
                  :label="bg"
                  :value="bg"
                />
              </el-select>
              <el-button @click="randomBackground" class="random-btn">🎲</el-button>
            </div>
          </el-form-item>

          <el-form-item label="出生地" prop="birthplace">
            <div class="input-with-random">
              <el-select v-model="form.birthplace" placeholder="先选择背景" style="width: 100%">
                <el-option
                  v-for="place in birthplaces"
                  :key="place"
                  :label="place"
                  :value="place"
                />
              </el-select>
              <el-button @click="randomBirthplace" class="random-btn">🎲</el-button>
            </div>
          </el-form-item>

          <el-form-item label="样貌" prop="appearance">
            <div class="appearance-wrapper">
              <el-radio-group v-model="form.appearance" class="appearance-group">
                <el-radio value="丑陋">丑陋</el-radio>
                <el-radio value="平庸">平庸</el-radio>
                <el-radio value="大众脸">大众脸</el-radio>
                <el-radio value="美丽">美丽</el-radio>
                <el-radio value="超凡脱俗">超凡脱俗</el-radio>
              </el-radio-group>
              <el-button @click="randomAppearance" class="random-btn small">🎲</el-button>
            </div>
          </el-form-item>
        </el-card>

        <div class="form-actions">
          <el-button size="large" @click="resetForm">重置</el-button>
          <el-button
            type="primary"
            size="large"
            :loading="submitting"
            @click="handleSubmit"
          >
            一键生成角色
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCharacterStore } from '@/stores/character'
import { getCategories, getTypesByCategory, getBirthplaces, getCompatibleBackgrounds } from '@/api/novelType'

const router = useRouter()
const characterStore = useCharacterStore()

const formRef = ref(null)
const submitting = ref(false)
const categories = ref([])
const typeList = ref([])
const birthplaces = ref([])
const compatibleBackgrounds = ref([])

const form = reactive({
  name: '',
  gender: 1,
  age: 25,
  personality: '',
  background: '',
  birthplace: '',
  appearance: '平庸',
  category: '',
  novelTypeId: null
})

const rules = {
  name: [
    { required: true, message: '请输入角色姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  personality: [{ required: true, message: '请选择性格', trigger: 'change' }],
  background: [{ required: true, message: '请选择背景', trigger: 'change' }],
  birthplace: [{ required: true, message: '请选择出生地', trigger: 'change' }],
  appearance: [{ required: true, message: '请选择样貌', trigger: 'change' }]
}

// 随机数据池
const surnames = ['叶', '林', '萧', '苏', '白', '楚', '秦', '赵', '周', '吴', '郑', '王', '张', '刘', '陈', '杨', '黄', '李', '郭', '林', '慕容', '上官', '欧阳', '司马', '诸葛']
const maleNames = ['尘', '天', '风', '云', '霄', '寒', '墨', '轩', '羽', '辰', '渊', '枫', '擎', '泽', '凌', '然', '逸', '辰', '逸', '言']
const femaleNames = ['雪', '月', '灵', '瑶', '倩', '雅', '诗', '琳', '欣', '婷', '雅', '琴', '韵', '璇', '雨', '烟', '蝶', '霜', '霞', '云']
const neutralNames = ['无心', '逍遥', '醉月', '听风', '问柳', '流云', '惊鸿', '落霞', '孤鸿', '照晚', '凌波', '惊雪', '清羽', '寒烟', '碧落']

const backgrounds = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
const personalities = ['正义', '邪道', '中立', '自私', '善良']
const appearances = ['丑陋', '平庸', '大众脸', '美丽', '超凡脱俗']

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomName() {
  const gender = form.gender
  const surname = randomChoice(surnames)
  let name

  if (gender === 1) {
    name = surname + randomChoice(maleNames)
  } else if (gender === 0) {
    name = surname + randomChoice(femaleNames)
  } else {
    name = surname + randomChoice(neutralNames)
  }
  form.name = name
}

function randomGender() {
  form.gender = [1, 0, 2][Math.floor(Math.random() * 3)]
}

function randomAge() {
  form.age = Math.floor(Math.random() * 80) + 16
}

function randomPersonality() {
  form.personality = randomChoice(personalities)
}

function randomBackground() {
  form.background = randomChoice(backgrounds)
  onBackgroundChange()
}

function randomBirthplace() {
  if (birthplaces.value.length > 0) {
    form.birthplace = randomChoice(birthplaces.value)
  }
}

function randomAppearance() {
  form.appearance = randomChoice(appearances)
}

async function randomType() {
  if (categories.value.length > 0) {
    const cat = randomChoice(categories.value)
    form.category = cat
    await loadTypesByCategory()
    if (typeList.value.length > 0) {
      form.novelTypeId = randomChoice(typeList.value).id
      await loadCompatibleBackgrounds()
    }
  }
}

async function loadCategories() {
  try {
    categories.value = await getCategories()
    // 默认选中第一个
    if (categories.value.length > 0 && !form.category) {
      form.category = categories.value[0]
      await loadTypesByCategory()
    }
  } catch (error) {
    console.error('加载类别失败', error)
  }
}

async function onCategoryChange() {
  form.novelTypeId = null
  compatibleBackgrounds.value = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
  form.background = ''
  form.birthplace = ''
  await loadTypesByCategory()
}

async function onNovelTypeChange() {
  await loadCompatibleBackgrounds()
}

async function loadTypesByCategory() {
  if (!form.category) return
  try {
    typeList.value = await getTypesByCategory(form.category)
    // 如果只有一个选项，自动选中
    if (typeList.value.length === 1) {
      form.novelTypeId = typeList.value[0].id
      await loadCompatibleBackgrounds()
    }
  } catch (error) {
    console.error('加载类型失败', error)
  }
}

async function loadCompatibleBackgrounds() {
  if (!form.novelTypeId) {
    compatibleBackgrounds.value = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
    return
  }
  try {
    compatibleBackgrounds.value = await getCompatibleBackgrounds(form.novelTypeId)
    // 如果当前 background 不在兼容列表中，清空
    if (form.background && !compatibleBackgrounds.value.includes(form.background)) {
      form.background = ''
      form.birthplace = ''
    }
  } catch (error) {
    console.error('加载兼容背景失败', error)
    compatibleBackgrounds.value = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
  }
}

async function onBackgroundChange() {
  form.birthplace = ''
  if (form.background) {
    try {
      birthplaces.value = await getBirthplaces(form.background)
      if (birthplaces.value.length > 0) {
        form.birthplace = birthplaces.value[0]
      }
    } catch (error) {
      console.error('加载出生地失败', error)
    }
  }
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const result = await characterStore.create(form)
    console.log('====== CREATE RESULT ID:', result?.id, '======')
    ElMessage.success('角色创建成功')

    if (result && result.id) {
      console.log('====== NAVIGATING TO CHARACTER:', result.id, '======')
      ElMessage.info('开始生成角色详情，请稍候...')
      await characterStore.generate(result.id)
      ElMessage.success('角色生成完成')
      router.push(`/character/${result.id}`)
    }
  } catch (error) {
    ElMessage.error(error.message || '创建失败')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  formRef.value.resetFields()
  form.age = 25
  form.gender = 1
  form.appearance = '平庸'
  form.category = categories.value[0] || ''
  form.novelTypeId = null
  form.background = ''
  form.birthplace = ''
  typeList.value = []
  birthplaces.value = []
  compatibleBackgrounds.value = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
}

onMounted(() => {
  loadCategories()
  compatibleBackgrounds.value = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
})
</script>

<style scoped>
.create-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  max-width: 900px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  font-size: 18px;
  color: #666;
}

.back-btn:hover {
  color: #667eea;
}

.page-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.form-container {
  max-width: 900px;
  margin: 0 auto;
}

.character-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.form-card :deep(.el-card__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  padding: 16px 20px;
  border-bottom: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-icon {
  font-size: 24px;
}

.input-with-random {
  display: flex;
  gap: 10px;
  width: 100%;
}

.input-with-random > .el-input,
.input-with-random > .el-select,
.input-with-random > .el-input-number {
  flex: 1;
}

.random-btn {
  width: 48px;
  height: 40px;
  font-size: 18px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  flex-shrink: 0;
}

.random-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.random-btn.small {
  width: 40px;
  height: 32px;
  font-size: 14px;
}

.radio-group-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radio-group-wrapper .el-radio-group {
  display: flex;
  gap: 10px;
}

.type-selector .input-with-random {
  flex-wrap: wrap;
}

.type-selector .input-with-random > * {
  width: 48%;
}

@media (max-width: 600px) {
  .type-selector .input-with-random > * {
    width: 100%;
  }
}

.appearance-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.appearance-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.appearance-group :deep(.el-radio) {
  margin-right: 0;
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  transition: all 0.3s;
}

.appearance-group :deep(.el-radio.is-checked) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: #fff;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 20px 0;
}

.form-actions .el-button {
  padding: 16px 40px;
  font-size: 16px;
  border-radius: 10px;
}

.form-actions .el-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.form-actions .el-button--primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .create-page {
    padding: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .page-header h1 {
    font-size: 24px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
  }
}
</style>
