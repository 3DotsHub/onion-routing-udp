import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { SignedPackage, TransportData, OpTransport } from '../../protos/SignedPackage';

import { CryptoRsaService } from 'src/crypto/crypto.rsa.service';
import { OpcodeCreateService } from './opcode.create.service';
import { OpcodeExecService } from './opcode.exec.service';
import { PeerTransportService } from 'src/peer/peer.transport.service';
import { SelfifyPublicKeyDrop, SignatureVerify } from 'src/app.config';

@Injectable()
export class OpcodeTransportService {
	private readonly logger = new Logger(this.constructor.name);

	constructor(
		private readonly cryptoRsaService: CryptoRsaService,
		private readonly opcodeCreateService: OpcodeCreateService,
		private readonly opcodeExecService: OpcodeExecService
	) {}

	fromBinary(peerTransport: PeerTransportService, rdata: Buffer, rinfo: dgram.RemoteInfo) {
		const pkg = SignedPackage.fromBinary(rdata);
		this.fromSignedPackage(peerTransport, pkg, rinfo);
	}

	fromSignedPackage(peerTransport: PeerTransportService, pkg: SignedPackage, rinfo: dgram.RemoteInfo) {
		const selfifed: boolean = this.cryptoRsaService.getPublicKey() === pkg.publicKey;
		const verified: boolean = this.cryptoRsaService.verifyPackageSignature(pkg);
		const opcodeTransport: OpTransport = pkg.transportData.opTransport;
		const opcodeData: Uint8Array = pkg.transportData.opData;

		// drop policy
		if (SignatureVerify && !verified) return;
		if (SelfifyPublicKeyDrop && selfifed) return;

		this.logger.log(
			`TransportPackage <${opcodeTransport}>: ${rinfo.address}:${rinfo.port}, Verified: ${verified}, Selified: ${selfifed}`
		);

		// redirect to service by opcode
		if (opcodeTransport === OpTransport.DISCOVERY) {
			this.opcodeExecService.execDiscoveryPackage(pkg, rinfo);
		} else if (opcodeTransport === OpTransport.ENCRYPTED) {
			// take opcodeData and decrypt with key. Which key?
		}
	}
}
