const { generateKeyPairSync } = require('crypto');

// 生成密钥对
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048, // 2048位安全性足够，且兼容性好
    publicKeyEncoding: {
        type: 'spki',      // 前端 WebCryptoAPI 需要 SPKI 格式的公钥
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',     // 后端 WebCryptoAPI 需要 PKCS#8 格式的私钥
        format: 'pem'
    }
});

console.log("========== 私钥 (复制到 login.astro 顶部) ==========");
console.log(privateKey);
console.log("\n");
console.log("========== 公钥 (复制到 login.astro 底部 <script> 中) ==========");
console.log(publicKey);