
// Native fetch is available in Node.js 18+

async function testExtensionAPI() {
    console.log('Testing Extension API at http://localhost:3000/api/chat ...');

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: "Is my donation list uploaded?" })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ API Success!');
            console.log('Response from Assistant:', data.answer);
        } else {
            console.error('❌ API Error:', data.error || response.statusText);
            console.error('Full response:', data);
        }

    } catch (error) {
        console.error('❌ Network Error:', error.message);
        console.log('Make sure your Next.js server is running on port 3000!');
    }
}

testExtensionAPI();
