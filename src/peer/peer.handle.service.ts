import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { Package } from '../../protos/package';
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

	onMessageHandle(rdata: Buffer, rinfo: dgram.RemoteInfo) {
		const pkg = Package.fromBinary(rdata);
		this.opcodeService.verifyOpcodeFromReceivedPackage(pkg, rinfo);
	}
}
