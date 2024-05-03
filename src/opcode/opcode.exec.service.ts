import { Injectable } from '@nestjs/common';
import * as dgram from 'dgram';
import { Package, Message, Op } from '../../protos/package';

@Injectable()
export class OpcodeExecService {
	execDiscoveryPackage(pkg: Package, rinfo: dgram.RemoteInfo) {}
}
