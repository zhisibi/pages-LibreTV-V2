#!/usr/bin/env node

// 密码同步脚本 - 自动更新所有文件中的密码
// 使用方法：
//   node password-sync.js [新密码]
//   或者从 config/master-config.js 自动读取

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 需要同步的文件配置
const FILES_CONFIG = [
    {
        path: 'js/auth-config.js',
        patterns: [
            {
                regex: /password:\s*['"`]([^'"`]+)['"`]/g,
                description: '认证配置默认密码'
            }
        ]
    },
    {
        path: 'config/config-loader.mjs',
        patterns: [
            {
                regex: /password:\s*['"`]([^'"`]+)['"`]/g,
                description: '配置加载器默认密码'
            }
        ]
    },
    {
        path: 'functions/proxy/[[path]].js',
        patterns: [
            {
                regex: /const\s+FIXED_PASSWORD\s*=\s*['"`]([^'"`]+)['"`]/g,
                description: 'EdgeOne 代理固定密码'
            }
        ]
    },
    {
        path: 'simple-proxy.js',
        patterns: [
            {
                regex: /password:\s*['"`]([^'"`]+)['"`]/g,
                description: '简化代理默认密码'
            }
        ]
    }
];

// 从主配置文件读取密码
function getPasswordFromMasterConfig() {
    try {
        const masterConfigPath = path.join(__dirname, 'config/master-config.js');
        const content = fs.readFileSync(masterConfigPath, 'utf8');
        
        // 匹配密码配置
        const match = content.match(/password:\s*['"`]([^'"`]+)['"`]/);
        if (match && match[1]) {
            return match[1];
        }
        
        throw new Error('未找到密码配置');
    } catch (error) {
        throw new Error(`读取主配置失败: ${error.message}`);
    }
}

// 计算密码哈希
function calculateHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// 更新单个文件
function updateFile(fileConfig, newPassword, oldPassword = 'admin123') {
    const filePath = path.join(__dirname, fileConfig.path);
    
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  文件不存在: ${fileConfig.path}`);
        return false;
    }
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let hasChanges = false;
        
        fileConfig.patterns.forEach(pattern => {
            const originalContent = content;
            content = content.replace(pattern.regex, (match, currentPassword) => {
                if (currentPassword === oldPassword || currentPassword !== newPassword) {
                    hasChanges = true;
                    console.log(`  📝 更新 ${pattern.description}: ${currentPassword} → ${newPassword}`);
                    return match.replace(currentPassword, newPassword);
                }
                return match;
            });
        });
        
        if (hasChanges) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ 已更新: ${fileConfig.path}`);
            return true;
        } else {
            console.log(`⏭️  无需更新: ${fileConfig.path}`);
            return false;
        }
        
    } catch (error) {
        console.error(`❌ 更新失败 ${fileConfig.path}: ${error.message}`);
        return false;
    }
}

// 创建部署配置文件
function createDeploymentConfig(password) {
    const hash = calculateHash(password);
    const deployConfig = `# LibreTV 部署配置说明
# 当前密码: ${password}
# 密码哈希: ${hash}

## 🌟 固定密码部署（推荐用于云端）
所有密码都已写入代码文件中，无需设置环境变量：
- config/master-config.js (前端配置)
- functions/proxy/[[path]].js (服务端代理)
- js/auth-config.js (认证配置)
- config/config-loader.mjs (配置加载器)

## 🔧 环境变量部署（可选）
如果你仍想使用环境变量，可以设置：
PASSWORD=${password}

部署平台设置：
- EdgeOne Pages: 控制台 → 环境变量 → PASSWORD
- Vercel: Settings → Environment Variables → PASSWORD  
- Netlify: Site settings → Environment variables → PASSWORD
`;
    
    fs.writeFileSync(path.join(__dirname, 'deployment-config.txt'), deployConfig, 'utf8');
    console.log('📄 已生成部署配置文件: deployment-config.txt');
}

// 主函数
function main() {
    console.log('🔧 LibreTV 密码同步工具');
    console.log('━'.repeat(50));
    
    try {
        // 获取新密码
        let newPassword;
        const args = process.argv.slice(2);
        
        if (args.length > 0) {
            newPassword = args[0];
            console.log(`📝 使用命令行参数密码: ${newPassword}`);
        } else {
            newPassword = getPasswordFromMasterConfig();
            console.log(`📖 从主配置读取密码: ${newPassword}`);
        }
        
        if (!newPassword) {
            throw new Error('无法获取密码');
        }
        
        // 计算哈希值
        const hash = calculateHash(newPassword);
        console.log(`🔐 密码哈希: ${hash}`);
        console.log('━'.repeat(50));
        
        // 更新所有文件
        let updatedCount = 0;
        FILES_CONFIG.forEach(fileConfig => {
            console.log(`🔄 处理文件: ${fileConfig.path}`);
            if (updateFile(fileConfig, newPassword)) {
                updatedCount++;
            }
        });
        
        // 创建部署配置
        createDeploymentConfig(newPassword);
        
        console.log('━'.repeat(50));
        console.log(`🎉 同步完成! 更新了 ${updatedCount} 个文件`);
        console.log('');
        console.log('📋 后续步骤:');
        console.log('1. 刷新浏览器页面');
        console.log('2. 使用新密码登录');
        console.log('3. 如果是云端部署，请设置对应的环境变量');
        console.log('4. 查看 deployment-config.txt 文件了解部署配置');
        
    } catch (error) {
        console.error('❌ 同步失败:', error.message);
        console.log('');
        console.log('💡 使用方法:');
        console.log('  node password-sync.js [新密码]');
        console.log('  或确保 config/master-config.js 中的密码正确设置');
        process.exit(1);
    }
}

// 直接运行主函数
main();

export {
    updateFile,
    getPasswordFromMasterConfig,
    calculateHash
};