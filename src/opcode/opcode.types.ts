import { Package } from 'protos/package';
import { AddressInfo } from 'src/peer/peer.types';

export type OpcodeCreateOutput = {
	peer: AddressInfo;
	pkg: Package;
};

export type OpcodeRunOutput = {};
