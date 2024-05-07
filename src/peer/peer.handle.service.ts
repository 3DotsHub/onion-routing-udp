import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { AddressInfo } from 'src/peer/peer.types';
import { OpcodeTransportService } from 'src/opcode/opcode.transport.service';
import { PeerTransportService } from './peer.transport.service';

@Injectable()
export class PeerHandleService {
	private readonly logger = new Logger(this.constructor.name);
	constructor(private readonly opcodeTransportService: OpcodeTransportService) {}

	onErrorHandle(peerTransport: PeerTransportService, error: Error) {
		this.logger.error('Server error:', error);
	}

	onListeningHandle(peerTransport: PeerTransportService) {
		const addr: AddressInfo = peerTransport.socket.address();
		this.logger.warn(`Socket listening on ${addr.address}:${addr.port}`);
	}

	onMessageHandle(peerTransport: PeerTransportService, rdata: Buffer, rinfo: dgram.RemoteInfo) {
		this.opcodeTransportService.fromBinary(peerTransport, rdata, rinfo);
	}
}
