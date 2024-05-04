import { SignedPackage } from 'protos/SignedPackage';
import { AddressInfo } from 'src/peer/peer.types';

export type OpcodeCreateOutput = {
	peer: AddressInfo;
	pkg: SignedPackage;
};

export type OpcodeRunOutput = {};
