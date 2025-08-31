// This is a runnable script.

import forge from 'node-forge';

// Generate a new RSA key pair
const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048, e: 0x10001 });

const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);

console.log('Private Key:\n', privateKeyPem);
console.log('\nPublic Key:\n', publicKeyPem);