<template>
  <div class="stats-display card">
    <h2 class="stats-title">✨ Tu Hành ✨</h2>
    
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-icon">🙏</div>
        <div class="stat-info">
          <div class="stat-label">Công đức</div>
          <div class="stat-value merit">{{ stats.merit }}</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">🧘</div>
        <div class="stat-info">
          <div class="stat-label">Tâm tịnh</div>
          <div class="stat-value peace">{{ stats.peace }}</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">✨</div>
        <div class="stat-info">
          <div class="stat-label">Nghiệp tiêu</div>
          <div class="stat-value karma">{{ stats.karma }}</div>
        </div>
      </div>
      
      <div class="stat-item">
        <div class="stat-icon">🎯</div>
        <div class="stat-info">
          <div class="stat-label">Tổng số lần</div>
          <div class="stat-value total">{{ stats.totalClicks }}</div>
        </div>
      </div>
    </div>
    
    <div class="level-display">
      <div class="level-label">Cấp độ tu luyện</div>
      <div class="level-value">{{ level }}</div>
      <div class="level-subtitle">
        {{ getLevelName(level) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 1
  }
})

const getLevelName = (level) => {
  if (level >= 50) return '🌟 Đại La Hán'
  if (level >= 30) return '💫 A La Hán'
  if (level >= 20) return '🔮 Bồ Tát'
  if (level >= 10) return '⭐ Tu Sĩ'
  if (level >= 5) return '✨ Sơ Tổ'
  return '🌱 Phàm Nhân'
}
</script>

<style scoped>
.stats-display {
  width: 100%;
  max-width: 500px;
  margin: 2rem auto;
}

.stats-title {
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  color: var(--gold-dark);
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 10px rgba(244, 196, 48, 0.3);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  line-height: 1;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.2rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.stat-value.merit {
  color: var(--gold-dark);
}

.stat-value.peace {
  color: var(--purple-dark);
}

.stat-value.karma {
  color: #4fc3f7;
}

.stat-value.total {
  color: #f06292;
}

.level-display {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--gold-light), var(--purple-light));
  border-radius: 15px;
  margin-top: 1rem;
}

.level-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.level-value {
  font-size: 3rem;
  font-weight: 900;
  color: var(--gold-dark);
  line-height: 1;
  text-shadow: 0 2px 10px rgba(244, 196, 48, 0.3);
}

.level-subtitle {
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 0.5rem;
  color: var(--purple-dark);
}

@media (max-width: 768px) {
  .stats-grid {
    gap: 0.7rem;
  }
  
  .stat-item {
    padding: 0.7rem;
  }
  
  .stat-icon {
    font-size: 1.5rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .level-value {
    font-size: 2.5rem;
  }
}
</style>
