import {
	Box,
	Button,
	Center,
	HStack,
	Input,
	Radio,
	RadioGroup,
	Spinner,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { showInfoToast } from "../ToastNotification";
import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
import { useRecoilValue } from "recoil";
import { solanaNetworkState } from "../../store/general";
import { convertToLowerCase } from "../../utils/general";
import TokenCard from "../TokenCard";

const TokenAvailability = () => {
	const [isFindingToken, setIsFindingToken] = useState(false);
	const [radioValue, setRadioValue] = useState("legacy");
	const [isFetchedResult, setIsFetchedResult] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [similarTokens, setSimilarTokens] = useState<TokenInfo[] | null>(
		null
	);
	const [tokenAlreadyExist, setTokenAlreadyExist] =
		useState<TokenInfo | null>(null);
	const solanaNetwork = useRecoilValue(solanaNetworkState);
	const [currentItem, setCurrentItem] = useState(0);

	const resetStates = () => {
		setCurrentItem(0);
		setSimilarTokens(null);
		setTokenAlreadyExist(null);
	};

	const totalNumberOfSimilarTokens = useMemo(() => {
		return similarTokens?.length ?? 0;
	}, [similarTokens]);

	const nextHandler = () => {
		if (currentItem < totalNumberOfSimilarTokens - 1) {
			setCurrentItem((prevState) => prevState + 1);
		}
	};

	const backHandler = () => {
		if (currentItem > 0) {
			setCurrentItem((prevState) => prevState - 1);
		}
	};

	const handleLegacySearch = async (tokenName: string) => {
		const tokenListProvider = new TokenListProvider();

		const tokens = await tokenListProvider.resolve();

		const tokensFilteredByNetwork = tokens
			.filterByClusterSlug(solanaNetwork)
			.getList();

		const similarTokens: TokenInfo[] = [];

		tokensFilteredByNetwork.forEach((token) => {
			if (
				convertToLowerCase(token.name) === tokenName ||
				convertToLowerCase(token.symbol) === tokenName
			) {
				setTokenAlreadyExist(token);
			} else if (
				convertToLowerCase(token.name).includes(tokenName) ||
				convertToLowerCase(token.symbol).includes(tokenName)
			) {
				similarTokens.push(token);
			}
		});

		if (similarTokens.length > 0) {
			setSimilarTokens(similarTokens);
		}
	};

	const handleTopSearch = async (tokenName: string) => {
		const apiUrl =
			"https://api.coingecko.com/api/v3/coins/list?include_platform=true";

		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error("api response not found!");
		}

		const result = await response.json();

		const tokensFilteredByNetwork = result.filter((token: any) => {
			const isSolanaToken = token?.platforms?.solana;

			if (isSolanaToken) {
				return token;
			}
		});

		const similarTokens: TokenInfo[] = [];

		tokensFilteredByNetwork.forEach((token: any) => {
			if (
				convertToLowerCase(token.name) === tokenName ||
				convertToLowerCase(token.symbol) === tokenName
			) {
				setTokenAlreadyExist(token);
			} else if (
				convertToLowerCase(token.name).includes(tokenName) ||
				convertToLowerCase(token.symbol).includes(tokenName)
			) {
				similarTokens.push(token);
			}
		});

		if (similarTokens.length > 0) {
			setSimilarTokens(similarTokens);
		}
	};

	const searchHandler = async (e: FormEvent) => {
		e.preventDefault();

		setIsFindingToken(true);
		setIsFetchedResult(false);
		try {
			resetStates();

			const tokenName = convertToLowerCase(searchValue);

			if (!tokenName) {
				setSearchValue("");
				showInfoToast({
					id: "token-empty",
					description: "Please enter token name!",
				});
				setIsFindingToken(false);
				return;
			}

			console.log({ radioValue });

			if (radioValue === "legacy") {
				await handleLegacySearch(tokenName);
			} else {
				await handleTopSearch(tokenName);
			}

			setIsFetchedResult(true);
		} catch (error) {
			console.error("searchHandler =>", error);
		}
		setIsFindingToken(false);
	};

	return (
		<Box>
			<VStack
				onSubmit={searchHandler}
				as="form"
				bgColor="gray.700"
				py={8}
				px={4}
				rounded="lg"
				spacing={4}
				align="left"
				mb={8}
			>
				<Text align="left" fontWeight="medium">
					Search Token Name or Symbol
				</Text>
				<Input
					onChange={(e: ChangeEvent<HTMLInputElement>) => {
						setIsFetchedResult(false);
						setSearchValue(e.target.value);
					}}
					placeholder="Search for a token name or symbol"
					focusBorderColor="purple.400"
				/>
				<RadioGroup
					defaultValue="legacy"
					colorScheme="purple"
					textAlign="left"
					onChange={(e) => {
						setRadioValue(e);
					}}
				>
					<Stack
						spacing={5}
						direction={{ base: "column", sm: "row" }}
					>
						<Radio value="legacy">
							Legacy Token List (Last Updated on 20th June 2022)
						</Radio>
						<Radio value="top">
							Top Solana Tokens (Mainnet-Only)
						</Radio>
					</Stack>
				</RadioGroup>
				<Button
					type="submit"
					colorScheme="purple"
					isLoading={isFindingToken}
				>
					Search Token
				</Button>
			</VStack>

			{isFindingToken && (
				<Center py={8}>
					<Spinner size="lg" />
				</Center>
			)}

			{!isFindingToken &&
				isFetchedResult &&
				(tokenAlreadyExist ? (
					<VStack
						bgColor="gray.700"
						py={8}
						px={4}
						rounded="lg"
						spacing={4}
						align="left"
						mb={10}
					>
						<Text fontSize="lg" fontWeight="medium">
							A token with exact name or symbol already exist:
						</Text>
						<TokenCard tokenDetails={tokenAlreadyExist} />
					</VStack>
				) : (
					<Text fontSize="lg" py={6} fontWeight="medium">
						No token exist with this name or symbol on solana{" "}
						{solanaNetwork}
					</Text>
				))}

			{!isFindingToken &&
				isFetchedResult &&
				similarTokens &&
				similarTokens?.length !== 0 && (
					<VStack
						bgColor="gray.700"
						py={8}
						px={4}
						rounded="lg"
						spacing={4}
						align="left"
					>
						<Text fontSize="lg" fontWeight="medium">
							Tokens having similar name or symbol:
						</Text>

						<HStack justifyContent="space-between">
							<Button
								colorScheme="purple"
								onClick={backHandler}
								isDisabled={currentItem === 0}
							>
								Back
							</Button>
							<Text>
								{currentItem + 1}/{totalNumberOfSimilarTokens}
							</Text>
							<Button
								colorScheme="purple"
								onClick={nextHandler}
								isDisabled={
									currentItem ===
									totalNumberOfSimilarTokens - 1
								}
							>
								Next
							</Button>
						</HStack>

						{similarTokens?.map((token, index) => {
							if (index === currentItem) {
								return (
									<TokenCard
										key={token.address}
										tokenDetails={token}
									/>
								);
							}
						})}
					</VStack>
				)}
		</Box>
	);
};

export default TokenAvailability;
