// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationManager is Ownable {
    // Estrutura de dados de uma doação
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    // Lista de doações e total de doações recebidas
    Donation[] public donations;
    uint256 public totalDonations;

    event DonationReceived(address indexed donor, uint256 amount);

    // Função para receber uma doação
    function donate() public payable {
        require(msg.value > 0, "A doacao deve ser maior que zero");

        // Registro da doação
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp
        }));
        
        totalDonations += msg.value;

        emit DonationReceived(msg.sender, msg.value);
    }

    // Função para retirar fundos apenas pelo dono do contrato
    function withdraw(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Saldo insuficiente");
        payable(owner()).transfer(_amount);
    }

    // Visualizar doações
    function getDonationsCount() public view returns (uint256) {
        return donations.length;
    }
}
