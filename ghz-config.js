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
    "./工会战/d1/0e0a1883152f71bb8f5f11a70e32fb31189151967.jpg",
    "./工会战/d1/73e0242a94b27338342d6f5e05e74e24189151967.jpg",
    "./工会战/d1/f23ff61c652f3a061d9d5199a6da0778189151967.jpg"
  ],
  "d2Images": [
    "./工会战/d2/9d41fab0cf6b8055c97f46e1764f02b8189151967.jpg",
    "./工会战/d2/af1c7ebd375ccc8693a0706463c1dca1189151967.jpg",
    "./工会战/d2/dcebf9f2619d724345c424ba2141ea36189151967.jpg"
  ],
  "d3Images": [
    "./工会战/d3/796fae6297a6e4322831aee07dd77cef189151967.jpg",
    "./工会战/d3/933b7ae7151f97c0adfaf4e052b0fcfb189151967.jpg",
    "./工会战/d3/99338d570a5fca06d64fae177e27e1b5189151967.jpg",
    "./工会战/d3/c1d0eec715c3948ed8f2e9b55ed1d480189151967.png",
    "./工会战/d3/c7c4ac233b27b816370c25cce5710165189151967.jpg"
  ],
  "d4Images": [
    "./工会战/d4/26d2b50086c544589fd07db980988a11189151967.jpg",
    "./工会战/d4/3ae905e2c5b8f9149ac604a9f9cb47a1189151967.jpg",
    "./工会战/d4/64a561a1ce2482d6239197b8c98dc7ca189151967.png",
    "./工会战/d4/884ee1849155d6689f03da8dd972c0aa189151967.jpg",
    "./工会战/d4/efefd30dff5d85e044360e135eb6844c189151967.jpg"
  ],
  "d5Images": [
    "./工会战/d5/3934f9400774625ddb62a4336db4e95e189151967.jpg",
    "./工会战/d5/7460b82779bced5db285a0eda169de15189151967.jpg",
    "./工会战/d5/8d0b5bd645a7d95341ec2deb37b3f25d189151967.png"
  ],
  "d6Images": [
    "./工会战/set刀/m1.png",
    "./工会战/set刀/m2.png",
    "./工会战/set刀/m3.png",
    "./工会战/set刀/md1.png",
    "./工会战/set刀/md2.png",
    "./工会战/set刀/md3.png",
    "./工会战/set刀/md4.png",
    "./工会战/set刀/md5.png",
    "./工会战/set刀/md6.png",
    "./工会战/set刀/md7.png",
    "./工会战/set刀/mxd1.png",
    "./工会战/set刀/mxd2.png",
    "./工会战/set刀/mxd3.png"
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