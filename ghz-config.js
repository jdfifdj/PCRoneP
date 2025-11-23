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
    "./工会战/d1/8497687a1ba1110bce17b04d1c6b1517189151967.png",
    "./工会战/d1/a2d718d9632d01edc5b7d068b35f146c189151967.jpg"
  ],
  "d2Images": [
    "./工会战/d2/638116ab92c21bb7d7c9b8377cc0e418189151967.jpg"
  ],
  "d3Images": [
    "./工会战/d3/0ffc175c123493c6b892dbbb37f9ea33189151967.jpg",
    "./工会战/d3/8e02e228320b6b02a87bfe1294ee44e0189151967.jpg",
    "./工会战/d3/95a75884363ec52c6de26f8f88460bb1189151967.jpg",
    "./工会战/d3/9beb7fb0f63d631173eda912d0f2839b189151967.jpg",
    "./工会战/d3/a69562d0f65c9753b4017e8a287fc4f4189151967.jpg"
  ],
  "d4Images": [
    "./工会战/d4/60d439572a737dc532dca797b0e4f997189151967.jpg",
    "./工会战/d4/b8eb38efa7774d2018e29b1025c2340a189151967.jpg",
    "./工会战/d4/df471a4b16473e8b33687f7a68bf1b1e189151967.jpg"
  ],
  "d5Images": [
    "./工会战/d5/16f87a25933c35521bf2aa98f37a3c91189151967.jpg",
    "./工会战/d5/b80d4e5240c43b1c550756cdbae961e9189151967.jpg"
  ],
  "d6Images": [
    "./工会战/set刀/w-1.png",
    "./工会战/set刀/w-2.png",
    "./工会战/set刀/w-abc.png",
    "./工会战/set刀/w-d1.png",
    "./工会战/set刀/w-d2.png",
    "./工会战/set刀/w-d3.png",
    "./工会战/set刀/w-d4.png",
    "./工会战/set刀/w-d5.png",
    "./工会战/set刀/w-d6.png",
    "./工会战/set刀/w-d7.png"
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