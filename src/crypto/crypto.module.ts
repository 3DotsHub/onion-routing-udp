import { Module } from '@nestjs/common';
import { CryptoKeyPairService } from './crypto.keypair.service';
import { CryptoEncryptService } from './crypto.encrypt.service';

@Module({
	providers: [CryptoKeyPairService, CryptoEncryptService],
	exports: [CryptoKeyPairService, CryptoEncryptService],
})
export class CryptoModule {}
