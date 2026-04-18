const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const testNames = ['boapay', 'boa-pay', 'mlxdirect', 'boap-pay'];
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

async function test() {
    for (const name of testNames) {
        console.log(`Testing cloud_name: ${name}`);
        cloudinary.config({
            cloud_name: name,
            api_key: apiKey,
            api_secret: apiSecret
        });
        
        try {
            const res = await cloudinary.api.ping();
            console.log(`✅ Success for ${name}:`, res);
            process.exit(0);
        } catch (err) {
            console.log(`❌ Failed for ${name}: ${err.message}`);
        }
    }
    console.log('None of the common variations worked.');
    process.exit(1);
}

test();
