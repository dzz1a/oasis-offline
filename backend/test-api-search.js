require('dotenv').config();
const http = require('http');

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function testSearchFlow() {
  console.log('=== Testing Search API ===\n');
  
  // Step 1: Login
  console.log('Step 1: Login with user 诙原...');
  const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const loginResult = await makeRequest(loginOptions, JSON.stringify({
    email: 'hanhanangovo@qq.com',
    password: '1234567'
  }));
  
  console.log('Login result:', JSON.stringify(loginResult, null, 2));
  
  if (!loginResult.data.token) {
    console.log('Login failed, trying with different password...');
    const loginResult2 = await makeRequest(loginOptions, JSON.stringify({
      email: 'hanhanangovo@qq.com',
      password: '123456'
    }));
    console.log('Login result 2:', JSON.stringify(loginResult2, null, 2));
    
    if (!loginResult2.data.token) {
      console.log('Login failed with both passwords');
      return;
    }
    var token = loginResult2.data.token;
  } else {
    var token = loginResult.data.token;
  }
  
  // Step 2: Search for user
  console.log('\nStep 2: Search for user "太爱着急了"...');
  const searchOptions = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/users/search?keyword=${encodeURIComponent('太爱着急了')}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  const searchResult = await makeRequest(searchOptions);
  console.log('Search result:', JSON.stringify(searchResult, null, 2));
  
  // Step 3: Search for user "诙"
  console.log('\nStep 3: Search for user "诙"...');
  const searchOptions2 = {
    hostname: 'localhost',
    port: 5000,
    path: `/api/users/search?keyword=${encodeURIComponent('诙')}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
  
  const searchResult2 = await makeRequest(searchOptions2);
  console.log('Search result 2:', JSON.stringify(searchResult2, null, 2));
}

testSearchFlow().catch(console.error);