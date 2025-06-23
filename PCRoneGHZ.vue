<template>
  <div class="container">
    <!-- 顶部标题 -->
    <div class="title">公主连结工会战set简单刀一图流</div>
    <!-- 导航栏 -->
    <div class="nav">
      <div 
        v-for="(item, index) in navList" 
        :key="index" 
        @click="activeTab = index" 
        :class="['tab', { active: activeTab === index }]"
      >
        {{ item }}
      </div>
    </div>
    <!-- 图片展示区域 -->
    <div class="content">
      <div 
        v-for="(img, imgIndex) in currentImgs" 
        :key="imgIndex" 
        class="img-item"
        @click="previewImg(img)"
      >
        <img :src="img" :alt="`${navList[activeTab]} 图片`">
      </div>
    </div>
    <!-- 放大预览弹窗 -->
    <div class="preview-mask" v-if="previewSrc">
      <div class="preview-content">
        <img :src="previewSrc" :alt="`预览`">
        <div class="close-btn" @click="previewSrc = ''">×</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PCRoneGHZ',
  data() {
    return {
      navList: ['d1', 'd2', 'd3', 'd4', 'd5'], // 导航项
      activeTab: 0, // 当前激活的导航索引
      previewSrc: '', // 放大预览的图片地址
      // 模拟各分组图片数据，实际可从接口或静态资源配置
      imgGroups: {
        d1: [
          require('./工会战/d1-1.jpg'),

        ],
        d2: [
        require('./工会战/d1-1.jpg'),
        ],
        d3: [
        require('./工会战/d1-1.jpg'),
        ],
        d4: [
        require('./工会战/d1-1.jpg'),
        ],
        d5: [
        require('./工会战/d1-1.jpg'),)
        ]
      }
    };
  },
  computed: {
    currentImgs() {
      return this.imgGroups[this.navList[this.activeTab]];
    }
  },
  methods: {
    previewImg(src) {
      this.previewSrc = src;
    }
  }
};
</script>

<style scoped>
.container {
  width: 90%;
  margin: 0 auto;
  padding: 20px 0;
}
.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  background-color: red;
  color: yellow;
  padding: 10px 0;
}
.nav {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
.tab {
  padding: 10px 20px;
  border: 1px solid #ccc;
  cursor: pointer;
  background-color: red;
  color: #fff;
}
.tab.active {
  background-color: blue;
}
.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.img-item {
  width: calc(25% - 20px);
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.img-item:hover {
  transform: scale(1.05);
}
.img-item img {
  width: 100%;
  height: auto;
  display: block;
}
.preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
.preview-content {
  position: relative;
  width: 80%;
  max-height: 80%;
}
.preview-content img {
  width: 100%;
  height: auto;
  display: block;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  background-color: #fff;
  color: #000;
  border-radius: 50%;
  cursor: pointer;
}
/* 响应式适配，可根据需要细化 */
@media (max-width: 768px) {
  .img-item {
    width: calc(50% - 20px);
  }
}
</style>