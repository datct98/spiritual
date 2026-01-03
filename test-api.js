// Test script để verify wooden fish API
const testEmail = 'test@example.com';
const API_BASE = 'http://localhost:8082/api/v1';

// Mock JWT token for testing - replace with real one from your app
const mockJWT = 'eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJzZWxmIiwic3ViIjoidGVzdEBleGFtcGxlLmNvbSIsImV4cCI6OTk5OTk5OTk5OSwiaWF0IjoxNzA0NzYyNDAwLCJzY29wZSI6IlJPTEVfVVNFUiJ9.test';

console.log('🧪 Starting Wooden Fish API Test...\n');
console.log(`Testing API at: ${API_BASE}`);
console.log(`Test email: ${testEmail}\n`);

async function testAPI() {
    try {
        // Test 1: Health check - can we reach the server?
        console.log('📍 Test 1: Server Health Check');
        try {
            const healthResponse = await fetch(`${API_BASE}/merit/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${mockJWT}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`   Status: ${healthResponse.status} ${healthResponse.statusText}`);

            if (healthResponse.status === 401 || healthResponse.status === 403) {
                console.log('   ⚠️  Authentication required - this is expected');
                console.log('   ℹ️  You need to use a real JWT token from the app\n');
                console.log('   How to get a real token:');
                console.log('   1. Open http://localhost:5173 in browser');
                console.log('   2. Login to the app');
                console.log('   3. Open browser console (F12)');
                console.log('   4. Run: localStorage.getItem("jwt_token")');
                console.log('   5. Copy the token and test manually\n');
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                console.log('   ❌ Cannot connect to server on port 8082');
                console.log('   Make sure woodenFish service is running\n');
                process.exit(1);
            }
            throw error;
        }

        console.log('✅ Server is responding\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('Next Steps for Manual Testing:\n');
        console.log('1. Open http://localhost:5173 in your browser');
        console.log('2. Login to the application');
        console.log('3. Open Browser Console (F12)');
        console.log('4. Click the wooden fish multiple times');
        console.log('5. Look for these logs in console:');
        console.log('   - "📡 Calling API: POST /merit/tap"');
        console.log('   - "✅ API Response: ..."');
        console.log('6. Reload the page (F5)');
        console.log('7. Verify points persist after reload\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testAPI();
