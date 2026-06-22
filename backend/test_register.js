
// Using native http module to make request

import http from 'http';

const data = JSON.stringify({
    name: "Test User",
    email: "testuser" + Math.floor(1000 + Math.random() * 9000) + "@example.com",
    password: "password123",
    classLevel: "class-10",
    goal: "engineering",
    subjects: ["Physics", "Chemistry"],
    examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/v1/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (e) => {
    console.error(e);
});

req.write(data);
req.end();
