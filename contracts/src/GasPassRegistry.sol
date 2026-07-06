// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title GasPassRegistry
 * @notice On-chain registry for gasless transaction sponsor policies on BOT Chain.
 *         Integrates with BOT Chain's EOA Paymaster (MegaFuel) to enable
 *         gasless transactions for regular externally-owned accounts.
 *
 * @dev Built for BOT Chain Builder Challenge #1
 *      Leverages: EOA Paymaster, Blob API, 0.75s blocks, near-zero fees
 *
 * Key design decisions:
 * - Sponsors pre-fund a gas pool (payable function)
 * - Per-policy daily spend caps with automatic reset
 * - Covered contracts whitelist for security
 * - All state changes emit events for off-chain indexing
 * - Sponsor stats are queryable for dashboard UIs
 */
contract GasPassRegistry {
    // ─── Errors ───────────────────────────────────────────────────────────
    error PolicyNotFound(string policyName);
    error PolicyAlreadyExists(string policyName);
    error NotPolicyOwner(address caller, address owner);
    error DailyCapExceeded(string policyName, uint256 spent, uint256 cap);
    error InsufficientGasPool(string policyName, uint256 available, uint256 required);
    error ContractNotCovered(string policyName, address contractAddr);
    error ZeroAddress();

    // ─── Structs ──────────────────────────────────────────────────────────

    struct SponsorPolicy {
        address owner;           // Who manages this policy
        uint256 dailyCap;        // Max BOT to sponsor per day (in wei)
        uint256 dailySpent;      // BOT spent today
        uint256 lastResetDay;    // Timestamp of last daily reset
        uint256 gasPool;         // Pre-funded BOT for sponsorship
        bool active;             // Whether policy is accepting txs
    }

    struct CoveredContract {
        bool isCovered;          // Is this contract covered?
        uint256 maxGasPerTx;     // Max gas per single tx (0 = unlimited)
        uint256 txCount;         // Lifetime sponsored tx count
    }

    struct SponsorStats {
        uint256 totalSponsored;
        uint256 totalTxs;
        uint256 dailySpent;
        uint256 dailyCap;
        uint256 gasPool;
        bool active;
    }

    // ─── State ────────────────────────────────────────────────────────────

    mapping(string => SponsorPolicy) public policies;
    mapping(string => mapping(address => CoveredContract)) public coveredContracts;
    mapping(address => uint256) public userSponsoredTotal;
    mapping(address => uint256) public userSponsoredCount;

    // ─── Events ───────────────────────────────────────────────────────────

    event PolicyRegistered(string indexed policyName, address indexed owner, uint256 dailyCap);
    event PolicyUpdated(string indexed policyName, uint256 newDailyCap, bool active);
    event ContractCovered(string indexed policyName, address indexed contractAddr, uint256 maxGasPerTx);
    event GasPoolFunded(string indexed policyName, uint256 amount, uint256 newBalance);
    event SponsorshipRecorded(
        string indexed policyName,
        address indexed sender,
        address indexed contractAddr,
        uint256 gasUsed,
        uint256 costWei
    );
    event GasPoolWithdrawn(string indexed policyName, address indexed to, uint256 amount);

    // ─── Modifiers ────────────────────────────────────────────────────────

    modifier policyExists(string calldata policyName) {
        if (policies[policyName].owner == address(0)) revert PolicyNotFound(policyName);
        _;
    }

    modifier onlyPolicyOwner(string calldata policyName) {
        if (policies[policyName].owner != msg.sender) {
            revert NotPolicyOwner(msg.sender, policies[policyName].owner);
        }
        _;
    }

    // ─── Policy Management ────────────────────────────────────────────────

    /**
     * @notice Register a new sponsor policy
     * @param policyName Unique name for the policy (used in pm_isSponsorable)
     * @param dailyCap Maximum BOT to sponsor per day (in wei)
     */
    function registerSponsor(string calldata policyName, uint256 dailyCap) external {
        if (policies[policyName].owner != address(0)) revert PolicyAlreadyExists(policyName);
        if (bytes(policyName).length == 0) revert PolicyAlreadyExists("");

        policies[policyName] = SponsorPolicy({
            owner: msg.sender,
            dailyCap: dailyCap,
            dailySpent: 0,
            lastResetDay: block.timestamp,
            gasPool: 0,
            active: true
        });

        emit PolicyRegistered(policyName, msg.sender, dailyCap);
    }

    /**
     * @notice Update policy settings (owner only)
     */
    function updatePolicy(
        string calldata policyName,
        uint256 newDailyCap,
        bool active
    ) external policyExists(policyName) onlyPolicyOwner(policyName) {
        SponsorPolicy storage policy = policies[policyName];
        _resetDailyIfNeeded(policy);
        policy.dailyCap = newDailyCap;
        policy.active = active;

        emit PolicyUpdated(policyName, newDailyCap, active);
    }

    /**
     * @notice Add a contract to the covered list for a policy
     * @param maxGasPerTx 0 = no limit, otherwise caps gas per sponsored tx
     */
    function coverContract(
        string calldata policyName,
        address contractAddr,
        uint256 maxGasPerTx
    ) external policyExists(policyName) onlyPolicyOwner(policyName) {
        if (contractAddr == address(0)) revert ZeroAddress();

        coveredContracts[policyName][contractAddr] = CoveredContract({
            isCovered: true,
            maxGasPerTx: maxGasPerTx,
            txCount: 0
        });

        emit ContractCovered(policyName, contractAddr, maxGasPerTx);
    }

    /**
     * @notice Remove a contract from covered list
     */
    function uncoverContract(
        string calldata policyName,
        address contractAddr
    ) external policyExists(policyName) onlyPolicyOwner(policyName) {
        delete coveredContracts[policyName][contractAddr];
    }

    // ─── Gas Pool ─────────────────────────────────────────────────────────

    /**
     * @notice Fund the gas pool for a policy
     */
    function fundGasPool(string calldata policyName) external payable policyExists(policyName) {
        SponsorPolicy storage policy = policies[policyName];
        policy.gasPool += msg.value;

        emit GasPoolFunded(policyName, msg.value, policy.gasPool);
    }

    /**
     * @notice Withdraw from gas pool (owner only)
     */
    function withdrawFromPool(
        string calldata policyName,
        uint256 amount
    ) external policyExists(policyName) onlyPolicyOwner(policyName) {
        SponsorPolicy storage policy = policies[policyName];
        if (amount > policy.gasPool) revert InsufficientGasPool(policyName, policy.gasPool, amount);

        policy.gasPool -= amount;
        payable(msg.sender).transfer(amount);

        emit GasPoolWithdrawn(policyName, msg.sender, amount);
    }

    // ─── Sponsorship Logic ────────────────────────────────────────────────

    /**
     * @notice Check if a transaction is sponsorable under a policy
     * @dev Called by the SDK before sending a gasless tx
     */
    function isSponsorable(
        string calldata policyName,
        address /* sender */,
        address contractAddr
    ) external view policyExists(policyName) returns (bool) {
        SponsorPolicy storage policy = policies[policyName];
        if (!policy.active) return false;

        CoveredContract storage cc = coveredContracts[policyName][contractAddr];
        if (!cc.isCovered) return false;

        return true;
    }

    /**
     * @notice Get the max gas per tx for a covered contract (0 = unlimited)
     */
    function getMaxGasPerTx(
        string calldata policyName,
        address contractAddr
    ) external view returns (uint256) {
        return coveredContracts[policyName][contractAddr].maxGasPerTx;
    }

    /**
     * @notice Record a successful sponsorship (called by relay service)
     * @dev This should be called by the paymaster relay after a successful
     *      bundle inclusion. In production, this is triggered by the
     *      Paymaster's callback mechanism.
     */
    function recordSponsorship(
        string calldata policyName,
        address sender,
        address contractAddr,
        uint256 gasUsed,
        uint256 gasPrice
    ) external {
        SponsorPolicy storage policy = policies[policyName];
        _resetDailyIfNeeded(policy);

        uint256 cost = gasUsed * gasPrice;
        if (cost > policy.gasPool) revert InsufficientGasPool(policyName, policy.gasPool, cost);
        if (policy.dailySpent + cost > policy.dailyCap) {
            revert DailyCapExceeded(policyName, policy.dailySpent + cost, policy.dailyCap);
        }

        policy.gasPool -= cost;
        policy.dailySpent += cost;

        CoveredContract storage cc = coveredContracts[policyName][contractAddr];
        cc.txCount++;

        userSponsoredTotal[sender] += cost;
        userSponsoredCount[sender]++;

        emit SponsorshipRecorded(policyName, sender, contractAddr, gasUsed, cost);
    }

    // ─── View Functions ───────────────────────────────────────────────────

    /**
     * @notice Get comprehensive stats for a sponsor policy
     */
    function getSponsorStats(string calldata policyName)
        external
        view
        policyExists(policyName)
        returns (SponsorStats memory)
    {
        SponsorPolicy storage policy = policies[policyName];
        return SponsorStats({
            totalSponsored: _estimateTotalSponsored(policy),
            totalTxs: _countTotalTxs(policyName),
            dailySpent: policy.dailySpent,
            dailyCap: policy.dailyCap,
            gasPool: policy.gasPool,
            active: policy.active
        });
    }

    /**
     * @notice Get all policy names (for dashboard UIs)
     */
    function getPolicyOwner(string calldata policyName) external view returns (address) {
        return policies[policyName].owner;
    }

    // ─── Internal Helpers ─────────────────────────────────────────────────

    function _resetDailyIfNeeded(SponsorPolicy storage policy) internal {
        uint256 currentDay = block.timestamp / 1 days;
        uint256 lastResetDay = policy.lastResetDay / 1 days;
        if (currentDay > lastResetDay) {
            policy.dailySpent = 0;
            policy.lastResetDay = block.timestamp;
        }
    }

    function _estimateTotalSponsored(SponsorPolicy storage policy) internal view returns (uint256) {
        // dailySpent resets, so this is a rough estimate based on gasPool reduction
        // In production, track cumulative via events
        return policy.dailySpent;
    }

    function _countTotalTxs(string memory /* policyName */) internal pure returns (uint256) {
        // Iteration over mapping not possible; this is tracked via events off-chain
        // Returning 0 as on-chain iteration over coveredContracts is gas-prohibitive
        return 0;
    }

    // ─── Fallback ─────────────────────────────────────────────────────────

    receive() external payable {
        // Accept BOT for gas pool funding via plain transfer
    }
}
