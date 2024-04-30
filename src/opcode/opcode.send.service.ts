import { Injectable } from '@nestjs/common';
import { Package, Message, Op } from '../../protos/package';

@Injectable()
export class OpcodeSendService {
	constructor() {}

	// @Interval(Math.floor(2000 * Math.random()))
	// sendDiscoveryMessage() {
	// 	// bootstrapping?
	// 	if (this.peerModule.verifiedPeers.length == 0) {
	// 		const message = Message.create({ op: Op.DISCOVERY });
	// 		const signedPackage = this.cryptoKeyPairService.signMessage(message);
	// 		const addressInfos: AddressInfo[] = true ? bootstrapStatic : bootstrapMappingSubnet255();
	// 		addressInfos.forEach((peer) => this.socket.send(Package.toBinary(signedPackage), peer.port, peer.address));
	// 	}
	// }
}
