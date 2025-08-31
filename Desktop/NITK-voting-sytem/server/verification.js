import forge from 'node-forge';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the private key from the new file
const privateKeyPem = fs.readFileSync(path.join(__dirname, 'owner_rsa_priv.pem'), 'utf8');

const priv = forge.pki.privateKeyFromPem(privateKeyPem);
const pub = forge.pki.setRsaPublicKey(priv.n, priv.e);
const publicKeyPem = forge.pki.publicKeyToPem(pub);

console.log("GENERATED PUBLIC KEY (From your Private Key):");
console.log(publicKeyPem);
console.log("\n------------------------------------------------\n");
console.log("PUBLIC KEY from your .env file:");
console.log(
  "-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoCawzuCRF/XcMHvZe8Tc\\nmJ/fkMpMn8XNpb+JhR05zDDG66BnPP1qGb/f3FtmAfzT0d/B6yYA35kip7elZtzP\\nVLeEOSihY0GC+FM59HWA9+knmt/k4xieDW1Tt1fdgJhM58kcHQiRX2XMxwbzYXip\\nhb55v88/vBOYOTMdWregiAm9kYNLxVv5HmS4XGBoezR/RDZgUhclJdH5HQYb8IBP\\ntz80TBYhrw5Ryjg38RXxljRbkuW+VMnhIP3tIvMwbzR2vu9mmPz86MeTRnFctxkz\\nciOFU/C81KXmDB15lPpSLN8MhN7pssC3rdl2scAvGT9dkqcTHqEOB26PMaYJ1c3e\\nuQIDAQAB\\n-----END PUBLIC KEY-----"
    .replace(/\\n/g, '\n')
);