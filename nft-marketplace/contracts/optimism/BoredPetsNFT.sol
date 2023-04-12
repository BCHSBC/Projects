// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Store tokenURLs on chain in storage -> allows us to store metadata (upload to IPFS off-chain)
// Counters for unique token id to each NFT

contract BoredPetsNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address marketplaceContract;
  event NFTMinted(uint256);

  constructor(address _marketplaceContract) ERC721("Bored Pets Yacht Club","BPYC") {
    marketplaceContract = _marketplaceContract;
  }

  // _tokenURI points to JSON metadata on IPFS
  function mint(string memory _tokenURI) public {
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();
    _safeMint(msg.sender,newTokenId);
    _setTokenURI(newTokenId, _tokenURI);
    setApprovalForAll(marketplaceContract, true);
    emit NFTMinted(newTokenId);
  }


}