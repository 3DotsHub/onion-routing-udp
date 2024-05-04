# Transport Protocol

With protobuf

```
enum OpTransport {
    DISCOVERY = 0;
    ENCRYPTED = 1;
}

message SignedPackage {
    TransportData transportData = 1;
    string publicKey = 2;
    string signature = 3;
}

message TransportData {
    OpTransport opTransport = 1;
    bytes opData = 2;
    string timeHash = 3;
}
```

## Description

#### SignedPackage

SignedPackage acts as a wrapper to wrap the TransportData and attaches a signature to the TransportData and a publicKey. This should make sure that, noone is changing your transport packages. Verify: signature of sha256(transportData) from publicKey?

#### TransportData

Will include an transport package opcode for execution, message data and timeHash.

#### OpData

All relevant data, to run opcode.

#### timeHash

Latest bitcoin block hash. Could be used for "out of sync" drop policy.
Will prevent to sign packages, from the future. Past is still possible, because older block hashes are known, however, you can prevent them to be accepted e.g. older then 10 block hashes from the current best chain will be dropped due to "out of sync with the bitcoin main blockchain".

## Policies

| Policy                           | Default   | Type    | Description                                                |
| -------------------------------- | --------- | ------- | ---------------------------------------------------------- |
| SignatureVerifyDrop              | true      | boolean | Verify TransportData with signature and publicKey          |
| SelfifyPublicKeyDrop             | true      | boolean | Drop package if it uses the same publicKey as own identity |
| SelfifyAddressPortDrop           | true      | boolean | Drop package if it comes from own origen                   |
| TimeHashOutOfSyncDrop            | 0 (false) | number  | Amount of blockhashes allowed after latest blockhash       |
| TransportOpcodeDiscoveryDrop     | false     | boolean | Drop all Transport packages addressing opcode DISCOVERY    |
| TransportOpcodeDiscoveryResponse | 2         | number  | Number of random peers to response with                    |
| TransportOpcodeEncryptedDrop     | false     | boolean | Drop all transport packages addressing opcode ENCRYPTED    |

--> see app.config.ts

## Transport Layer

### Types

```
type SignedPackage = {
	transportData: bytes,
	signature: string,
	publicKey: string
}

type TransportData = {
	opTransport: OPCODE;
	opData: bytes;
	timeHash: string;
}
```

### Actions for receiving a SignedPackage

#### Verify signature of TransportData via publicKey

-   Read from binary into protobuf SignedPackage
-   Read transportData into Buffer in hex
-   Read signature into Buffer in hex
-   Read publicKey into Buffer in hex
-   Take sha265 hash of transportData and output hash as Buffer in hex
-   verify hash of transportData with publicKey and signature

#### Verify package received from self

-   Read publicKey, address, port
-   Drop policy same publicKey
-   Drop policy same addess and port

#### Execute transportData Opcode

-   Each SignedPackage got an transport opcode
-   Execution in runtime

### Actions for creating a SignedPackage

#### Create TransportData for wrapping

```
const transportData: TransportData = {
	opTransport: OpTransport.DISCOVERY,
	message: [], // not needed for discovery
	timeHash: [], // not enforce so far
}

// or just
const transportData: TransportData = {
	opTransport: OpTransport.DISCOVERY
}
```

#### signTransportData function

-   sha256 hash of TransportData
-   sign hash with identity
-   create signedPackage with, TransportData, Signature and PublicKey

```
// function for hashing data, and providing a signature from its own identity.
signTransportData(transportData: TransportData): SignedPackage:

// create signedPackage
const signedPackage: SignedPackage = this.cryptoKeyPairService.signTransportData(transportData);
```

## Execution of Opcodes

### DISCOVERY

Will be use for bootstrapping a peer in an "unencrypted" layer to exchange verifyed peers.

-   publicKey from SignedPackage
-   ip address and port from UDP Socket
-   check if peer is known in verifiedPeer list
-   [policy] to accept peer to be added to the verifiedPeer list
-   [policy] to return a message with other peers

### ENCRYPTED

Will be used for encrypted routing messenges.
