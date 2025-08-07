// 全局密码配置文件 - 所有密码的唯一来源
// 🔥 只需要修改这里的密码，所有文件自动同步！

// 导出全局密码配置
const GLOBAL_PASSWORD_CONFIG = {
    // 🔐 在这里设置你的自定义密码
    password: 'admin123',  // 🔥 修改这里即可更改所有地方的密码
    
    // 自动计算的哈希值（不需要手动修改）
    passwordHash: null,
    
    // 配置信息
    lastUpdated: new Date().toISOString(),
    version: '1.0.0'
};

// 计算密码哈希的函数
async function calculatePasswordHash() {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        // 浏览器环境
        const encoder = new TextEncoder();
        const data = encoder.encode(GLOBAL_PASSWORD_CONFIG.password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else if (typeof require !== 'undefined') {
        // Node.js 环境
        const crypto = require('crypto');
        return crypto.createHash('sha256').update(GLOBAL_PASSWORD_CONFIG.password).digest('hex');
    }
    return null;
}

// 初始化密码哈希
if (typeof window !== 'undefined') {
    // 浏览器环境
    calculatePasswordHash().then(hash => {
        GLOBAL_PASSWORD_CONFIG.passwordHash = hash;
        console.log('✅ 全局密码配置已加载:', GLOBAL_PASSWORD_CONFIG.password);
    });
} else {
    // Node.js 环境
    GLOBAL_PASSWORD_CONFIG.passwordHash = calculatePasswordHash();
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    // Node.js 导出
    module.exports = GLOBAL_PASSWORD_CONFIG;
} else if (typeof window !== 'undefined') {
    // 浏览器环境
    window.GLOBAL_PASSWORD_CONFIG = GLOBAL_PASSWORD_CONFIG;
    window.getGlobalPassword = () => GLOBAL_PASSWORD_CONFIG.password;
    window.getGlobalPasswordHash = () => GLOBAL_PASSWORD_CONFIG.passwordHash;
}

console.log('🔐 全局密码配置已加载');