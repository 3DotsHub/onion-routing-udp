// | Policy                           | Default   | Type    | Description                                                |
// | -------------------------------- | --------- | ------- | ---------------------------------------------------------- |
// | SignatureVerify              | true      | boolean | Verify TransportData with signature and publicKey          |
// | SelfifyPublicKeyDrop             | true      | boolean | Drop package if it uses the same publicKey as own identity |
// | SelfifyAddressPortDrop           | true      | boolean | Drop package if it comes from own origen                   |
// | TimeHashOutOfSyncDrop            | 0 (false) | number  | Amount of blockhashes allowed after latest blockhash       |
// | TransportOpcodeDiscoveryDrop     | false     | boolean | Drop all Transport packages addressing opcode DISCOVERY    |
// | TransportOpcodeDiscoveryResponse | 2         | number  | Number of random peers to response with                    |
// | TransportOpcodeEncryptedDrop     | false     | boolean | Drop all transport packages addressing opcode ENCRYPTED    |

// Transport Layer
export const SignatureVerify: boolean = true;
export const SelfifyPublicKeyDrop: boolean = true;
export const SelfifyAddressPortDrop: boolean = true;
export const TimeHashOutOfSyncDrop: number = 0;
export const TransportOpcodeDiscoveryDrop: boolean = false;
export const TransportOpcodeDiscoveryResponse: number = 2;
export const TransportOpcodeEncryptedDrop: boolean = false;
