import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { Package, Message, Op } from '../../protos/package';

import { CryptoKeyPairService } from 'src/crypto/crypto.keypair.service';
import { OpcodeCreateService } from './opcode.create.service';
import { OpcodeExecService } from './opcode.exec.service';

@Injectable()
export class OpcodeService {
	private readonly logger = new Logger(this.constructor.name);

	constructor(
		private readonly cryptoKeyPairService: CryptoKeyPairService,
		private readonly opcodeCreateService: OpcodeCreateService,
		private readonly opcodeExecService: OpcodeExecService
	) {}

	runFromBinary(rdata: Buffer, rinfo: dgram.RemoteInfo) {
		const pkg = Package.fromBinary(rdata);
		this.runFromReceivedPackage(pkg, rinfo);
	}

	runFromReceivedPackage(pkg: Package, rinfo: dgram.RemoteInfo) {
		// verify package signature
		const verified = this.cryptoKeyPairService.verifyPackageSignature(pkg);

		// log income message
		this.logger.log(`Package received: ${rinfo.address}:${rinfo.port}, Verified: ${verified}, Opcode: ${pkg.message.op}`);

		// drop policy
		if (!verified) return;

		// redirect to service by opcode
		const op: Op = pkg.message.op;
		if (op === Op.DISCOVERY) this.opcodeExecService.execDiscoveryPackage(pkg, rinfo);
	}
}
