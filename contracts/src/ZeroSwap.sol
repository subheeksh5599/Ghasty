// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ZeroSwap
 * @notice A minimal gasless DEX demo built on BOT Chain's EOA Paymaster.
 *         Users can swap, approve, and add liquidity WITHOUT holding any BOT.
 *
 * @dev This contract is designed to be covered by a Ghasty sponsor policy.
 *      All user-facing functions are external and emit events for the
 *      Ghasty SDK to detect and sponsor.
 *
 *      Built for BOT Chain Builder Challenge #1.
 */
contract ZeroSwap {
    // ─── Errors ───────────────────────────────────────────────────────────
    error InsufficientLiquidity();
    error InsufficientOutput();
    error InsufficientInput();
    error TransferFailed();

    // ─── Events ───────────────────────────────────────────────────────────
    event Swapped(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event LiquidityAdded(address indexed provider, address token, uint256 amount);
    event Approved(address indexed owner, address indexed spender, uint256 amount);

    // ─── State ────────────────────────────────────────────────────────────
    mapping(address => uint256) public liquidity; // token -> amount

    uint256 public constant FEE_BPS = 30; // 0.3%
    uint256 public constant BPS_DENOMINATOR = 10000;

    // ─── Gasless Swap ─────────────────────────────────────────────────────

    /**
     * @notice Swap one token for another via the pool
     * @dev User sends tokenIn to contract; contract sends tokenOut back.
     *      With EOA Paymaster, the user pays ZERO gas.
     *      The sponsor (via GasPassRegistry) covers the gas cost.
     */
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external returns (uint256 amountOut) {
        if (amountIn == 0) revert InsufficientInput();

        // Transfer tokenIn from user to pool
        (bool successIn) = _transferFrom(tokenIn, msg.sender, address(this), amountIn);
        if (!successIn) revert TransferFailed();

        // Calculate output (constant product AMM simplified)
        uint256 reserveIn = liquidity[tokenIn] + amountIn;
        uint256 reserveOut = liquidity[tokenOut];
        uint256 amountInWithFee = amountIn * (BPS_DENOMINATOR - FEE_BPS) / BPS_DENOMINATOR;
        amountOut = (amountInWithFee * reserveOut) / reserveIn;

        if (amountOut < minAmountOut) revert InsufficientOutput();
        if (amountOut > liquidity[tokenOut]) revert InsufficientLiquidity();

        // Update reserves
        liquidity[tokenIn] = reserveIn;
        liquidity[tokenOut] = reserveOut - amountOut;

        // Transfer tokenOut to user
        (bool successOut) = _transfer(tokenOut, msg.sender, amountOut);
        if (!successOut) revert TransferFailed();

        emit Swapped(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    // ─── Gasless Approval ─────────────────────────────────────────────────

    /**
     * @notice Approve a spender for a token — gasless
     * @dev Standard ERC20 approve, but sponsored via EOA Paymaster
     */
    function gaslessApprove(address token, address spender, uint256 amount) external {
        (bool success) = _approve(token, spender, amount);
        if (!success) revert TransferFailed();

        emit Approved(msg.sender, spender, amount);
    }

    // ─── Gasless Add Liquidity ────────────────────────────────────────────

    /**
     * @notice Add liquidity to the pool — gasless
     */
    function addLiquidity(address token, uint256 amount) external {
        if (amount == 0) revert InsufficientInput();

        (bool success) = _transferFrom(token, msg.sender, address(this), amount);
        if (!success) revert TransferFailed();

        liquidity[token] += amount;

        emit LiquidityAdded(msg.sender, token, amount);
    }

    // ─── View Functions ───────────────────────────────────────────────────

    /**
     * @notice Get expected output for a swap
     */
    function getSwapAmount(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256) {
        uint256 reserveIn = liquidity[tokenIn] + amountIn;
        uint256 reserveOut = liquidity[tokenOut];
        uint256 amountInWithFee = amountIn * (BPS_DENOMINATOR - FEE_BPS) / BPS_DENOMINATOR;
        return (amountInWithFee * reserveOut) / reserveIn;
    }

    // ─── Internal ─────────────────────────────────────────────────────────

    function _transfer(address token, address to, uint256 amount) internal returns (bool) {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", to, amount)
        );
        return success && (data.length == 0 || abi.decode(data, (bool)));
    }

    function _transferFrom(
        address token,
        address from,
        address to,
        uint256 amount
    ) internal returns (bool) {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("transferFrom(address,address,uint256)", from, to, amount)
        );
        return success && (data.length == 0 || abi.decode(data, (bool)));
    }

    function _approve(address token, address spender, uint256 amount) internal returns (bool) {
        (bool success, bytes memory data) = token.call(
            abi.encodeWithSignature("approve(address,uint256)", spender, amount)
        );
        return success && (data.length == 0 || abi.decode(data, (bool)));
    }
}
