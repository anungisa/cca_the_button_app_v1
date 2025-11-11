/**
 * Encryption Service
 * Handles client-side encryption for sensitive data
 */

class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
  }

  async generateKey() {
    return await crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data, key) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv
      },
      key,
      dataBuffer
    );

    return {
      encrypted: btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer))),
      iv: btoa(String.fromCharCode(...iv))
    };
  }

  async decrypt(encryptedData, iv, key) {
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
    
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: ivBuffer
      },
      key,
      encryptedBuffer
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedBuffer));
  }

  // Hash function for passwords (would use bcrypt on server)
  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  }
}

export const encryptionService = new EncryptionService();
export default encryptionService;