// config.js
const GHZconfigData = {

        tabs: ['D1', 'D2', 'D3', 'D4', 'D5'],
        activeTab: 0,
        // 这里需要替换成实际的图片路径
        d1Images: ['./工会战/d1-1.jpg', './工会战/d1-2.png'],
        d2Images: ['./工会战/d2-1.jpg','./工会战/d2-2.jpg','./工会战/d2-2a.jpg'],
        d3Images: ['./工会战/d3-1.png','./工会战/d3-2.png','./工会战/d3-3.png',],
        d4Images: ['./工会战/d4-1.jpg','./工会战/d4-2.png',],
        d5Images: ['./工会战/d5-1.jpg','./工会战/d5-1a.jpg','./工会战/d5-2.jpg','./工会战/d5-2a.jpg',],
        showBigImg: false,
        bigImgSrc: ''

}

// 导出配置数据
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = GHZconfigData;
} else {
    window.configData = GHZconfigData;
}