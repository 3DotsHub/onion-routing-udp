import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { AddressInfo } from 'src/peer/peer.types';
import { OpcodeService } from 'src/opcode/opcode.service';

@Injectable()
export class PeerHandleService {
	private readonly logger = new Logger(this.constructor.name);
	constructor(private readonly opcodeService: OpcodeService) {}

	onErrorHandle(error: Error) {
		this.logger.error('Server error:', error);
	}

	onListeningHandle(addressInfo: AddressInfo) {
		this.logger.log(`Socket listening on ${addressInfo.address}:${addressInfo.port}`);
	}

	onMessageHandle(rdata: Buffer, rinfo: dgram.RemoteInfo, port: number) {
		if (rinfo.port === port) return;
		this.opcodeService.runFromBinary(rdata, rinfo);
	}
}
