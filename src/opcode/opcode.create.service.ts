import { Injectable } from '@nestjs/common';
import { TransportData, OpTransport } from '../../protos/SignedPackage';
import { Message } from '../../protos/MessagePackage';

import { bootstrapMappingSubnet255 } from 'src/peer/peer.config';
import { AddressInfo, VerifiedPeer } from 'src/peer/peer.types';
import { CryptoRsaService } from 'src/crypto/crypto.rsa.service';
import { OpcodeCreateOutput } from './opcode.types';

@Injectable()
export class OpcodeCreateService {
	constructor(private readonly cryptoRsaService: CryptoRsaService) {}

	createDiscoveryPackages(verifiedPeers: VerifiedPeer[]): OpcodeCreateOutput[] {
		// bootstrapping?
		if (verifiedPeers.length == 0) {
			const transportData = TransportData.create({ opTransport: OpTransport.DISCOVERY });
			const signedPackage = this.cryptoRsaService.signTransportData(transportData);
			const addressInfos: AddressInfo[] = bootstrapMappingSubnet255();
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
