import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { Package, Message, Op } from '../../protos/package';

import { CryptoKeyPairService } from 'src/crypto/crypto.keypair.service';
import { OpcodeSendService } from './opcode.send.service';
import { OpcodeReceiveService } from './opcode.receive.service';

@Injectable()
export class OpcodeService {
	private readonly logger = new Logger(this.constructor.name);

	constructor(
		private readonly cryptoKeyPairService: CryptoKeyPairService,
		private readonly opcodeSendService: OpcodeSendService,
		private readonly opcodeReceiveService: OpcodeReceiveService
	) {}

	verifyOpcodeFromReceivedPackage(pkg: Package, rinfo: dgram.RemoteInfo) {
		const op: Op = pkg.message.op;

		// verify package signature
		const verified = this.cryptoKeyPairService.verifyPackageSignature(pkg);
		if (!verified) return;

		// log income message
		this.logger.log(`Package received: ${rinfo.address}:${rinfo.port}, Verified: ${verified}, Opcode: ${pkg.message.op}`);

		// redirect to service by opcode
		if (op === Op.DISCOVERY) this.opcodeReceiveService.DISCOVERY();
		else if (op === Op.DISCOVERY) this.opcodeReceiveService.DISCOVERY();
		else if (op === Op.DISCOVERY) this.opcodeReceiveService.DISCOVERY();
		else if (op === Op.DISCOVERY) this.opcodeReceiveService.DISCOVERY();
	}
}
