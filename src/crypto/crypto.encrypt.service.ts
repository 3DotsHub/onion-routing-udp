import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
@Injectable()
export class CryptoEncryptService {
	encryptFromHexString(data: string, publicKey: string): string {
		const encryptedBuffer = crypto.publicEncrypt(publicKey, Buffer.from(data, 'hex'));
		return encryptedBuffer.toString('hex');
	}

	decryptFromHexString(encryptedText: string, privateKey: string): string {
		const decryptedBuffer = crypto.privateDecrypt(
			{
				key: privateKey,
				passphrase: '',
			},
			Buffer.from(encryptedText, 'hex')
		);
		return decryptedBuffer.toString('hex');
	}
}
