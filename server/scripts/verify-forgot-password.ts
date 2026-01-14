const API_URL = 'http://127.0.0.1:5000/api';
const TIMESTAMP = Date.now();
const EMAIL = `test_${TIMESTAMP}@example.com`;
const PASSWORD = 'password123';
const NEW_PASSWORD = 'newpassword456';
const SECURITY_QUESTION = "What is your pet's name?";
const SECURITY_ANSWER = "Fluffy";

async function request(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, data };
}

async function runVerification() {
    console.log('Starting verification...');

    try {
        // 1. Signup
        console.log(`\n1. Signing up user: ${EMAIL}`);
        const signupRes = await request('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
                name: 'Test User',
                email: EMAIL,
                password: PASSWORD,
                securityQuestion: SECURITY_QUESTION,
                securityAnswer: SECURITY_ANSWER,
            }),
        });

        if (signupRes.status === 201) {
            console.log('✅ Signup successful');
        } else {
            throw new Error(`Signup failed: ${JSON.stringify(signupRes.data)}`);
        }

        // 2. Get Security Question
        console.log(`\n2. Fetching security question for: ${EMAIL}`);
        const questionRes = await request(`/auth/security-question/${EMAIL}`);
        if (questionRes.data.question === SECURITY_QUESTION) {
            console.log('✅ Security question fetched correctly');
        } else {
            throw new Error(`❌ Wrong security question fetched: ${questionRes.data.question}`);
        }

        // 3. Reset Password
        console.log(`\n3. Resetting password...`);
        const resetRes = await request('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({
                email: EMAIL,
                securityAnswer: SECURITY_ANSWER,
                newPassword: NEW_PASSWORD,
            }),
        });

        if (resetRes.status === 200) {
            console.log('✅ Password reset successful');
        } else {
            throw new Error(`Password reset failed: ${JSON.stringify(resetRes.data)}`);
        }

        // 4. Login with OLD password (should fail)
        console.log(`\n4. Attempting login with OLD password (expecting failure)...`);
        const oldLoginRes = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: EMAIL,
                password: PASSWORD,
            }),
        });

        if (oldLoginRes.status === 401) {
            console.log('✅ Login with old password failed as expected');
        } else {
            throw new Error(`❌ Login with old password SHOULD have failed but got status ${oldLoginRes.status}`);
        }

        // 5. Login with NEW password
        console.log(`\n5. Attempting login with NEW password...`);
        const newLoginRes = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: EMAIL,
                password: NEW_PASSWORD,
            }),
        });

        if (newLoginRes.data.token) {
            console.log('✅ Login with new password successful');
        } else {
            throw new Error('❌ Login response missing token');
        }

        console.log('\n🎉 ALL CHECKS PASSED!');

    } catch (error: any) {
        console.error('\n❌ Verification failed:', error.message);
        process.exit(1);
    }
}

runVerification();
