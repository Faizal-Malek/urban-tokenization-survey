#!/usr/bin/env node
// Simple helper to hash a password with bcryptjs and optionally compare to an existing hash.
// Usage:
//   node scripts/hashPassword.js "passwordToHash"
//   node scripts/hashPassword.js "passwordToHash" "existingHashToCompare"

const bcrypt = require('bcryptjs');

const [, , password, existingHash] = process.argv;

if (!password) {
  console.error('Usage: node scripts/hashPassword.js "password" [existingHash]');
  process.exit(1);
}

(async () => {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Generated hash:');
    console.log(hash);

    if (existingHash) {
      const match = await bcrypt.compare(password, existingHash);
      console.log('\nCompare to provided hash:', match ? 'MATCH' : 'NO MATCH');
    }
  } catch (err) {
    console.error('Error:', err);
    process.exit(2);
  }
})();
