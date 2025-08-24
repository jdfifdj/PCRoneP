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
    "./工会战/d1/d1-1.jpg",
    "./工会战/d1/d1-2.jpg",
    "./工会战/d1/d1-3.jpg"
  ],
  "d2Images": [
    "./工会战/d2/d2-1.jpg",
    "./工会战/d2/d2-2.jpg",
    "./工会战/d2/d2-3.jpg",
    "./工会战/d2/d2-4.jpg"
  ],
  "d3Images": [
    "./工会战/d3/d3-1.jpg",
    "./工会战/d3/d3-1a.jpg",
    "./工会战/d3/d3-2.jpg",
    "./工会战/d3/d3-3.jpg",
    "./工会战/d3/d3-3a.jpg"
  ],
  "d4Images": [
    "./工会战/d4/d4-1.jpg",
    "./工会战/d4/d4-2.jpg",
    "./工会战/d4/d4-3.jpg"
  ],
  "d5Images": [
    "./工会战/d5/d5-1.jpg",
    "./工会战/d5/d5-2.jpg",
    "./工会战/d5/d5-3.jpg",
    "./工会战/d5/d5-4.jpg"
  ],
  "d6Images": [
    "./工会战/set刀/1.png",
    "./工会战/set刀/2.png",
    "./工会战/set刀/69752EACF1CBE43623B3B0FF71DFC065.jpg",
    "./工会战/set刀/78D9C0D5FAC6697717FC509FCA95AA02.jpg",
    "./工会战/set刀/A7995DD3567610B9E93819F6F0D1BF27.jpg",
    "./工会战/set刀/B134391126AFF3A86CE960EAD6DF39BB.jpg",
    "./工会战/set刀/E8191FD422523BEB63966DA403757086.jpg"
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