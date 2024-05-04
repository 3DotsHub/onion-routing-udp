import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { AddressInfo } from 'src/peer/peer.types';
import { OpcodeService } from 'src/opcode/opcode.service';
import { PeerTransportService } from './peer.transport.service';

@Injectable()
export class PeerHandleService {
	private readonly logger = new Logger(this.constructor.name);
	constructor(private readonly opcodeService: OpcodeService) {}

	onErrorHandle(peerTransport: PeerTransportService, error: Error) {
		this.logger.error('Server error:', error);
	}

	onListeningHandle(peerTransport: PeerTransportService) {
		const addr: AddressInfo = peerTransport.socket.address();
		this.logger.log(`Socket listening on ${addr.address}:${addr.port}`);
	}

	onMessageHandle(peerTransport: PeerTransportService, rdata: Buffer, rinfo: dgram.RemoteInfo) {
		this.opcodeService.runFromBinary(peerTransport, rdata, rinfo);
	}
}
