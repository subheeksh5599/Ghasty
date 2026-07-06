// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {ZeroSwap} from "../src/ZeroSwap.sol";

// Mock ERC20 token for testing
contract MockToken {
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        if (balanceOf[msg.sender] < amount) return false;
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        if (balanceOf[from] < amount) return false;
        if (allowance[from][msg.sender] < amount) return false;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        return true;
    }
}

contract ZeroSwapTest is Test {
    ZeroSwap public swap;
    MockToken public tokenA;
    MockToken public tokenB;
    address public user = makeAddr("user");

    function setUp() public {
        swap = new ZeroSwap();
        tokenA = new MockToken();
        tokenB = new MockToken();

        // Fund user with tokens
        tokenA.mint(user, 1000 ether);
        tokenB.mint(user, 1000 ether);

        // Add liquidity to the pool
        tokenA.mint(address(this), 100 ether);
        tokenB.mint(address(this), 100 ether);
        tokenA.approve(address(swap), 100 ether);
        tokenB.approve(address(swap), 100 ether);
        swap.addLiquidity(address(tokenA), 100 ether);
        swap.addLiquidity(address(tokenB), 100 ether);
    }

    function testAddLiquidity() public {
        tokenA.mint(user, 10 ether);
        vm.prank(user);
        tokenA.approve(address(swap), 10 ether);

        vm.prank(user);
        swap.addLiquidity(address(tokenA), 10 ether);

        uint256 liq = swap.liquidity(address(tokenA));
        assertEq(liq, 110 ether);
    }

    function testSwap() public {
        uint256 amountIn = 1 ether;

        vm.startPrank(user);
        tokenA.approve(address(swap), amountIn);

        uint256 expectedOut = swap.getSwapAmount(address(tokenA), address(tokenB), amountIn);
        uint256 amountOut = swap.swap(address(tokenA), address(tokenB), amountIn, expectedOut * 99 / 100);
        vm.stopPrank();

        assertTrue(amountOut > 0);
        assertGe(amountOut, expectedOut * 99 / 100);
    }

    function testGaslessApprove() public {
        vm.prank(user);
        swap.gaslessApprove(address(tokenA), address(this), 100 ether);

        // ZeroSwap contract calls approve on behalf of user; allowance is ZeroSwap -> spender
        uint256 allowanceAmount = tokenA.allowance(address(swap), address(this));
        assertEq(allowanceAmount, 100 ether);
    }

    function testGetSwapAmount() public view {
        uint256 amount = swap.getSwapAmount(address(tokenA), address(tokenB), 1 ether);
        assertTrue(amount > 0);
    }

    function testInsufficientInput() public {
        vm.prank(user);
        vm.expectRevert(ZeroSwap.InsufficientInput.selector);
        swap.swap(address(tokenA), address(tokenB), 0, 0);
    }
}
