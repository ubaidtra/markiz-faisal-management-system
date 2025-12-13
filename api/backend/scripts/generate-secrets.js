#!/usr/bin/env node

/**
 * Generate secure secrets for authentication
 * Run with: node scripts/generate-secrets.js
 */

const crypto = require('crypto');

console.log('\n🔐 Generating Secure Authentication Secrets\n');
console.log('='.repeat(60));

// Generate NextAuth secret (base64 encoded, 32 bytes)
const nextAuthSecret = crypto.randomBytes(32).toString('base64');

// Generate JWT secret (hex encoded, 64 bytes)
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Generate Session secret (hex encoded, 32 bytes)
const sessionSecret = crypto.randomBytes(32).toString('hex');

console.log('\n📋 Add these to your backend/.env file:\n');
console.log('# JWT Secret (for token signing)');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('\n# NextAuth Secret (if using NextAuth.js)');
console.log(`NEXTAUTH_SECRET=${nextAuthSecret}`);
console.log('\n# Session Secret (for session management)');
console.log(`SESSION_SECRET=${sessionSecret}`);

console.log('\n' + '='.repeat(60));
console.log('\n✅ Secrets generated successfully!');
console.log('⚠️  Keep these secrets secure and never commit them to git!\n');

