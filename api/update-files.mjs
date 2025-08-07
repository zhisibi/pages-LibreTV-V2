// 在线文件更新API - 用于云端密码管理
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 计算SHA-256哈希
function calculateHash(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// 需要更新的文件配置
const FILES_TO_UPDATE = [
    {
        path: '../config/master-config.js',
        pattern: /password:\s*['"`]([^'"`]+)['"`]/,
        replacement: (newPassword) => `password: '${newPassword}'`,
        description: '主配置文件'
    },
    {
        path: '../functions/proxy/[[path]].js',
        pattern: /const\s+FIXED_PASSWORD\s*=\s*['"`]([^'"`]+)['"`]/,
        replacement: (newPassword) => `const FIXED_PASSWORD = '${newPassword}'`,
        description: 'EdgeOne 代理函数'
    },
    {
        path: '../js/auth-config.js',
        pattern: /password:\s*['"`]([^'"`]+)['"`]/,
        replacement: (newPassword) => `password: '${newPassword}'`,
        description: '前端认证配置'
    },
    {
        path: '../config/config-loader.mjs',
        pattern: /password:\s*['"`]([^'"`]+)['"`]/,
        replacement: (newPassword) => `password: '${newPassword}'`,
        description: '配置加载器'
    }
];

// 更新单个文件
function updateFile(fileConfig, newPassword) {
    const filePath = path.join(__dirname, fileConfig.path);
    
    try {
        if (!fs.existsSync(filePath)) {
            return { success: false, error: `文件不存在: ${fileConfig.path}` };
        }
        
        let content = fs.readFileSync(filePath, 'utf8');
        const match = content.match(fileConfig.pattern);
        
        if (!match) {
            return { success: false, error: `未找到密码配置: ${fileConfig.description}` };
        }
        
        const oldPassword = match[1];
        const newContent = content.replace(fileConfig.pattern, fileConfig.replacement(newPassword));
        
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        return { 
            success: true, 
            oldPassword: oldPassword,
            description: fileConfig.description,
            path: fileConfig.path
        };
    } catch (error) {
        return { success: false, error: `更新失败: ${error.message}` };
    }
}

// 验证当前密码
function verifyCurrentPassword(inputPassword) {
    try {
        const masterConfigPath = path.join(__dirname, '../config/master-config.js');
        const content = fs.readFileSync(masterConfigPath, 'utf8');
        const match = content.match(/password:\s*['"`]([^'"`]+)['"`]/);
        
        if (match) {
            const currentPassword = match[1];
            
            // 支持明文密码验证
            if (inputPassword === currentPassword) {
                return { valid: true, currentPassword: currentPassword };
            }
            
            // 支持哈希值验证
            if (inputPassword.length === 64 && /^[a-f0-9]+$/i.test(inputPassword)) {
                const currentHash = calculateHash(currentPassword);
                if (inputPassword.toLowerCase() === currentHash.toLowerCase()) {
                    return { valid: true, currentPassword: currentPassword };
                }
            }
            
            // 明文密码哈希验证
            const inputHash = calculateHash(inputPassword);
            const currentHash = calculateHash(currentPassword);
            if (inputHash === currentHash) {
                return { valid: true, currentPassword: currentPassword };
            }
        }
        
        return { valid: false, error: '密码验证失败' };
    } catch (error) {
        return { valid: false, error: `验证错误: ${error.message}` };
    }
}

// API处理函数
export default async function handler(request) {
    // CORS 头
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }
    
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ 
            success: false, 
            error: '仅支持POST请求' 
        }), {
            status: 405,
            headers: corsHeaders
        });
    }
    
    try {
        const data = await request.json();
        const { action, currentPassword, newPassword } = data;
        
        if (action === 'verify') {
            // 验证当前密码
            const result = verifyCurrentPassword(currentPassword);
            return new Response(JSON.stringify(result), {
                status: 200,
                headers: corsHeaders
            });
        }
        
        if (action === 'update') {
            // 验证当前密码
            const verification = verifyCurrentPassword(currentPassword);
            if (!verification.valid) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: verification.error || '当前密码验证失败' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            // 验证新密码
            if (!newPassword || newPassword.length < 6) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: '新密码长度至少6位' 
                }), {
                    status: 400,
                    headers: corsHeaders
                });
            }
            
            // 更新所有文件
            const updateResults = [];
            let successCount = 0;
            
            for (const fileConfig of FILES_TO_UPDATE) {
                const result = updateFile(fileConfig, newPassword);
                updateResults.push(result);
                if (result.success) {
                    successCount++;
                }
            }
            
            const newHash = calculateHash(newPassword);
            
            return new Response(JSON.stringify({ 
                success: true, 
                message: `密码更新成功！已更新 ${successCount} 个文件`,
                oldPassword: verification.currentPassword,
                newPassword: newPassword,
                newHash: newHash,
                updateResults: updateResults,
                timestamp: new Date().toISOString()
            }), {
                status: 200,
                headers: corsHeaders
            });
        }
        
        if (action === 'status') {
            // 获取当前密码状态
            try {
                const masterConfigPath = path.join(__dirname, '../config/master-config.js');
                const content = fs.readFileSync(masterConfigPath, 'utf8');
                const match = content.match(/password:\s*['"`]([^'"`]+)['"`]/);
                
                if (match) {
                    const currentPassword = match[1];
                    const hash = calculateHash(currentPassword);
                    
                    return new Response(JSON.stringify({ 
                        success: true,
                        currentPassword: currentPassword,
                        currentHash: hash,
                        filesCount: FILES_TO_UPDATE.length
                    }), {
                        status: 200,
                        headers: corsHeaders
                    });
                }
            } catch (error) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: `状态获取失败: ${error.message}` 
                }), {
                    status: 500,
                    headers: corsHeaders
                });
            }
        }
        
        return new Response(JSON.stringify({ 
            success: false, 
            error: '无效的操作类型' 
        }), {
            status: 400,
            headers: corsHeaders
        });
        
    } catch (error) {
        console.error('API错误:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: `服务器错误: ${error.message}` 
        }), {
            status: 500,
            headers: corsHeaders
        });
    }
}