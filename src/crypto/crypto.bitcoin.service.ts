import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ECPairFactory } from 'ecpair';
import { SignedPackage, TransportData } from 'protos/SignedPackage';
import * as ecc from 'tiny-secp256k1';
const ECPair = ECPairFactory(ecc);

@Injectable()
export class CryptoBitcoinService {
	protected readonly identity = ECPair.makeRandom();

	getPublicKey(): string {
		return this.identity.publicKey.toString('hex');
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
		const signature = this.identity.sign(Buffer.from(hashed, 'hex')).toString('hex');
		return SignedPackage.create({
			transportData,
			publicKey,
			signature,
		});
	}

	verifyPackageSignature(signedPackage: SignedPackage): boolean {
		const hashedMessage = new Uint8Array(Buffer.from(this.hashTransportData(signedPackage.transportData), 'hex'));
		const signature = new Uint8Array(Buffer.from(signedPackage.signature, 'hex'));
		const publicKey = new Uint8Array(Buffer.from(signedPackage.publicKey, 'hex'));
		return ecc.verify(hashedMessage, publicKey, signature);
	}

	verifyPackageFromBuffer(buf: Buffer): boolean {
		return this.verifyPackageSignature(SignedPackage.fromBinary(buf));
	}
}
