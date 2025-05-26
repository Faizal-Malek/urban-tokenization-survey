// Debug script to test authentication flow
const axios = require('axios');

const API_BASE = 'https://urban-tokenization-survey.onrender.com';

async function testAuthFlow() {
  console.log('🔍 Testing authentication flow...\n');
  
  try {
    // 1. Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log('');
    
    // 2. Test login (you'll need to replace with actual admin credentials)
    console.log('2. Testing login...');
    const loginResponse = await axios.post(`${API_BASE}/api/auth/login`, {
      username: 'admin', // Replace with actual username
      password: 'admin123' // Replace with actual password
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful');
    console.log('Token received:', loginResponse.data.token ? 'Yes' : 'No');
    console.log('Cookies:', loginResponse.headers['set-cookie'] || 'None');
    console.log('');
    
    const token = loginResponse.data.token;
    
    // 3. Test analytics endpoint with token
    console.log('3. Testing analytics endpoint...');
    const analyticsResponse = await axios.get(`${API_BASE}/api/questionnaire/analytics`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('✅ Analytics request successful');
    console.log('Data received:', analyticsResponse.data.status);
    console.log('Total responses:', analyticsResponse.data.totalResponses);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    }
  }
}

// Run the test
testAuthFlow();