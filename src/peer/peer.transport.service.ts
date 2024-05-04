import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { VerifiedPeer } from 'src/peer/peer.types';
import { PeerHandleService } from './peer.handle.service';
import { Interval } from '@nestjs/schedule';
import { OpcodeCreateService } from 'src/opcode/opcode.create.service';
import { SignedPackage } from 'protos/SignedPackage';
import { OpcodeCreateOutput } from 'src/opcode/opcode.types';

@Injectable()
export class PeerTransportService {
	private readonly port: number = parseInt(process.env.LISTENPORT) || 42069;
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

	sendPackages(transportPkgs: OpcodeCreateOutput[]) {
		transportPkgs.forEach((pkg) => this.socket.send(SignedPackage.toBinary(pkg.pkg), pkg.peer.port, pkg.peer.address));
	}

	@Interval(Math.floor(5000 + 10000 * Math.random()))
	sendDiscoveryMessage() {
		this.sendPackages(this.opcodeCreateService.createDiscoveryPackages(this.verifiedPeers));
	}
}
