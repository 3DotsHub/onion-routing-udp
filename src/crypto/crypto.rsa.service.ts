import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as crypto from 'crypto';
import { SignedPackage, TransportData, OpTransport } from 'protos/SignedPackage';

@Injectable()
export class CryptoRsaService {
	private readonly logger = new Logger(this.constructor.name);
	protected identity = undefined;

	constructor() {
		this.generateNewIdentity();
	}

	@Interval(10 * 60000)
	generateNewIdentity() {
		this.identity = crypto.generateKeyPairSync('rsa', {
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
		this.logger.log(`Generated new RSA Identity`);
	}

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
		const hashed = this.hashTransportData(transportData);
		const signature = crypto.createSign('RSA-SHA256').update(Buffer.from(hashed, 'hex')).sign(this.identity.privateKey, 'hex');
		return SignedPackage.create({
			transportData,
			signature,
		});
	}

	verifyPackageSignature(signedPackage: SignedPackage, publicKey: string): boolean {
		const hashed = new Uint8Array(Buffer.from(this.hashTransportData(signedPackage.transportData), 'hex'));
		return crypto
			.createVerify('RSA-SHA256')
			.update(hashed)
			.verify(Buffer.from(publicKey, 'hex').toString('utf-8'), signedPackage.signature, 'hex');
	}
}
