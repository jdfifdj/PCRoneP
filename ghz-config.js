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
    "./工会战/d1/竞技场.png"
  ],
  "d2Images": [
    "./工会战/d2/竞技场.png"
  ],
  "d3Images": [
    "./工会战/d3/竞技场.png"
  ],
  "d4Images": [
    "./工会战/d4/竞技场.png"
  ],
  "d5Images": [
    "./工会战/d5/竞技场.png"
  ],
  "d6Images": [
    "./工会战/set刀/竞技场.png"
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