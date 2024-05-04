import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { SignedPackage, TransportData, OpTransport } from 'protos/SignedPackage';

@Injectable()
export class CryptoRsaService {
	protected readonly identity = crypto.generateKeyPairSync('rsa', {
		modulusLength: 2048,
		publicKeyEncoding: {
			type: 'spki',
			format: 'pem',
		},
		privateKeyEncoding: {
			type: 'pkcs8',
			format: 'pem',
		},
	});

	getPublicKey(): string {
		return Buffer.from(this.identity.publicKey).toString('hex');
	}

	hashTransportData(transportData: TransportData): string {
		const binary = TransportData.toBinary(transportData);
		const hashed = crypto.createHash('sha256');
		hashed.update(binary);
		return hashed.digest('hex');
	}

	signTransportData(transportData: TransportData): SignedPackage {
		const publicKey = this.getPublicKey();
		const hashed = this.hashTransportData(transportData);
		const signature = crypto.createSign('RSA-SHA256').update(Buffer.from(hashed, 'hex')).sign(this.identity.privateKey, 'hex');
		return SignedPackage.create({
			transportData,
			publicKey,
			signature,
		});
	}

	verifyPackageSignature(signedPackage: SignedPackage): boolean {
		const hashed = new Uint8Array(Buffer.from(this.hashTransportData(signedPackage.transportData), 'hex'));
		return crypto
			.createVerify('RSA-SHA256')
			.update(hashed)
			.verify(Buffer.from(signedPackage.publicKey, 'hex').toString('utf-8'), signedPackage.signature, 'hex');
	}

	verifyPackageFromBuffer(buf: Buffer): boolean {
		return this.verifyPackageSignature(SignedPackage.fromBinary(buf));
	}
}
