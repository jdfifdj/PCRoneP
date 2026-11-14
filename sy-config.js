// ghz-config.js
const GHZconfigData = {
  "tabs": [
    "前言",
    "玩具喵Official",
    "Columba-丘比",
    "台服千里眼作业"
  ],
  "activeTab": 0,
  "d1Images": [
    "./深域/前言/1.png",
    "./深域/前言/2.png",
    "./深域/前言/3.png"
  ],
  "d2Images": [
    "./深域/玩具喵/光1.png",
    "./深域/玩具喵/光2.png",
    "./深域/玩具喵/光3.png",
    "./深域/玩具喵/暗1.png",
    "./深域/玩具喵/水1.png",
    "./深域/玩具喵/水2.png",
    "./深域/玩具喵/水3.png",
    "./深域/玩具喵/火1.png",
    "./深域/玩具喵/火2.png",
    "./深域/玩具喵/火3.png",
    "./深域/玩具喵/风1.png",
    "./深域/玩具喵/风2.png"
  ],
  "d3Images": [],
  "d4Images": [
    "./深域/台服作业/304BED017616A8FABFCF665AB1E2E0E7.png",
    "./深域/台服作业/5101FFCE4509C28FFAC04B53A458A9A0.png",
    "./深域/台服作业/7AF6426021E48113CE69B32CF1F817DC.png",
    "./深域/台服作业/952313F7D796B149150A3E129EF177EB.png",
    "./深域/台服作业/9C925B7442671C8B8174CCC9A5F806C2.png"
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