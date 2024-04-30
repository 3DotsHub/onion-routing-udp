import { Injectable, Inject } from '@nestjs/common';
import * as dgram from 'dgram';
import { Package, Message, Op } from '../../protos/package';
import { AddressInfo } from 'src/peer/peer.types';
import { CryptoKeyPairService } from 'src/crypto/crypto.keypair.service';

@Injectable()
export class PeerHandleService {
	constructor(private readonly cryptoKeyPairService: CryptoKeyPairService) {}

	onErrorHandle(error: Error) {
		console.error('Server error:', error);
	}

	onListeningHandle(addressInfo: AddressInfo) {
		console.log(`Socket listening on ${addressInfo.address}:${addressInfo.port}`);
	}

	onMessageHandle(rdata: Buffer, rinfo: dgram.RemoteInfo) {
		const pkg = Package.fromBinary(rdata);
		const verified = this.cryptoKeyPairService.verifyPackage(pkg);
		console.log(`Package received: ${rinfo.address}:${rinfo.port}, Verified: ${verified}, Opcode: ${pkg.message.op}`);
	}
}
