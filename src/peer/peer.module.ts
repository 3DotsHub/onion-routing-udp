import { Module } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as dgram from 'dgram';

import { bootstrapStatic, bootstrapMappingSubnet255 } from './peer.config';
import { AddressInfo, VerifiedPeer } from './peer.types';
import { Package, Message, Op } from '../../protos/package';

import { CryptoKeyPairService } from 'src/crypto/crypto.keypair.service';
import { PeerHandleService } from 'src/peer/peer.handle.service';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
	providers: [PeerHandleService],
	exports: [PeerHandleService],
	imports: [CryptoModule],
})
export class PeerModule {
	private readonly socket: dgram.Socket = dgram.createSocket('udp4');
	private readonly port: number = parseInt(process.env.PORT) || 42069;
	private readonly verifiedPeers: VerifiedPeer[] = [];

	constructor(
		private readonly cryptoKeyPairService: CryptoKeyPairService,
		private readonly peerHandleService: PeerHandleService
	) {
		this.socket.on('message', (rdata: Buffer, rinfo: dgram.RemoteInfo) => this.peerHandleService.onMessageHandle(rdata, rinfo));
		this.socket.on('error', (error: Error) => this.peerHandleService.onErrorHandle(error));
		this.socket.on('listening', () => this.peerHandleService.onListeningHandle(this.socket.address()));

		this.socket.bind(this.port);
	}

	init() {}

	@Interval(Math.floor(2000 * Math.random()))
	sendDiscoveryMessage() {
		// bootstrapping?
		if (this.verifiedPeers.length == 0) {
			const message = Message.create({ op: Op.DISCOVERY });
			const signedPackage = this.cryptoKeyPairService.signMessage(message);
			const addressInfos: AddressInfo[] = false ? bootstrapStatic : bootstrapMappingSubnet255();
			addressInfos.forEach((peer) => this.socket.send(Package.toBinary(signedPackage), peer.port, peer.address));
		}
	}
}
