import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { VerifiedPeer } from 'src/peer/peer.types';
import { PeerHandleService } from './peer.handle.service';
import { Interval } from '@nestjs/schedule';
import { OpcodeCreateService } from 'src/opcode/opcode.create.service';
import { Package } from 'protos/package';
import { OpcodeCreateOutput } from 'src/opcode/opcode.types';

@Injectable()
export class PeerTransportService {
	// private readonly port: number = parseInt(process.env.LISTENPORT) || 42069;
	private readonly port: number = Math.floor(Math.random() * 256 + 42069);
	public readonly socket: dgram.Socket = dgram.createSocket('udp4');
	public readonly verifiedPeers: VerifiedPeer[] = [];

	constructor(
		private readonly peerHandleService: PeerHandleService,
		private readonly opcodeCreateService: OpcodeCreateService
	) {
		this.socket.on('message', (rdata: Buffer, rinfo: dgram.RemoteInfo) =>
			this.peerHandleService.onMessageHandle(rdata, rinfo, this.port)
		);
		this.socket.on('error', (error: Error) => this.peerHandleService.onErrorHandle(error));
		this.socket.on('listening', () => this.peerHandleService.onListeningHandle(this.socket.address()));

		this.socket.bind(this.port);
	}

	sendPackages(transportPkgs: OpcodeCreateOutput[]) {
		transportPkgs.forEach((pkg) => this.socket.send(Package.toBinary(pkg.pkg), pkg.peer.port, pkg.peer.address));
	}

	@Interval(Math.floor(10000 * Math.random()))
	sendDiscoveryMessage() {
		this.sendPackages(this.opcodeCreateService.createDiscoveryPackages(this.verifiedPeers));
	}
}
