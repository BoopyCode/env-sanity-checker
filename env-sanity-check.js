#!/usr/bin/env node

// Welcome to .env debugging simulator 2024
// Where 90% of "it works on my machine" is just missing variables

const fs = require('fs');
const path = require('path');

// The sacred template that holds all our hopes and dreams
const ENV_TEMPLATE = '.env.example';
// The actual file that's probably broken
const ENV_FILE = '.env';

function checkEnvSanity() {
    console.log('🔍 Running .env sanity check...');
    console.log('(Because apparently reading error messages is too hard)');
    
    // Step 1: Does the template even exist?
    if (!fs.existsSync(ENV_TEMPLATE)) {
        console.log(`❌ ${ENV_TEMPLATE} not found. Are you even trying?`);
        return false;
    }
    
    // Step 2: Read the template (the "instructions" nobody reads)
    const templateContent = fs.readFileSync(ENV_TEMPLATE, 'utf8');
    const templateVars = new Set();
    
    templateContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        // Look for actual variable definitions, not comments or empty lines
        if (trimmed && !trimmed.startsWith('#')) {
            const varName = trimmed.split('=')[0];
            if (varName) templateVars.add(varName.trim());
        }
    });
    
    console.log(`📋 Template expects ${templateVars.size} variables`);
    
    // Step 3: Check if .env exists (spoiler: it probably doesn't)
    if (!fs.existsSync(ENV_FILE)) {
        console.log(`❌ ${ENV_FILE} not found. Did you forget to copy the example?`);
        console.log('💡 Try: cp .env.example .env');
        return false;
    }
    
    // Step 4: Read the actual .env (the "I'll figure it out later" file)
    const envContent = fs.readFileSync(ENV_FILE, 'utf8');
    const envVars = new Set();
    
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const varName = trimmed.split('=')[0];
            if (varName) envVars.add(varName.trim());
        }
    });
    
    console.log(`📄 Your .env has ${envVars.size} variables`);
    
    // Step 5: The moment of truth - compare!
    const missingVars = [];
    for (const requiredVar of templateVars) {
        if (!envVars.has(requiredVar)) {
            missingVars.push(requiredVar);
        }
    }
    
    if (missingVars.length === 0) {
        console.log('✅ All variables present! Your .env might actually work!');
        console.log('(This is a rare and beautiful moment. Enjoy it.)');
        return true;
    } else {
        console.log(`❌ Missing ${missingVars.length} variable(s):`);
        missingVars.forEach(varName => {
            console.log(`   - ${varName} (the one you forgot)`);
        });
        console.log('\n💡 Pro tip: Maybe actually fill in ALL the variables?');
        return false;
    }
}

// Run the check if this file is executed directly
if (require.main === module) {
    const success = checkEnvSanity();
    process.exit(success ? 0 : 1);
}

module.exports = { checkEnvSanity };