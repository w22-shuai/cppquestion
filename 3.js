const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtNe44rd6cJfQap3gZk73
+J+hlP0tZETdBLzdowKgecQ44gnd6usZsAyqOLyh6/7vhS/szXrtD0XgWWot3znR
j872u//d1zpdnwj+FVbk3eaTDcexv4s9LP9NxCGQleIDn6PPyirnEYB2IxGkrIKA
bpQ3pe18PbQAO/1f9/6al9ZftC3ZK3eetQN6nQg9SVD1QAkOx3304DqN4iJYjBzA
uhcTVVxJG8P2cr9Qcv1sPWNsS89ms/Z+gqLZm1jXIbL8Mz2TchaZHs7bxK1Gp4mX
utLSv+bFJnKsPkamd02eWixXP5OZIKgTh6v0ewBnabsoymwR2NF2Id5eHjXUf2/+
cwIDAQAB
-----END PUBLIC KEY-----
`;
async function encryptData(data) {
    try {
        // 1. 处理 PEM
        const pemContents = PUBLIC_KEY_PEM
            .replace(/-----[^-]+-----/g, "")
            .replace(/\s+/g, "");

        // 2. Base64 转 ArrayBuffer
        const binaryDerString = atob(pemContents);
        const binaryDer = new Uint8Array(binaryDerString.length);
        for (let i = 0; i < binaryDerString.length; i++) {
            binaryDer[i] = binaryDerString.charCodeAt(i);
        }

        // 3. 导入公钥
        const key = await window.crypto.subtle.importKey(
            "spki",
            binaryDer.buffer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["encrypt"]
        );

        // 4. 加密
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(data);
        const encryptedBuffer = await window.crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            key,
            encodedData
        );

        // 5. 转 Base64
        let binary = '';
        const bytes = new Uint8Array(encryptedBuffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);

    } catch (e) {
        console.error("加密失败:", e);
        alert("加密模块初始化失败，请使用现代浏览器");
        return null;
    }
}
const form = document.getElementById('loginForm');
const rawPassInput = document.getElementById('raw_password');
const encryptedInput = document.getElementById('encrypted_value');
const btn = document.getElementById('submitBtn');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // 阻止默认提交

        const password = rawPassInput.value;
        if (!password) return;

        btn.classList.add('loading'); // 显示加载动画
        btn.disabled = true;

        // 执行加密
        const encrypted = await encryptData(password);

        if (encrypted) {
            // 将加密后的乱码放入隐藏的 input
            encryptedInput.value = encrypted;
            // 清空原始密码框 (防止明文传输)
            rawPassInput.value = ""; // 可选：实际上提交后页面就刷新了，不清也没事，但为了安全

            // 此时再真正提交表单
            form.submit();
        } else {
            btn.classList.remove('loading');
            btn.disabled = false;
        }
    });
}