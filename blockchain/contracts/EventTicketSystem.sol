// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EventTicketSystem is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Strings for uint256;

    uint256 private _eventIdCounter = 0;
    uint256 private _ticketIdCounter = 0;

    // ---------- DATA STRUCTURES ----------
    struct Event {
        uint256 id;
        string name;
        string description;
        uint256 startDate;
        uint256 endDate;
        address organizer;
        string venue;
        string location;
        uint256 totalTickets;
        uint256 ticketsSold;
        bool isActive;
        bool isCancelled;
        string metadataURI;
        uint256 royaltyPercentage;
        uint256 createdAt;
    }

    struct TicketTier {
        string name;
        uint256 price;
        uint256 maxSupply;
        uint256 sold;
        uint256 maxPerUser;
        bool isActive;
    }

    struct Ticket {
        uint256 id;
        uint256 eventId;
        address owner;
        uint256 tierIndex;
        uint256 price;
        bool isUsed;
        bool isValid;
        uint256 transferCount;
        uint256 mintedAt;
        string qrHash;
        bytes32 verificationHash;
    }

    // ---------- STATE VARIABLES ----------
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => TicketTier[]) public eventTiers;
    mapping(uint256 => mapping(address => bool)) public verifiedTickets;
    mapping(uint256 => mapping(address => uint256)) public ticketsPerUser;
    mapping(address => uint256[]) public userTickets;
    mapping(uint256 => bool) public usedTickets;
    mapping(uint256 => uint256) public maxResalePrice;
    mapping(uint256 => uint256) public eventRevenue;

    // ---------- EVENTS ----------
    event EventCreated(uint256 indexed eventId, address indexed organizer, string name);
    event TicketMinted(uint256 indexed ticketId, uint256 indexed eventId, address indexed owner);
    event TicketVerified(uint256 indexed ticketId, uint256 indexed eventId, address verifier);
    event TicketTransferred(uint256 indexed ticketId, address indexed from, address indexed to);
    event TicketRevoked(uint256 indexed ticketId, address indexed owner);
    event RefundIssued(uint256 indexed ticketId, address indexed owner, uint256 amount);
    event ResalePriceSet(uint256 indexed eventId, uint256 maxPrice);
    event RevenueWithdrawn(uint256 indexed eventId, address indexed organizer, uint256 amount);

    // ---------- MODIFIERS ----------
    modifier eventExists(uint256 _eventId) {
        require(events[_eventId].id != 0, "Event does not exist");
        _;
    }

    modifier eventActive(uint256 _eventId) {
        require(events[_eventId].isActive, "Event is not active");
        require(!events[_eventId].isCancelled, "Event is cancelled");
        _;
    }

    modifier ticketExists(uint256 _ticketId) {
        require(tickets[_ticketId].id != 0, "Ticket does not exist");
        _;
    }

    // ---------- CONSTRUCTOR ----------
    constructor() ERC721("EventTicket", "TKT") Ownable(msg.sender) {}

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================
    function createEvent(
        string memory _name,
        string memory _description,
        uint256 _startDate,
        uint256 _endDate,
        string memory _venue,
        string memory _location,
        uint256 _totalTickets,
        string memory _metadataURI,
        uint256 _royaltyPercentage
    ) external onlyOwner returns (uint256) {
        require(_startDate > block.timestamp, "Start date must be in future");
        require(_endDate > _startDate, "End date must be after start date");
        require(_totalTickets > 0, "Total tickets must be > 0");
        require(_royaltyPercentage <= 1000, "Royalty max 10%");

        _eventIdCounter++;
        uint256 eventId = _eventIdCounter;

        events[eventId] = Event({
            id: eventId,
            name: _name,
            description: _description,
            startDate: _startDate,
            endDate: _endDate,
            organizer: msg.sender,
            venue: _venue,
            location: _location,
            totalTickets: _totalTickets,
            ticketsSold: 0,
            isActive: true,
            isCancelled: false,
            metadataURI: _metadataURI,
            royaltyPercentage: _royaltyPercentage,
            createdAt: block.timestamp
        });

        emit EventCreated(eventId, msg.sender, _name);
        return eventId;
    }

    function addTicketTier(
        uint256 _eventId,
        string memory _name,
        uint256 _price,
        uint256 _maxSupply,
        uint256 _maxPerUser
    ) external onlyOwner eventExists(_eventId) eventActive(_eventId) {
        require(_maxSupply > 0, "Max supply must be > 0");
        require(_price > 0, "Price must be > 0");

        eventTiers[_eventId].push(TicketTier({
            name: _name,
            price: _price,
            maxSupply: _maxSupply,
            sold: 0,
            maxPerUser: _maxPerUser,
            isActive: true
        }));
    }

    function setResalePriceCap(uint256 _eventId, uint256 _maxPrice) 
        external 
        onlyOwner 
        eventExists(_eventId) 
    {
        maxResalePrice[_eventId] = _maxPrice;
        emit ResalePriceSet(_eventId, _maxPrice);
    }

    function cancelEvent(uint256 _eventId) 
        external 
        onlyOwner 
        eventExists(_eventId) 
        eventActive(_eventId) 
    {
        events[_eventId].isActive = false;
        events[_eventId].isCancelled = true;
    }

    // ============================================
    // USER FUNCTIONS
    // ============================================
    function purchaseTicket(
        uint256 _eventId,
        uint256 _tierIndex
    ) external payable nonReentrant eventExists(_eventId) eventActive(_eventId) returns (uint256) {
        Event storage eventData = events[_eventId];
        require(block.timestamp < eventData.startDate, "Event already started");
        require(eventData.ticketsSold < eventData.totalTickets, "Event sold out");

        TicketTier storage tier = eventTiers[_eventId][_tierIndex];
        require(tier.isActive, "Tier not active");
        require(tier.sold < tier.maxSupply, "Tier sold out");
        require(msg.value >= tier.price, "Insufficient payment");
        require(
            ticketsPerUser[_eventId][msg.sender] < tier.maxPerUser,
            "Exceeded max tickets per user"
        );

        _ticketIdCounter++;
        uint256 ticketId = _ticketIdCounter;

        _safeMint(msg.sender, ticketId);

        bytes32 verificationHash = keccak256(abi.encodePacked(
            ticketId,
            _eventId,
            msg.sender,
            block.timestamp,
            block.prevrandao
        ));

        tickets[ticketId] = Ticket({
            id: ticketId,
            eventId: _eventId,
            owner: msg.sender,
            tierIndex: _tierIndex,
            price: tier.price,
            isUsed: false,
            isValid: true,
            transferCount: 0,
            mintedAt: block.timestamp,
            qrHash: "",
            verificationHash: verificationHash
        });

        tier.sold++;
        eventData.ticketsSold++;
        eventRevenue[_eventId] += tier.price;
        ticketsPerUser[_eventId][msg.sender]++;
        userTickets[msg.sender].push(ticketId);

        _setTokenURI(ticketId, _generateTicketMetadataURI(ticketId, _eventId));

        if (msg.value > tier.price) {
            payable(msg.sender).transfer(msg.value - tier.price);
        }

        emit TicketMinted(ticketId, _eventId, msg.sender);
        return ticketId;
    }

    function _generateTicketMetadataURI(uint256 _ticketId, uint256 _eventId) 
        internal 
        view 
        returns (string memory) 
    {
        return string(abi.encodePacked(
            "data:application/json,",
            '{"name":"Event Ticket #',
            _ticketId.toString(),
            '","event":"',
            events[_eventId].name,
            '","attributes":[{"trait_type":"Event ID","value":"',
            _eventId.toString(),
            '"}]}'
        ));
    }

    // ============================================
    // VERIFICATION FUNCTIONS
    // ============================================
    function verifyTicket(uint256 _ticketId, address _verifier) 
        external 
        nonReentrant 
        ticketExists(_ticketId) 
        returns (bool) 
    {
        Ticket storage ticket = tickets[_ticketId];
        Event storage eventData = events[ticket.eventId];

        require(msg.sender == owner() || msg.sender == eventData.organizer, "Unauthorized verifier");
        require(ticket.isValid, "Ticket invalid");
        require(!ticket.isUsed, "Ticket already used");
        require(block.timestamp >= eventData.startDate, "Event not started");
        require(block.timestamp <= eventData.endDate, "Event ended");
        require(ownerOf(_ticketId) == ticket.owner, "Owner mismatch");

        ticket.isUsed = true;
        usedTickets[_ticketId] = true;
        verifiedTickets[ticket.eventId][ticket.owner] = true;

        emit TicketVerified(_ticketId, ticket.eventId, _verifier != address(0) ? _verifier : msg.sender);
        return true;
    }

    function checkTicketValidity(uint256 _ticketId) 
        external 
        view 
        ticketExists(_ticketId) 
        returns (bool isValid, bool isUsed, address owner, uint256 eventId) 
    {
        Ticket storage ticket = tickets[_ticketId];
        return (
            ticket.isValid,
            ticket.isUsed,
            ticket.owner,
            ticket.eventId
        );
    }

    // ============================================
    // TRANSFER FUNCTIONS
    // ============================================
    function transferTicket(uint256 _ticketId, address _to) 
        external 
        nonReentrant 
        ticketExists(_ticketId) 
    {
        Ticket storage ticket = tickets[_ticketId];
        
        require(ticket.owner == msg.sender, "Not ticket owner");
        require(!ticket.isUsed, "Ticket already used");
        require(ticket.isValid, "Ticket invalid");
        require(_to != address(0), "Invalid address");

        ticket.owner = _to;
        ticket.transferCount++;

        safeTransferFrom(msg.sender, _to, _ticketId);

        emit TicketTransferred(_ticketId, msg.sender, _to);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) {
        Ticket storage ticket = tickets[tokenId];
        require(!ticket.isUsed, "Cannot transfer used ticket");
        require(ticket.isValid, "Cannot transfer invalid ticket");
        super.transferFrom(from, to, tokenId);
    }

    // ============================================
    // REFUND FUNCTIONS
    // ============================================
    function requestRefund(uint256 _ticketId) 
        external 
        nonReentrant 
        ticketExists(_ticketId) 
    {
        Ticket storage ticket = tickets[_ticketId];
        Event storage eventData = events[ticket.eventId];

        require(eventData.isCancelled, "Event not cancelled");
        require(ticket.owner == msg.sender, "Not ticket owner");
        require(!ticket.isUsed, "Ticket already used");
        require(ticket.isValid, "Ticket invalid");

        uint256 refundAmount = ticket.price;
        ticket.isValid = false;

        payable(msg.sender).transfer(refundAmount);
        
        emit RefundIssued(_ticketId, msg.sender, refundAmount);
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================
    function getUserTickets(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userTickets[_user];
    }

    function getTicketDetails(uint256 _ticketId) 
        external 
        view 
        ticketExists(_ticketId) 
        returns (Ticket memory) 
    {
        return tickets[_ticketId];
    }

    function getEventDetails(uint256 _eventId) 
        external 
        view 
        eventExists(_eventId) 
        returns (Event memory) 
    {
        return events[_eventId];
    }

    function getEventTiers(uint256 _eventId) 
        external 
        view 
        eventExists(_eventId) 
        returns (TicketTier[] memory) 
    {
        return eventTiers[_eventId];
    }

    function getUserTicketCount(uint256 _eventId, address _user) 
        external 
        view 
        returns (uint256) 
    {
        return ticketsPerUser[_eventId][_user];
    }

    function isTicketUsed(uint256 _ticketId) 
        external 
        view 
        ticketExists(_ticketId) 
        returns (bool) 
    {
        return tickets[_ticketId].isUsed;
    }

    // ============================================
    // OVERRIDES - SIMPLIFIED FOR v5
    // ============================================
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function getContractBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    function getEventRevenue(uint256 _eventId) external view eventExists(_eventId) returns (uint256) {
        return eventRevenue[_eventId];
    }

    function withdrawEventRevenue(uint256 _eventId) external nonReentrant eventExists(_eventId) {
        Event storage eventData = events[_eventId];
        require(msg.sender == eventData.organizer || msg.sender == owner(), "Not event organizer");
        uint256 amount = eventRevenue[_eventId];
        require(amount > 0, "No revenue available to withdraw");

        eventRevenue[_eventId] = 0;
        payable(msg.sender).transfer(amount);

        emit RevenueWithdrawn(_eventId, msg.sender, amount);
    }

    function withdraw(uint256 _amount) external onlyOwner {
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(owner()).transfer(_amount);
    }
}