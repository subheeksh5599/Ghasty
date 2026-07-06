// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {GasPassRegistry} from "../src/GasPassRegistry.sol";
import {ZeroSwap} from "../src/ZeroSwap.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        GasPassRegistry registry = new GasPassRegistry();
        console.log("GasPassRegistry deployed at:", address(registry));

        ZeroSwap zeroSwap = new ZeroSwap();
        console.log("ZeroSwap deployed at:", address(zeroSwap));

        // Register a demo sponsor policy
        registry.registerSponsor("ghasty-demo", 0.1 ether); // 0.1 BOT daily cap
        console.log("Registered policy: ghasty-demo");

        // Cover the ZeroSwap contract under the demo policy
        registry.coverContract("ghasty-demo", address(zeroSwap), 300000); // max 300k gas per tx
        console.log("Covered ZeroSwap under ghasty-demo policy");

        // Fund the gas pool with 1 BOT for demo
        registry.fundGasPool{value: 1 ether}("ghasty-demo");
        console.log("Funded gas pool with 1 BOT");

        vm.stopBroadcast();

        console.log("\n=== Deploy Summary ===");
        console.log("GasPassRegistry:", address(registry));
        console.log("ZeroSwap:", address(zeroSwap));
        console.log("Policy: ghasty-demo (0.1 BOT/day cap, 1 BOT pool)");
        console.log("Add to your .env: REGISTRY_ADDRESS=", address(registry));
        console.log("Add to your .env: ZEROSWAP_ADDRESS=", address(zeroSwap));
    }
}
