const http = require('http');

// 首先登录获取token
const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const loginReq = http.request(loginOptions, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('登录响应:', data);
    const loginData = JSON.parse(data);
    
    if (loginData.success && loginData.token) {
      // 使用获取到的token调用徽章API
      const badgeOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/badges/user',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + loginData.token
        }
      };
      
      const badgeReq = http.request(badgeOptions, (badgeRes) => {
        let badgeData = '';
        
        badgeRes.on('data', (chunk) => {
          badgeData += chunk;
        });
        
        badgeRes.on('end', () => {
          console.log('\n徽章API响应:', badgeData);
        });
      });
      
      badgeReq.on('error', (e) => {
        console.error('徽章API请求错误:', e.message);
      });
      
      badgeReq.end();
    }
  });
});

loginReq.on('error', (e) => {
  console.error('登录请求错误:', e.message);
});

// 发送登录请求
loginReq.write(JSON.stringify({
  email: 'hanhanangovo@qq.com',
  password: '123456'
}));
loginReq.end();