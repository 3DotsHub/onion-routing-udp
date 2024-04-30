import { Module } from '@nestjs/common';
import { CryptoKeyPairService } from './crypto.keypair.service';

@Module({
	providers: [CryptoKeyPairService],
	exports: [CryptoKeyPairService],
})
export class CryptoModule {}
