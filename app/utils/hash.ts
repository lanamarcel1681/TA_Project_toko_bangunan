import crypto from 'crypto';

export function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(inputPassword: string, storedPassword: string): boolean {
    // Cek apakah password tersimpan sudah di-hash (panjang 64 karakter hex)
    const isHashed = /^[a-f0-9]{64}$/i.test(storedPassword);
    
    if (isHashed) {
        const hashedInput = hashPassword(inputPassword);
        return hashedInput === storedPassword;
    } else {
        // Fallback untuk password lama yang belum di-hash (plaintext)
        return inputPassword === storedPassword;
    }
}
