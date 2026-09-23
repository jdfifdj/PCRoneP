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
    "./工会战/d1/1447a279e1c04321cf5c834cf5c025fb485486381.png",
    "./工会战/d1/1f937dce46ecd5348c2fd3e7838b9900485486381.png",
    "./工会战/d1/60282cc0a9895cd89b3304e8984bda6e485486381.png",
    "./工会战/d1/c6220ae6ff138b75a51e0753277f6595485486381.png",
    "./工会战/d1/QQ20260826-150043.png",
    "./工会战/d1/QQ20260826-150059.png"
  ],
  "d2Images": [
    "./工会战/d2/803283e2cca95aa93901303cf5c9ad62485486381.png",
    "./工会战/d2/QQ20260826-150110.png"
  ],
  "d3Images": [
    "./工会战/d3/ae51a7d96ab302e9393354e028ebb1f5485486381.png",
    "./工会战/d3/QQ20260826-150139.png"
  ],
  "d4Images": [
    "./工会战/d4/20e67f6bda9adbc782e06ff21e554402485486381.png",
    "./工会战/d4/QQ20260826-150155.png",
    "./工会战/d4/QQ20260826-150211.png"
  ],
  "d5Images": [
    "./工会战/d5/7e4ca964e5bccf89d4cca796fdc3272f485486381.png",
    "./工会战/d5/815eda5e95f132ce3accd982b5ec709a485486381.png",
    "./工会战/d5/QQ20260826-150221.png"
  ],
  "d6Images": [
    "./工会战/set刀/hw1.png",
    "./工会战/set刀/hw2.png",
    "./工会战/set刀/mx1.png",
    "./工会战/set刀/mx2.png",
    "./工会战/set刀/mx3.png",
    "./工会战/set刀/wjm1.png",
    "./工会战/set刀/wjm2.png",
    "./工会战/set刀/wjm3.png",
    "./工会战/set刀/wjm4.png"
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
      "url": "https://www.bilibili.com/video/BV1AMgF6PEHL",
      "cover": "./工会战/wjm.jpg"
    },
    {
      "name": "墨夕困困想睡觉[自动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV1D4hG6wENR",
      "cover": "./工会战/mx.jpg"
    },
    {
      "name": "玖璃梦_花舞组[自动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV18Ch36hEwd",
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