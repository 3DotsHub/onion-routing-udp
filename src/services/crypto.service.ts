import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ECPairFactory } from 'ecpair';
import { Message, Package } from 'protos/package';
import * as ecc from 'tiny-secp256k1';
const ECPair = ECPairFactory(ecc);

@Injectable()
export class CryptoService {
	protected readonly identity = ECPair.makeRandom();

	// getPrivateKey(): string {
	// 	return this.identity.toWIF();
	// }

	getPublicKey(): string {
		return this.identity.publicKey.toString('hex');
	}

	hashMessage(message: Message): string {
		const binaryMessage = Message.toBinary(message);
		const hashedMessage = crypto.createHash('sha256');
		hashedMessage.update(binaryMessage);
		return hashedMessage.digest('hex');
	}

	signMessage(message: Message): Package {
		const publicKey = this.getPublicKey();
		const hashedMessage = this.hashMessage(message);
		const signature = this.identity.sign(Buffer.from(hashedMessage, 'hex')).toString('hex');
		return Package.create({
			message,
			publicKey,
			signature,
		});
	}

	verifyPackage(pkg: Package): boolean {
		const hashedMessage = new Uint8Array(Buffer.from(this.hashMessage(pkg.message), 'hex'));
		const signature = new Uint8Array(Buffer.from(pkg.signature, 'hex'));
		const publicKey = new Uint8Array(Buffer.from(pkg.publicKey, 'hex'));
		return ecc.verify(hashedMessage, publicKey, signature);
	}
}
