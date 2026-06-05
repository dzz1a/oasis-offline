const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/badges/user',
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' // 需要有效的token才能访问
  }
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('状态码:', res.statusCode);
    console.log('响应数据:', data);
  });
});

req.on('error', (e) => {
  console.error('请求错误:', e.message);
});

req.end();