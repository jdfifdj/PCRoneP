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
    "./工会战/d1/ev6.png"
  ],
  "d2Images": [
    "./工会战/d2/ev7.png",
    "./工会战/d2/ev8.png"
  ],
  "d3Images": [
    "./工会战/d3/ev10.png",
    "./工会战/d3/ev16.png",
    "./工会战/d3/ev9.png"
  ],
  "d4Images": [
    "./工会战/d4/ev11.png",
    "./工会战/d4/ev12.png",
    "./工会战/d4/ev17.png"
  ],
  "d5Images": [
    "./工会战/d5/ev13.png",
    "./工会战/d5/ev14.png",
    "./工会战/d5/ev15.png",
    "./工会战/d5/ev18.png"
  ],
  "d6Images": [
    "./工会战/set刀/ev1.png",
    "./工会战/set刀/ev2.png",
    "./工会战/set刀/ev3.png",
    "./工会战/set刀/ev4.png",
    "./工会战/set刀/ev5.png",
    "./工会战/set刀/hw1.png",
    "./工会战/set刀/hw10.png",
    "./工会战/set刀/hw2.png",
    "./工会战/set刀/hw3.png",
    "./工会战/set刀/hw4.png",
    "./工会战/set刀/hw5.png",
    "./工会战/set刀/hw6.png",
    "./工会战/set刀/hw7.png",
    "./工会战/set刀/hw8.png",
    "./工会战/set刀/hw9.png",
    "./工会战/set刀/mx1.png",
    "./工会战/set刀/mx2.png",
    "./工会战/set刀/mx3.png",
    "./工会战/set刀/mx4.png",
    "./工会战/set刀/wjm1.png",
    "./工会战/set刀/wjm2.png",
    "./工会战/set刀/wjm3.png"
  ],
  "showBigImg": false,
  "bigImgSrc": "",
  "videoLinks": [
    {
      "name": "汐汐的奇幻历险[手动-简单set刀]",
      "url": "https://space.bilibili.com/189151967",
      "cover": "./工会战/汐.jpg"
    },
    {
      "name": "玩具喵Official[自动-简单set刀]",
      "url": "https://space.bilibili.com/296496909?spm_id_from=333.788.upinfo.detail.click",
      "cover": "./工会战/wjm.jpg"
    },
    {
      "name": "墨夕困困想睡觉[自动-简单set刀]",
      "url": "hhttps://space.bilibili.com/33955898?spm_id_from=333.788.upinfo.detail.click",
      "cover": "./工会战/mx.jpg"
    },
    {
      "name": "玖璃梦_花舞组[自动-简单set刀]",
      "url": "https://space.bilibili.com/29627147/dynamic",
      "cover": "./工会战/花舞.jpg"
    },
    {
      "name": "这是一个好记的昵称[自动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV1dqhV6VE1e",
      "cover": "./工会战/nc.jpg"
    },
    {
      "name": "-Evexy-[自动&手动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV19Jh56yEog",
      "cover": "./工会战/evexy.jpg"
    },
    {
      "name": "浮城墟烟[简单set刀]",
      "url": "https://www.bilibili.com/video/BV1zN846SERo",
      "cover": "./工会战/浮.jpg"
    }
  ]
};
  
  // 导出配置数据
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      module.exports = GHZconfigData;
  } else {
      window.configData = GHZconfigData;
  }