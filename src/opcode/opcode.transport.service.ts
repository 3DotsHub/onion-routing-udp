import { Injectable, Logger } from '@nestjs/common';
import * as dgram from 'dgram';
import { SignedPackage, TransportData, OpTransport, DiscoveryData, EncryptedData, RemoteIdentities } from '../../protos/SignedPackage';
import { Message, OpMessage } from '../../protos/MessagePackage';

import { CryptoRsaService } from 'src/crypto/crypto.rsa.service';
import { OpcodeCreateService } from './opcode.create.service';
import { OpcodeExecService } from './opcode.exec.service';
import { PeerTransportService } from 'src/peer/peer.transport.service';
import { SelfifyPublicKeyDrop, SignatureVerify, TransportOpcodeDiscoveryDrop, TransportOpcodeEncryptedDrop } from 'src/app.config';
import { PeerIdentity, VerifiedPeer } from 'src/peer/peer.types';

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
		const transportData: TransportData = pkg.transportData;

		// if discovery, add identity first
		if (transportData.opTransport === OpTransport.DISCOVERY) {
			const discoveryData: DiscoveryData = DiscoveryData.fromBinary(transportData.opData);
			const publicKey: string = Buffer.from(discoveryData.publicKey).toString('hex');
			const selfifed: boolean = this.cryptoRsaService.getPublicKey() === publicKey;
			const verified: boolean = this.cryptoRsaService.verifyPackageSignature(pkg, publicKey);

			// verify policies
			if (SignatureVerify && !verified) return;
			if (SelfifyPublicKeyDrop && selfifed) return;

			// log
			this.logger.log(`TransportPackage[0] <DISCOVERY>: ${rinfo.address}:${rinfo.port}, Verified: ${verified}`);

			// upset to verified peers
			peerTransport.upsetVerifiedPeers({
				address: rinfo.address,
				port: rinfo.port,
				pubKey: publicKey,
			});

			// // send discovery message to each remoteIdentities
			discoveryData.remoteIdentities.map((i) => {
				peerTransport.sendPackages([this.opcodeCreateService.createDiscovery(i.address.toString(), parseInt(i.port.toString()))]);
			});
		}

		// getIdentity of transportData
		const remoteIdentity: PeerIdentity = peerTransport.getIdentity(rinfo.address, rinfo.port);
		if (!remoteIdentity) {
			peerTransport.sendPackages([this.opcodeCreateService.createDiscovery(rinfo.address, rinfo.port)]);
			return; // could send a discovery packet
		}

		// verify
		const selfifed: boolean = this.cryptoRsaService.getPublicKey() === remoteIdentity.pubKey;
		const verified: boolean = this.cryptoRsaService.verifyPackageSignature(pkg, remoteIdentity.pubKey);

		// drop policies
		if (SignatureVerify && !verified) return;
		if (SelfifyPublicKeyDrop && selfifed) return;

		// Opcode for transport
		if (transportData.opTransport === OpTransport.DISCOVERY) {
			if (TransportOpcodeDiscoveryDrop) return;
			this.execOpTransportDiscovery(peerTransport, DiscoveryData.fromBinary(transportData.opData), rinfo);
		} else if (transportData.opTransport === OpTransport.ENCRYPTED) {
			if (TransportOpcodeEncryptedDrop) return;
			this.execOpTransportEncrypted(peerTransport, EncryptedData.fromBinary(transportData.opData), rinfo);
		}
	}

	execOpTransportDiscovery(peerTransport: PeerTransportService, discoveryData: DiscoveryData, rinfo: dgram.RemoteInfo) {}

	execOpTransportEncrypted(peerTransport: PeerTransportService, encryptedData: EncryptedData, rinfo: dgram.RemoteInfo) {}
}
