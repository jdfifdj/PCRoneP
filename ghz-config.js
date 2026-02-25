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
    "./工会战/d1/2d36ce6e91d46844f7d610ba393556b1189151967.png",
    "./工会战/d1/3ac0fbdf92715236023a4846e09953a1189151967.jpg",
    "./工会战/d1/3f52ea822abc8e607cda5bc9d05be235189151967.jpg",
    "./工会战/d1/8d9708e94815a24739477d63ea6f0839189151967.png",
    "./工会战/d1/f454f0b30b84cf5562249d4a6d3f1124189151967.png"
  ],
  "d2Images": [
    "./工会战/d2/4f038e820c07cd7f5b08de634a975fd0189151967.jpg"
  ],
  "d3Images": [
    "./工会战/d3/61edb410b00e7c537e3cc2dd970846fc189151967.png",
    "./工会战/d3/893fe6421053293145e0bc93abb8d7ab189151967.png"
  ],
  "d4Images": [
    "./工会战/d4/dee8497d9dccd10d6d0de9b65ed9793e189151967.jpg"
  ],
  "d5Images": [
    "./工会战/d5/8b4c2251fed8c17efd7a61eeeee6b807189151967.png"
  ],
  "d6Images": [
    "./工会战/set刀/hw1.png",
    "./工会战/set刀/hwd11.png",
    "./工会战/set刀/hwd12.png",
    "./工会战/set刀/hwd13.png",
    "./工会战/set刀/hwd14.png",
    "./工会战/set刀/hwd16.png",
    "./工会战/set刀/m1.png",
    "./工会战/set刀/m2.png",
    "./工会战/set刀/m3.png",
    "./工会战/set刀/md1.png",
    "./工会战/set刀/md10.png",
    "./工会战/set刀/md11.png",
    "./工会战/set刀/md2.png",
    "./工会战/set刀/md3.png",
    "./工会战/set刀/md4.png",
    "./工会战/set刀/md5.png",
    "./工会战/set刀/md6.png",
    "./工会战/set刀/md7.png",
    "./工会战/set刀/md8.png",
    "./工会战/set刀/md9.png",
    "./工会战/set刀/mx.png",
    "./工会战/set刀/mx1.png",
    "./工会战/set刀/mx2.png"
  ],
  "showBigImg": false,
  "bigImgSrc": "",
  "videoLinks": [
    { "name": "汐汐的奇幻历险[手动-简单set刀]", "url": "https://www.bilibili.com/video/BV1utZ6BzEwc/", "cover": "./工会战/汐.jpg" },
    { "name": "玩具喵Official[自动-简单set刀]", "url": "https://www.bilibili.com/video/BV1mYcbzjEsb/", "cover": "./工会战/wjm.jpg" },
    { "name": "墨夕困困想睡觉[自动-简单set刀]", "url": "https://www.bilibili.com/video/BV1mVfPBKE6m/", "cover": "./工会战/mx.jpg" },
    { "name": "玖璃梦_花舞组[自动-简单set刀]", "url": "https://www.bilibili.com/video/BV1vafwBLEDf/", "cover": "./工会战/花舞.jpg" }
  ]
};
  
  // 导出配置数据
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      module.exports = GHZconfigData;
  } else {
      window.configData = GHZconfigData;
  }