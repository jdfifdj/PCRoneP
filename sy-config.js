// ghz-config.js
const GHZconfigData = {
  "tabs": [
    "前言",
    "玩具喵Official",
    "Columba-丘比"
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
  "showBigImg": false,
  "bigImgSrc": ""
};
  
  // 导出配置数据
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      module.exports = GHZconfigData;
  } else {
      window.configData = GHZconfigData;
  }