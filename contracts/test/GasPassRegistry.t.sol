// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {GasPassRegistry} from "../src/GasPassRegistry.sol";

contract GasPassRegistryTest is Test {
    GasPassRegistry public registry;
    address public sponsor = makeAddr("sponsor");
    address public user = makeAddr("user");
    address public dapp = makeAddr("dapp");

    string constant POLICY_NAME = "test-policy";

    function setUp() public {
        vm.prank(sponsor);
        registry = new GasPassRegistry();
    }

    function testRegisterSponsor() public {
        vm.prank(sponsor);
        registry.registerSponsor(POLICY_NAME, 1 ether);

        (address owner, uint256 cap, , , , bool active) = registry.policies(POLICY_NAME);
        assertEq(owner, sponsor);
        assertEq(cap, 1 ether);
        assertTrue(active);
    }

    function testCannotRegisterDuplicatePolicy() public {
        vm.startPrank(sponsor);
        registry.registerSponsor(POLICY_NAME, 1 ether);

        vm.expectRevert(
            abi.encodeWithSelector(GasPassRegistry.PolicyAlreadyExists.selector, POLICY_NAME)
        );
        registry.registerSponsor(POLICY_NAME, 1 ether);
        vm.stopPrank();
    }

    function testCoverContract() public {
        vm.startPrank(sponsor);
        registry.registerSponsor(POLICY_NAME, 1 ether);
        registry.coverContract(POLICY_NAME, dapp, 300000);

        (bool covered, uint256 maxGas,) = registry.coveredContracts(POLICY_NAME, dapp);
        assertTrue(covered);
        assertEq(maxGas, 300000);
        vm.stopPrank();
    }

    function testIsSponsorable() public {
        vm.startPrank(sponsor);
        registry.registerSponsor(POLICY_NAME, 1 ether);
        registry.coverContract(POLICY_NAME, dapp, 300000);
        vm.stopPrank();

        bool result = registry.isSponsorable(POLICY_NAME, user, dapp);
        assertTrue(result);
    }

    function testNotSponsorableForUncoveredContract() public {
        vm.prank(sponsor);
        registry.registerSponsor(POLICY_NAME, 1 ether);

        bool result = registry.isSponsorable(POLICY_NAME, user, dapp);
        assertFalse(result);
    }

    function testFundGasPool() public {
        vm.startPrank(sponsor);
        registry.registerSponsor(POLICY_NAME, 1 ether);
        vm.deal(sponsor, 10 ether);
        registry.fundGasPool{value: 5 ether}(POLICY_NAME);

        (,,,, uint256 pool,) = registry.policies(POLICY_NAME);
        assertEq(pool, 5 ether);
        vm.stopPrank();
    }

    function testRecordSponsorship() public {
        vm.startPrank(sponsor);
        registry.registerSponsor(POLICY_NAME, 10 ether);
        registry.coverContract(POLICY_NAME, dapp, 0);
        vm.deal(sponsor, 10 ether);
        registry.fundGasPool{value: 5 ether}(POLICY_NAME);
        vm.stopPrank();

        // Simulate relay recording a sponsorship
        vm.prank(address(this));
        registry.recordSponsorship(POLICY_NAME, user, dapp, 100000, 1 gwei);

        uint256 sponsored = registry.userSponsoredTotal(user);
        assertEq(sponsored, 100000 * 1 gwei);
    }

    function testDailyCapExceeded() public {
        vm.startPrank(sponsor);
        registry.registerSponsor(POLICY_NAME, 0.001 ether);
        registry.coverContract(POLICY_NAME, dapp, 0);
        vm.deal(sponsor, 10 ether);
        registry.fundGasPool{value: 1 ether}(POLICY_NAME);
        vm.stopPrank();

        vm.prank(address(this));
        // 100000 gas * 100 gwei = 0.01 ether > 0.001 ether cap
        vm.expectRevert();
        registry.recordSponsorship(POLICY_NAME, user, dapp, 100000, 100 gwei);
    }

    function testOnlyPolicyOwnerCanUpdate() public {
        vm.prank(sponsor);
        registry.registerSponsor(POLICY_NAME, 1 ether);

        address nonOwner = makeAddr("nonOwner");
        vm.prank(nonOwner);
        vm.expectRevert(
            abi.encodeWithSelector(GasPassRegistry.NotPolicyOwner.selector, nonOwner, sponsor)
        );
        registry.updatePolicy(POLICY_NAME, 2 ether, false);
    }
}
