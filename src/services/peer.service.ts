import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import * as dgram from 'dgram';
import { bootstrapMappingTo255 } from '../config/peer.config';
import { Peer, VerifiedPeer } from '../types/peer.types';
import { Package, Message, Op } from '../../protos/package';
import { CryptoService } from './crypto.service';

@Injectable()
export class PeerService {
	private readonly socket: dgram.Socket = dgram.createSocket('udp4');
	private readonly port: number = parseInt(process.env.PORT) || 42069;
	private readonly verifiedPeers: VerifiedPeer[] = [];

	constructor(private readonly cryptoService: CryptoService) {
		this.socket.on('message', (rdata, rinfo) => {
			const pkg = Package.fromBinary(rdata);
			const verified = this.cryptoService.verifyPackage(pkg);
			console.log(`Package received: ${rinfo.address}:${rinfo.port} Signature: ${verified}`);
		});
		this.socket.on('error', (err) => {
			console.error('Server error:', err);
		});

		this.socket.on('listening', () => {
			const address = this.socket.address();
			console.log(`Socket listening on ${address.address}:${address.port}`);
		});

		this.socket.bind(this.port);
	}

	@Interval(Math.floor(2000 * Math.random()))
	sendDiscoveryMessage() {
		// bootstrapping?
		if (this.verifiedPeers.length == 0) {
			const message = Message.create({ op: Op.DISCOVERY });
			const signedPackage = this.cryptoService.signMessage(message);

			const peers: Peer[] = bootstrapMappingTo255();
			peers.forEach((peer) => this.socket.send(Package.toBinary(signedPackage), peer.port, peer.address));
		}
	}
}
