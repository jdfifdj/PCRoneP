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
    "./工会战/d1/a75332e42b416520f2a8e937ddd6f4c2189151967.png",
    "./工会战/d1/f069078a3115fd3c0c8ef0a55a2436e7189151967.png",
    "./工会战/d1/f7678dc7b931e0bb425a579d31162d79189151967.png"
  ],
  "d2Images": [
    "./工会战/d2/34a2879c2c8e4af7825795737af57450189151967.png",
    "./工会战/d2/373b4790597a35a95398622b6a35507e189151967.png",
    "./工会战/d2/45ecced827ccd60db69246a6f5c194a2189151967.png",
    "./工会战/d2/4a79adad5116167e3ad08334485d9d36189151967.png",
    "./工会战/d2/a3639f592d7bd5620e8db9ccac5a24ac189151967.png",
    "./工会战/d2/a48e16b2797aee90be42788a694da3a4189151967.png",
    "./工会战/d2/bfe7274a43f65cd2788ff2f17169c160189151967.png"
  ],
  "d3Images": [
    "./工会战/d3/2164e87809c75de4c4d094bd76e68d63189151967.png",
    "./工会战/d3/9550968d8cfa08ee601de7ee4e88de85189151967.png",
    "./工会战/d3/e1012f559c2b369b8900fa5831f0bb28189151967.png"
  ],
  "d4Images": [
    "./工会战/d4/7f3bbe0011a527e015ad846e4025880a189151967.png",
    "./工会战/d4/97496ed90b65e764924c46460a7ef853189151967.png",
    "./工会战/d4/a7a5459374daa84c32452bcdc4c9a6ce189151967.png",
    "./工会战/d4/b0c0640f91a3b10482ca29d2180c1e13189151967.png",
    "./工会战/d4/b48df5c3e322f9db26adb815ee994708189151967.png"
  ],
  "d5Images": [
    "./工会战/d5/8e64993a6c49b25ba871d10e9030e34a189151967.png",
    "./工会战/d5/9f53d7aee452eb1962d50589103a2fd6189151967.png",
    "./工会战/d5/a9d986e342eefeb14776d9d9300003c9189151967.png",
    "./工会战/d5/af54b9031c623738f2e13eaf8129af24189151967.png",
    "./工会战/d5/feaa2ecc316bc3996bfa42d1199b90e5189151967.png"
  ],
  "d6Images": [
    "./工会战/set刀/ed1.png",
    "./工会战/set刀/ed2.png",
    "./工会战/set刀/ed3.png",
    "./工会战/set刀/ed4.png",
    "./工会战/set刀/ed5.png",
    "./工会战/set刀/hw1.png",
    "./工会战/set刀/hw2.png",
    "./工会战/set刀/hw3.png",
    "./工会战/set刀/hw4.png",
    "./工会战/set刀/hw5.png",
    "./工会战/set刀/hw6.png",
    "./工会战/set刀/hw7.png",
    "./工会战/set刀/hw8.png",
    "./工会战/set刀/mx1.png",
    "./工会战/set刀/mx2.png",
    "./工会战/set刀/mx3.png",
    "./工会战/set刀/wjm1.png",
    "./工会战/set刀/wjm10.png",
    "./工会战/set刀/wjm2.png",
    "./工会战/set刀/wjm3.png",
    "./工会战/set刀/wjm4.png",
    "./工会战/set刀/wjm5.png",
    "./工会战/set刀/wjm6.png",
    "./工会战/set刀/wjm7.png",
    "./工会战/set刀/wjm8.png",
    "./工会战/set刀/wjm9.png"
  ],
  "showBigImg": false,
  "bigImgSrc": "",
  "videoLinks": [
    {
      "name": "汐汐的奇幻历险[手动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV1kvGi6MELq/",
      "cover": "./工会战/汐.jpg"
    },
    {
      "name": "玩具喵Official[自动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV1rDLM6NEEX",
      "cover": "./工会战/wjm.jpg"
    },
    {
      "name": "墨夕困困想睡觉[自动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV1wjGx6rEWc",
      "cover": "./工会战/mx.jpg"
    },
    {
      "name": "玖璃梦_花舞组[自动-简单set刀]",
      "url": "https://www.bilibili.com/opus/1202841673288122391",
      "cover": "./工会战/花舞.jpg"
    },
    {
      "name": "这是一个好记的昵称[自动-简单set刀]",
      "url": "",
      "cover": "./工会战/nc.jpg"
    },
    {
      "name": "-Evexy-[自动&手动-简单set刀]",
      "url": "https://www.bilibili.com/opus/1203266046150049795?spm_id_from=333.1387.0.0",
      "cover": "./工会战/evexy.jpg"
    }
  ]
};
  
  // 导出配置数据
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
      module.exports = GHZconfigData;
  } else {
      window.configData = GHZconfigData;
  }