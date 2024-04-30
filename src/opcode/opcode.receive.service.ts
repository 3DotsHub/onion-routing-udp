import { Injectable } from '@nestjs/common';
import { Package, Message, Op } from '../../protos/package';

@Injectable()
export class OpcodeReceiveService {
	constructor() {}

	DISCOVERY() {
		console.log('DISCOVERY');
	}
}
