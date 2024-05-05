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
		transportPkgs.forEach((pkg) => {
			this.logger.log(`Package[${pkg.pkg.transportData.opTransport}] <SEND TO>: ${pkg.peer.address}:${pkg.peer.port}`);
			this.socket.send(SignedPackage.toBinary(pkg.pkg), pkg.peer.port, pkg.peer.address);
		});
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
		// check all verified peers
		for (let p of this.verifiedPeers) {
			const pId: PeerIdentity = {
				address: p.address,
				port: p.port,
				pubKey: p.pubKey,
			};
			if (peerIdentity.address === pId.address && peerIdentity.port === pId.port) {
				// did pubKey changed?
				if (peerIdentity.pubKey !== pId.pubKey) {
					p.pubKey = peerIdentity.pubKey;
					p.heartBeat = 0;
					this.logger.log(
						`VerifiedPeer[${this.verifiedPeers.length}] <UPDATE PUBKEY>: ${peerIdentity.address}:${peerIdentity.port}`
					);
				}

				p.heartBeat += 1;
				p.updatedAt = Date.now();

				this.logger.log(
					`VerifiedPeer[${this.verifiedPeers.length}] <UPDATE HEARTBEAT>: ${p.heartBeat} from ${peerIdentity.address}:${peerIdentity.port}`
				);

				return false;
			}
		}
		this.verifiedPeers.push({
			address: peerIdentity.address,
			port: peerIdentity.port,
			pubKey: peerIdentity.pubKey,
			heartBeat: 0,
			discoveredAt: Date.now(),
			updatedAt: Date.now(),
		});
		this.logger.log(`VerifiedPeer[${this.verifiedPeers.length}] <NEW PEER>: ${peerIdentity.address}:${peerIdentity.port}`);
		return true;
	}

	@Interval(10 * 60 * 1000)
	cleanVerifiedPeers() {
		const now = Date.now();
		for (let idx = 0; idx < this.verifiedPeers.length; idx++) {
			if (this.verifiedPeers.at(idx).updatedAt + 60 * 1000 < now) {
				this.verifiedPeers.splice(idx, 1);
			}
		}
	}
}
