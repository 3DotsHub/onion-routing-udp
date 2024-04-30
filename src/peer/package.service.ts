import { Injectable } from '@nestjs/common';
import * as dgram from 'dgram';
import { Package, Message, Op } from '../../protos/package';
import { CryptoService } from '../services/crypto.service';
import { AddressInfo } from 'src/peer/peer.types';

@Injectable()
export class PackageService {
	constructor(private readonly cryptoService: CryptoService) {}

	onErrorHandle(err) {
		console.error('Server error:', err);
	}

	onListeningHandle(addressInfo: AddressInfo) {
		console.log(`Socket listening on ${addressInfo.address}:${addressInfo.port}`);
	}

	onMessageHandle(rdata: Buffer, rinfo: dgram.RemoteInfo) {
		const pkg = Package.fromBinary(rdata);
		const verified = new CryptoService().verifyPackage(pkg);
		console.log(`Package received: ${rinfo.address}:${rinfo.port} Signature: ${verified}`);
	}
}
