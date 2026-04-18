<template>
  <div class="home-page">
    <div class="hero-section">
      <h1 class="title">小说角色模拟器</h1>
      <p class="subtitle">AI 驱动的智能小说角色生成工具</p>
      <div class="action-buttons">
        <el-button type="primary" size="large" @click="$router.push('/character/create')">
          <span class="btn-icon">+</span> 创建角色
        </el-button>
        <el-button size="large" @click="$router.push('/library')">
          <span class="btn-icon">&#128214;</span> 角色库
        </el-button>
        <el-button size="large" @click="$router.push('/dashboard')">
          <span class="btn-icon">&#128200;</span> 数据看板
        </el-button>
      </div>
    </div>

    <div class="features-section">
      <div class="feature-card">
        <div class="feature-icon">&#128100;</div>
        <h3>多维度角色塑造</h3>
        <p>从姓名到性格，从背景到外貌，全方位定义你的角色</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">&#129504;</div>
        <h3>AI 智能生成</h3>
        <p>基于小说类型和角色设定，AI 自动生成完整的角色档案</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">&#128197;</div>
        <h3>生平时间线</h3>
        <p>自动生成角色的重要事件和人生经历</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">&#127918;</div>
        <h3>多类型支持</h3>
        <p>玄幻、仙侠、言情、科幻、现代等多种小说类型</p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 80px;
}

.title {
  font-size: 56px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
}

.action-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  padding: 20px 40px;
  font-size: 18px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  transition: all 0.3s;
}

.action-buttons .el-button:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.action-buttons .el-button--primary {
  background: #fff;
  color: #667eea;
  border-color: #fff;
}

.action-buttons .el-button--primary:hover {
  background: #f0f0f0;
}

.btn-icon {
  margin-right: 8px;
  font-size: 20px;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.feature-card:hover {
  transform: translateY(-8px);
}

.feature-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 12px;
}

.feature-card p {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .title {
    font-size: 36px;
  }

  .subtitle {
    font-size: 18px;
  }

  .action-buttons .el-button {
    width: 100%;
    padding: 16px 24px;
    font-size: 16px;
  }
}
</style>
