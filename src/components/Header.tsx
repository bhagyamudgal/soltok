import { Box, HStack, Image, Select } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { useSetRecoilState } from "recoil";
import { solanaNetworkState } from "../store/general";

const Header = () => {
	const setSolanaNetwork = useSetRecoilState(solanaNetworkState);

	const solanaNetworkHandler = (e: ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value;

		setSolanaNetwork(value);
	};

	return (
		<Box as="header" px={{ base: 2, sm: 4 }} py={4}>
			<HStack justifyContent="space-between">
				<Box>
					{/* Visible on desktop */}
					<Image
						src="/images/logo.png"
						alt="soltok-logo"
						w={200}
						display={{ base: "none", sm: "block" }}
					/>

					{/* Visible on mobile */}
					<Image
						src="/images/logo-mobile.png"
						alt="soltok-logo"
						w={42}
						display={{ sm: "none" }}
					/>
				</Box>

				<Select
					defaultValue="mainnet-beta"
					maxW={200}
					focusBorderColor="purple.400"
					onChange={solanaNetworkHandler}
				>
					<option value="mainnet-beta">Mainnet Beta </option>
					<option value="devnet">Devnet</option>
					<option value="testnet">Testnet</option>
				</Select>
			</HStack>
		</Box>
	);
};

export default Header;
