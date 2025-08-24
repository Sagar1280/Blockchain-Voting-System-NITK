// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Ownable {
    address public owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    constructor() {
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Ownable: caller is not the owner");
        _;
    }
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Invalid owner");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract CollegeVoting is Ownable {
    mapping(bytes32 => bool) public hasVoted;
    string[] private encryptedVotes;
    bytes32[] private rollHashes;

    event Voted(bytes32 indexed rollHash, string encryptedChoice);
    event Reset();

    function submitVote(bytes32 rollHash, string calldata encryptedChoice) external {
        require(!hasVoted[rollHash], "Already voted");
        hasVoted[rollHash] = true;
        rollHashes.push(rollHash);
        encryptedVotes.push(encryptedChoice);
        emit Voted(rollHash, encryptedChoice);
    }

    function totalVotes() external view returns (uint256) {
        return encryptedVotes.length;
    }

    function hasVotedFor(bytes32 rollHash) external view returns (bool) {
        return hasVoted[rollHash];
    }

    function getAllEncryptedVotes() external view onlyOwner returns (bytes32[] memory, string[] memory) {
        return (rollHashes, encryptedVotes);
    }

    function resetElection() external onlyOwner {
        for (uint i = 0; i < rollHashes.length; i++) {
            hasVoted[rollHashes[i]] = false;
        }
        delete rollHashes;
        delete encryptedVotes;
        emit Reset();
    }
}
