import { Module } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as dgram from 'dgram';

import { bootstrapMappingTo255 } from './peer.config';
import { AddressInfo, VerifiedPeer } from './peer.types';
import { Package, Message, Op } from '../../protos/package';

import { PackageService } from 'src/peer/package.service';
import { CryptoService } from 'src/services/crypto.service';

@Module({
	providers: [PackageService, CryptoService],
	exports: [PackageService],
})
export class PeerModule {
	private readonly socket: dgram.Socket = dgram.createSocket('udp4');
	private readonly port: number = parseInt(process.env.PORT) || 42069;
	private readonly verifiedPeers: VerifiedPeer[] = [];

	constructor(
		private readonly cryptoService: CryptoService,
		private readonly packageService: PackageService
	) {
		this.socket.on('message', this.packageService.onMessageHandle);
		this.socket.on('error', this.packageService.onErrorHandle);
		this.socket.on('listening', () => this.packageService.onListeningHandle(this.socket.address()));

		this.socket.bind(this.port);
	}

	@Interval(Math.floor(2000 * Math.random()))
	sendDiscoveryMessage() {
		// bootstrapping?
		if (this.verifiedPeers.length == 0) {
			const message = Message.create({ op: Op.DISCOVERY });
			const signedPackage = this.cryptoService.signMessage(message);
			const addressInfos: AddressInfo[] = bootstrapMappingTo255();
			addressInfos.forEach((peer) => this.socket.send(Package.toBinary(signedPackage), peer.port, peer.address));
		}
	}
}
