# ristretto
Ristretto is a Peer to Peer lending platform where the debt is backed by friends, family or people that trust in the borrower.

The users can have different roles in the platform, they can be *Endorsers*, *Borrowers* or *Lenders*.

### Endorser
The endorsers are friends or family of the borrower, they
trust that the borrower is able to pay and is a honest person.
These users are the ones that takes the risk when an user
doesn't pay a debt, the risk is divided between all the
endorsers of a borrower.

*Actions*:
- Stake Money
- Endorse Users
- Earn interest money from honest borrower
- Close Debt

### Borrower
Borrowers are the users that require money. In order for a
borrower to request a lending they first need other users to
endorse them.

*Actions:*

- Receive Endorsement
- Request Lending
- Receive Money
- Repay Money + 5% Interest in less than 2 months
- Close Debt

### Lender
Lenders are the users that provide the money for a borrower,
they can analize if a borrower has many endorsers and are able
to provide the money for it's debt.

*Actions:*
- Lend Money
- Regain your Money plus an interest
- Close Debt

*If in two months the borrower doesn't pay anyone can call
Force Close Debt and the endorsers will pay the lending*

## Getting Started

Clone the project on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need truffle, ganache, truffle-hdwallet-provider, openzeppelin-solidity, dotenv and chai in order to run the project

```
npm install -g truffle
npm install -g ganache-cli
npm install
cd client
npm install
```

### Running and Testing

Run ganache application or the cli in order to start testing with the network

```
ganache-cli
```

Compile the project

```
truffle compile 
```

End with running the tests. Affogato uses Chai as an assertion library 

```
truffle test 
```

## Starting the client

Once the ganache is running you just need to start the client and start using the app with metamask in your favorite browser. Run the following commands:

```
cd client
npm start
``` 

## Deployment

### Local Testnet

With ganache running just migrate the project and you will be ready.

```
truffle migrate
``` 

### Rinkeby Testnet

Create a .env file with the following values:

```
MNENOMIC="MNEMONIC KEY OF ACCOUNT WITH RINKEBY ETH"
RINKEBY_API_URL="Rinkeby api URL"
``` 

Run migration with the rinkeby network

```
truffle migrate --network rinkeby
``` 

### POA Core

Create a .env file with the following values:

```
MNENOMIC_POA="MNEMONIC KEY OF ACCOUNT WITH POA"
``` 

Run migration with the poa network

```
truffle migrate --network poa
``` 
### xDAI Chain

Create a .env file with the following values:

```
MNENOMIC_XDAI="MNEMONIC KEY OF ACCOUNT WITH xDAI"
``` 

Run migration with the xdai network

```
truffle migrate --network xdai
``` 