import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { SignedPackage, TransportData, OpTransport } from '../../protos/SignedPackage';

import { CryptoRsaService } from 'src/crypto/crypto.rsa.service';
import { OpcodeCreateService } from './opcode.create.service';
import { OpcodeExecService } from './opcode.exec.service';
import { PeerTransportService } from 'src/peer/peer.transport.service';

@Injectable()
export class OpcodeService {
	private readonly logger = new Logger(this.constructor.name);

	constructor(
		private readonly cryptoRsaService: CryptoRsaService,
		private readonly opcodeCreateService: OpcodeCreateService,
		private readonly opcodeExecService: OpcodeExecService
	) {}

	runFromBinary(peerTransport: PeerTransportService, rdata: Buffer, rinfo: dgram.RemoteInfo) {
		const pkg = SignedPackage.fromBinary(rdata);
		this.runFromReceivedPackage(peerTransport, pkg, rinfo);
	}

	runFromReceivedPackage(peerTransport: PeerTransportService, pkg: SignedPackage, rinfo: dgram.RemoteInfo) {
		// verify package signature
		const selfifed: boolean = this.cryptoRsaService.getPublicKey() === pkg.publicKey;
		const verified: boolean = this.cryptoRsaService.verifyPackageSignature(pkg);
		const opcodeTransport: OpTransport = pkg.transportData.opTransport;

		// log income message
		this.logger.log(
			`TransportPackage <>: ${rinfo.address}:${rinfo.port}, Verified: ${verified}, Selified: ${selfifed}, Opcode: ${opcodeTransport}`
		);

		// drop policy
		if (!verified || selfifed) return;

		// redirect to service by opcode
		if (opcodeTransport === OpTransport.DISCOVERY) this.opcodeExecService.execDiscoveryPackage(pkg, rinfo);
	}
}
