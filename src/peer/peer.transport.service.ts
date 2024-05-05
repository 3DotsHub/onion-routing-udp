import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { PeerIdentity, SignedPackageForTransport, VerifiedPeer } from 'src/peer/peer.types';
import { PeerHandleService } from './peer.handle.service';
import { Interval } from '@nestjs/schedule';
import { OpcodeCreateService } from 'src/opcode/opcode.create.service';
import { SignedPackage } from 'protos/SignedPackage';
import { OpcodeCreateOutput } from 'src/opcode/opcode.types';

@Injectable()
export class PeerTransportService {
	private readonly logger = new Logger(this.constructor.name);
	private readonly port: number = parseInt(process.env.LISTENPORT) || 42069;
	// private readonly port: number = 42069 + Math.floor(Math.random() * 1000);
	public readonly socket: dgram.Socket = dgram.createSocket('udp4');
	public readonly verifiedPeers: VerifiedPeer[] = [];

	constructor(
		private readonly peerHandleService: PeerHandleService,
		private readonly opcodeCreateService: OpcodeCreateService
	) {
		this.socket.on('message', (rdata: Buffer, rinfo: dgram.RemoteInfo) => this.peerHandleService.onMessageHandle(this, rdata, rinfo));
		this.socket.on('error', (error: Error) => this.peerHandleService.onErrorHandle(this, error));
		this.socket.on('listening', () => this.peerHandleService.onListeningHandle(this));

		this.socket.bind(this.port);
	}

	sendPackages(transportPkgs: SignedPackageForTransport[]) {
		transportPkgs.forEach((pkg) => this.socket.send(SignedPackage.toBinary(pkg.pkg), pkg.peer.port, pkg.peer.address));
	}

	@Interval(Math.floor(10000 + 20000 * Math.random()))
	sendDiscoveryPackages() {
		this.sendPackages(this.opcodeCreateService.createDiscoveryPackages(this.verifiedPeers));
	}

	getIdentity(addr: string, port: number): PeerIdentity {
		for (let p of this.verifiedPeers) {
			if (p.address === addr && p.port === port) return p;
		}
		return;
	}

	upsetVerifiedPeers(peerIdentity: PeerIdentity): boolean {
		for (let p of this.verifiedPeers) {
			const pId: PeerIdentity = {
				address: p.address,
				port: p.port,
				pubKey: p.pubKey,
			};
			if (JSON.stringify(pId) === JSON.stringify(peerIdentity)) {
				this.logger.log(`VerifiedPeer[${this.verifiedPeers.length}] <UPDATE>: ${peerIdentity.address}:${peerIdentity.port}`);
				p.updatedAt = Date.now();
				return false;
			}
		}
		this.verifiedPeers.push({
			address: peerIdentity.address,
			port: peerIdentity.port,
			pubKey: peerIdentity.pubKey,
			discoveredAt: Date.now(),
			updatedAt: Date.now(),
		});
		this.logger.log(`VerifiedPeer[${this.verifiedPeers.length}] <NEW>: ${peerIdentity.address}:${peerIdentity.port}`);
	}
}
