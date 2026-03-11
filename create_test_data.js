const http = require('http');

function makeRequest(path, data) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(data);
        const req = http.request({
            hostname: 'localhost',
            port: 8080,
            path: '/retail-chain/api' + path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

async function createData() {
    try {
        console.log("Creating shift 1...");
        let res1 = await makeRequest('/shifts', {
            storeId: 1, name: 'Morning Shift', startTime: '08:00:00', endTime: '16:00:00'
        });
        console.log("Result:", res1);

        console.log("Creating shift 2...");
        let res2 = await makeRequest('/shifts', {
            storeId: 1, name: 'Evening Shift', startTime: '16:00:00', endTime: '23:59:00'
        });
        console.log("Result:", res2);

        // create user in store 1? Do we have user creation endpoint?
        // Let's just create shift assignments if user 1 exists.
        console.log("Creating user...");
        let resUser = await makeRequest('/users', {
             username: "teststaff", fullName: "Test Staff", password: "123", storeId: 1, roles: ["ROLE_STAFF"]
        }).catch(e => console.log("User endpoint might not exist:", e.message));
        console.log("User Result:", resUser);

        console.log("Done");
    } catch(e) {
        console.error(e);
    }
}

createData();
