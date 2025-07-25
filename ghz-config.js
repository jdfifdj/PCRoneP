// ghz-config.js
const GHZconfigData = {
    "tabs": [
      "D1",
      "D2",
      "D3",
      "D4",
      "D5",
      "简单分刀"
    ],
    "activeTab": 0,
    "d1Images": [
      "./工会战/d1-1.jpg",
      "./工会战/d1-2.jpg",
      "./工会战/d1-3.jpg"
    ],
    "d2Images": [
      "./工会战/d2-1.jpg",
      "./工会战/d2-2.jpg"
    ],
    "d3Images": [
      "./工会战/d3-1.jpg",
      "./工会战/d3-2.jpg"
    ],
    "d4Images": [
      "./工会战/d4-1.jpg",
      "./工会战/d4-2.jpg",
      "./工会战/d4-2a.jpg"
    ],
    "d5Images": [
      "./工会战/d5-1.png"
    ],
    "d6Images": [
      "./工会战/玩具喵-abc.png",
      "./工会战/玩具喵d1.png",
      "./工会战/玩具喵d2.png",
      "./工会战/玩具喵d3.png",
      "./工会战/玩具喵d4.png",
      "./工会战/玩具喵d5.png",
      "./工会战/玩具喵d6.png",
      "./工会战/花舞d1.png",
      "./工会战/花舞d2.png",
      "./工会战/花舞d3.png",
      "./工会战/花舞d4.png",
      "./工会战/花舞d6.png",
    ],
    "showBigImg": false,
    "bigImgSrc": ""
  };
  
  // 导出配置数据
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      module.exports = GHZconfigData;
  } else {
      window.configData = GHZconfigData;
  }