import { atom } from "recoil";

export const solanaNetworkState = atom({
	key: "SolanaNetwork",
	default: "mainnet-beta",
});
