## Modules

### Peer

-   bootstrapping peers
-   OP_GETPEER

#### Opcodes

```
type Peer = {
	pubkey: string;
	address: string;
	port: number;
}

OP_GETPEER: Inputs: null, Output: Peer[]
```

#### Coding

```
private readonly peers: Peer[] = [...bootstrapping];

// asks network for peers
getPeers(): Peer[];

// stores peers, logic: desicion making, who to store or drop
storePeers(peers: Peer[]): bool;
```

### onion

-   circuit
-   OP_PACKAGE

### crypto

-   encryption
-   priv/pubkey encryption

### hiddenservice

-   OP_SETMEETUP
