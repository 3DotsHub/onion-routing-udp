import { Injectable } from '@nestjs/common';
import { Package, Message, Op } from '../../protos/package';
import { bootstrapMappingSubnet255, bootstrapStatic, bootstrapMappingLocalhostPorts } from 'src/peer/peer.config';
import { AddressInfo, VerifiedPeer } from 'src/peer/peer.types';
import { CryptoKeyPairService } from 'src/crypto/crypto.keypair.service';
import { OpcodeCreateOutput } from './opcode.types';

@Injectable()
export class OpcodeCreateService {
	constructor(
		// private readonly peerModule: PeerModule,
		private readonly cryptoKeyPairService: CryptoKeyPairService
	) {}

	createDiscoveryPackages(verifiedPeers: VerifiedPeer[]): OpcodeCreateOutput[] {
		console.log(verifiedPeers);
		// bootstrapping?
		if (verifiedPeers.length == 0) {
			const message = Message.create({ op: Op.DISCOVERY });
			const signedPackage = this.cryptoKeyPairService.signMessage(message);
			const addressInfos: AddressInfo[] = bootstrapMappingLocalhostPorts();
			const pkgs = addressInfos.map((peer: AddressInfo): OpcodeCreateOutput => {
				return {
					peer,
					pkg: signedPackage,
				};
			});
			return pkgs;
		}
	}
}
