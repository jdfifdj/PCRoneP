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
    "./工会战/d1/34bbb4f2e8abee4840025c0b27b163a2189151967.png",
    "./工会战/d1/bec33aeb3b34318402c928f97fce6b31189151967.png"
  ],
  "d2Images": [
    "./工会战/d2/4d9878903160c9ecfa8e2a19d6d821fc189151967.png",
    "./工会战/d2/83451003c665e0e1b48979bfa9b9bcba189151967.png",
    "./工会战/d2/d9779009419cfec94daa1a95d0a86b0e189151967.png"
  ],
  "d3Images": [
    "./工会战/d3/468d3c03a4dc0a3adb3bddb8220ff55b189151967.png",
    "./工会战/d3/bd571b2032a48f9693c82f52089b6c98189151967.png",
    "./工会战/d3/e9bd2bd40d3eb53a3b93c27451e38b62189151967.png",
    "./工会战/d3/f3ad9e173940741b362b3ec7f92f0310189151967.png"
  ],
  "d4Images": [
    "./工会战/d4/5e70cd296486db9d18a877e0b6c83326189151967.png",
    "./工会战/d4/ae8a8c2a999338cdcbc65427ec2f4f78189151967.png",
    "./工会战/d4/b014b2a9e0274c5334f57472e3b87adb189151967.png",
    "./工会战/d4/b8d893875e547412f73bc4f126db856d189151967.png"
  ],
  "d5Images": [
    "./工会战/d5/65731759fd3c094ac4cb55a78c8503a6189151967.png"
  ],
  "d6Images": [
    "./工会战/set刀/ewd1.png",
    "./工会战/set刀/ewd2.png",
    "./工会战/set刀/ewd3.png",
    "./工会战/set刀/ewd4.png",
    "./工会战/set刀/ewd5.png",
    "./工会战/set刀/hw1.png",
    "./工会战/set刀/hw2.png",
    "./工会战/set刀/hw3.png",
    "./工会战/set刀/hw4.png",
    "./工会战/set刀/hw5.png",
    "./工会战/set刀/hw6.png",
    "./工会战/set刀/hw7.png",
    "./工会战/set刀/mx1.png",
    "./工会战/set刀/mx2.png",
    "./工会战/set刀/mx3.png",
    "./工会战/set刀/nc1.png",
    "./工会战/set刀/nc2.png",
    "./工会战/set刀/nc3.png",
    "./工会战/set刀/nc4.png",
    "./工会战/set刀/nc5.png",
    "./工会战/set刀/nc6.png",
    "./工会战/set刀/nc7.png",
    "./工会战/set刀/nc8.png",
    "./工会战/set刀/nc9.png",
    "./工会战/set刀/wjm1.png",
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
      "url": "https://www.bilibili.com/video/BV1MeosBxE3L/",
      "cover": "./工会战/汐.jpg"
    },
    {
      "name": "玩具喵Official[自动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV1VHD9BvEED",
      "cover": "./工会战/wjm.jpg"
    },
    {
      "name": "墨夕困困想睡觉[自动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV1L6o5BrE5g",
      "cover": "./工会战/mx.jpg"
    },
    {
      "name": "玖璃梦_花舞组[自动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV1HGoMBiEop",
      "cover": "./工会战/花舞.jpg"
    },
    {
      "name": "这是一个好记的昵称[自动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV17LdXBEEc7",
      "cover": "./工会战/nc.jpg"
    },
    {
      "name": "-Evexy-[自动&手动-简单set刀]",
      "url": "https://www.bilibili.com/video/BV1pFosBUEDj",
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