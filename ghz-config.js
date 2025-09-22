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
    "./工会战/d1/d1-2.jpg",
    "./工会战/d1/d1.jpg"
  ],
  "d2Images": [
    "./工会战/d2/d2-1.png",
    "./工会战/d2/d2-2.jpg",
    "./工会战/d2/d2-3.jpg",
    "./工会战/d2/d2-4.jpg",
    "./工会战/d2/d2-4a.jpg"
  ],
  "d3Images": [
    "./工会战/d3/d3-1.jpg",
    "./工会战/d3/d3-2.jpg",
    "./工会战/d3/d3-3.jpg"
  ],
  "d4Images": [
    "./工会战/d4/d4-1.jpg",
    "./工会战/d4/d4-2.jpg",
    "./工会战/d4/d4-3.jpg"
  ],
  "d5Images": [
    "./工会战/d5/d5-1.jpg",
    "./工会战/d5/d5-2.jpg",
    "./工会战/d5/d5-3.jpg"
  ],
  "d6Images": [
    "./工会战/set刀/猫abc.png",
    "./工会战/set刀/猫d1.png",
    "./工会战/set刀/猫d2.png",
    "./工会战/set刀/猫d3.png",
    "./工会战/set刀/猫d4.png",
    "./工会战/set刀/猫d5.png",
    "./工会战/set刀/猫d6.png",
    "./工会战/set刀/猫d7.png"
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