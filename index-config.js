// config.js
const INDEXconfigData = {
    sidebarCollapsed: false,
    currentTab: 'home',
    upGroups: {
        '攻略组': [
            {
                name: '玖璃梦_花舞组',
                avatar: 'https://i0.hdslb.com/bfs/face/52306d20f0dc72372757a0030d2e62cbd67cc7c0.jpg',
                desc: '工会战出刀攻略，逆天秀作者',
                url: 'https://space.bilibili.com/549739'
            },
            {
                name: '玩具喵Official',
                avatar: 'https://i0.hdslb.com/bfs/face/183f3548971f3dc293b9ded83335a86d4eb1906a.jpg',
                desc: '工会战出刀攻略，各种PVE攻略作者',
                url: 'https://space.bilibili.com/296496909'
            },
            {
                name: 'Columba-丘比',
                avatar: 'https://i0.hdslb.com/bfs/face/53fc809dc446dd8d002133baea8bf59be57252fc.jpg',
                desc: '各种PVE攻略，各种千里眼图，角色推荐作者',
                url: 'https://space.bilibili.com/25586360'
            },
            {
                name: '南条鸡腿子',
                avatar: 'https://i0.hdslb.com/bfs/face/95a9f4ba81fd142701ed7d905c399d8e6de80875.jpg',
                desc: '半月刊解析，角色推荐作者',
                url: 'https://space.bilibili.com/2574869'
            },
            {
                name: '汐汐的奇幻历险',
                avatar: 'https://i0.hdslb.com/bfs/face/05e68dccc1743656fc8997387b3dd70eb822b771.jpg',
                desc: '工会战简单set刀推荐作者',
                url: 'https://space.bilibili.com/189151967'
            },
        ],
        '萌新组': [
            {
                name: '灵焕-',
                avatar: 'https://i0.hdslb.com/bfs/face/b29886fe92790453bed9339b2a22761a65176edc.jpg',
                desc: '公主连结萌新攻略作者',
                url: 'https://space.bilibili.com/179659860'
            },

        ],
        '竞技场组': [
            {
                name: '老艾莉娜',
                avatar: 'https://i0.hdslb.com/bfs/face/67d82f9ef000237bc5aa397c6cb24f729868d181.jpg',
                desc: '双竞技场解析攻略作者',
                url: 'https://space.bilibili.com/53376733'
            },
        ]
    },
    articles: [
        {
            id: 1,
            title: '《公主连结Re:Dive》2025BW参展情报大公开',
            thumb: 'https://i0.hdslb.com/bfs/new_dyn/99a7e80078c7721cc89f1d00108a5a8f353840826.jpg',
            date: '2025-06-10',
            author: '官方'
        },
        
    ]

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = INDEXconfigData;
} else {
    window.configData = INDEXconfigData;
}