import { Injectable } from '@nestjs/common';
import { TransportData, OpTransport, DiscoveryData } from '../../protos/SignedPackage';
import { Message } from '../../protos/MessagePackage';

import { bootstrapMappingSubnet255 } from 'src/peer/peer.config';
import { AddressInfo, SignedPackageForTransport, VerifiedPeer } from 'src/peer/peer.types';
import { CryptoRsaService } from 'src/crypto/crypto.rsa.service';

@Injectable()
export class OpcodeCreateService {
	constructor(private readonly cryptoRsaService: CryptoRsaService) {}

	createDiscoveryPackages(verifiedPeers: VerifiedPeer[]): SignedPackageForTransport[] {
		// bootstrapping? over Transport Layer
		if (verifiedPeers.length < 10) {
			const opcodeData = DiscoveryData.create({ publicKey: Buffer.from(this.cryptoRsaService.getPublicKey(), 'hex') });
			const transportData = TransportData.create({ opTransport: OpTransport.DISCOVERY, opData: DiscoveryData.toBinary(opcodeData) });
			const signedPackage = this.cryptoRsaService.signTransportData(transportData);
			const addressInfos: AddressInfo[] = bootstrapMappingSubnet255();
			const pkgs = addressInfos.map((peer: AddressInfo): SignedPackageForTransport => {
				return {
					peer,
					pkg: signedPackage,
				};
			});
			return pkgs;
		}
		return [];
	}
}
