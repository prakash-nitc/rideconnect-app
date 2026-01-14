const http = require('http');

const data = JSON.stringify({
    name: "Node Test",
    email: `node_test_${Date.now()}@example.com`,
    password: "password123",
    securityQuestion: "What is your pet's name?",
    securityAnswer: "Fluffy"
});

const options = {
    hostname: 'localhost',
    port: 5001,
    path: '/api/auth/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log(`Sending request to http://localhost:5001/api/auth/signup`);

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
