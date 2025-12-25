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
    "./工会战/d1/1888c099b3a1db41a8ea285fed1379a0189151967.jpg",
    "./工会战/d1/3d2d552b864b49529eac35513efd63e2189151967.jpg",
    "./工会战/d1/d1.jpg",
    "./工会战/d1/ea79d98e198a40901f9d8ea0343e41fc189151967.jpg"
  ],
  "d2Images": [
    "./工会战/d2/17c48ca71834a8e20b31747a0393c974189151967.jpg",
    "./工会战/d2/1a18c86d3d0998e4df73b3d23e7e8060189151967.jpg",
    "./工会战/d2/b7a7b5d735ef2d2c580ca0ea3a1ec773189151967.jpg"
  ],
  "d3Images": [
    "./工会战/d3/04077db71b845ef41e9bd568d2d8ad3b189151967.jpg",
    "./工会战/d3/22346368ce9132bd4424ec68f0092a88189151967.png",
    "./工会战/d3/9e007707a8df8b3b512c29db8516ff59189151967.jpg"
  ],
  "d4Images": [
    "./工会战/d4/0b73423fa848246697073d6b9db6fdc5189151967.jpg",
    "./工会战/d4/2d9866d0e941c25dd663badb5d2a716f189151967.jpg",
    "./工会战/d4/b0bb72fcd9970c1940fe109b9d948555189151967.jpg"
  ],
  "d5Images": [
    "./工会战/d5/3a0e697dcf3d3429fcece6a0af7befb6189151967.jpg",
    "./工会战/d5/82f2bb582ee4ae9b40b862c17d61b5fd189151967.jpg"
  ],
  "d6Images": [
    "./工会战/set刀/hd1.png",
    "./工会战/set刀/hd2.png",
    "./工会战/set刀/hd3.png",
    "./工会战/set刀/hd4.png",
    "./工会战/set刀/hd5.png",
    "./工会战/set刀/hd6.png",
    "./工会战/set刀/m1.png",
    "./工会战/set刀/md1.png",
    "./工会战/set刀/md2.png",
    "./工会战/set刀/w1.png",
    "./工会战/set刀/w2.png",
    "./工会战/set刀/w3.png",
    "./工会战/set刀/wd1.png",
    "./工会战/set刀/wd2.png",
    "./工会战/set刀/wd3.png",
    "./工会战/set刀/wd4.png",
    "./工会战/set刀/wd5.png",
    "./工会战/set刀/wd6.png",
    "./工会战/set刀/wd7.png"
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