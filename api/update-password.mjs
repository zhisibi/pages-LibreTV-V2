// 密码更新API - 用于实时更新主配置文件
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

// 更新主配置文件
function updateMasterConfig(newPassword) {
    const masterConfigPath = path.join(__dirname, '../config/master-config.js');
    
    try {
        let content = fs.readFileSync(masterConfigPath, 'utf8');
        
        // 使用正则表达式替换密码
        const passwordRegex = /password:\s*['"`]([^'"`]+)['"`]/;
        const match = content.match(passwordRegex);
        
        if (match) {
            const oldPassword = match[1];
            content = content.replace(passwordRegex, `password: '${newPassword}'`);
            fs.writeFileSync(masterConfigPath, content, 'utf8');
            return { success: true, oldPassword, newPassword };
        } else {
            throw new Error('未找到密码配置行');
        }
    } catch (error) {
        throw new Error(`更新主配置失败: ${error.message}`);
    }
}

// 更新其他相关文件
function updateRelatedFiles(newPassword, oldPassword = 'admin123') {
    const filesToUpdate = [
        'js/auth-config.js',
        'config/config-loader.mjs', 
        'functions/proxy/[[path]].js'
    ];
    
    const results = [];
    
    filesToUpdate.forEach(relativePath => {
        try {
            const fullPath = path.join(__dirname, '..', relativePath);
            if (fs.existsSync(fullPath)) {
                let content = fs.readFileSync(fullPath, 'utf8');
                const originalContent = content;
                
                // 替换所有出现的旧密码
                content = content.replace(new RegExp(oldPassword, 'g'), newPassword);
                
                if (content !== originalContent) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    results.push({ file: relativePath, updated: true });
                } else {
                    results.push({ file: relativePath, updated: false, reason: '无需更新' });
                }
            } else {
                results.push({ file: relativePath, updated: false, reason: '文件不存在' });
            }
        } catch (error) {
            results.push({ file: relativePath, updated: false, reason: error.message });
        }
    });
    
    return results;
}

// 验证当前密码
function verifyCurrentPassword(inputPassword) {
    try {
        const masterConfigPath = path.join(__dirname, '../config/master-config.js');
        const content = fs.readFileSync(masterConfigPath, 'utf8');
        const match = content.match(/password:\s*['"`]([^'"`]+)['"`]/);
        
        if (match) {
            const currentPassword = match[1];
            
            // 支持明文密码和哈希值验证
            if (inputPassword === currentPassword) {
                return true;
            }
            
            // 如果输入的是哈希值，计算当前密码的哈希进行比较
            if (inputPassword.length === 64 && /^[a-f0-9]+$/i.test(inputPassword)) {
                const currentHash = calculateHash(currentPassword);
                return inputPassword.toLowerCase() === currentHash.toLowerCase();
            }
            
            // 如果输入的是明文，计算哈希比较
            const inputHash = calculateHash(inputPassword);
            const currentHash = calculateHash(currentPassword);
            return inputHash === currentHash;
        }
        
        return false;
    } catch (error) {
        console.error('验证密码失败:', error);
        return false;
    }
}

// API处理函数
export default async function handler(request) {
    // 处理CORS
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
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
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    try {
        const data = await request.json();
        const { currentPassword, newPassword, action } = data;
        
        if (action === 'verify') {
            // 验证当前密码
            const isValid = verifyCurrentPassword(currentPassword);
            return new Response(JSON.stringify({ 
                success: true, 
                valid: isValid 
            }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        if (action === 'update') {
            // 验证当前密码
            if (!verifyCurrentPassword(currentPassword)) {
                return new Response(JSON.stringify({ 
                    success: false, 
                    error: '当前密码验证失败' 
                }), {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }
            
            // 更新密码
            const masterResult = updateMasterConfig(newPassword);
            const relatedResults = updateRelatedFiles(newPassword, masterResult.oldPassword);
            
            const hash = calculateHash(newPassword);
            
            return new Response(JSON.stringify({ 
                success: true, 
                message: '密码更新成功',
                oldPassword: masterResult.oldPassword,
                newPassword: newPassword,
                newHash: hash,
                updatedFiles: relatedResults
            }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }
        
        return new Response(JSON.stringify({ 
            success: false, 
            error: '无效的操作' 
        }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
    } catch (error) {
        console.error('API错误:', error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: error.message 
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}