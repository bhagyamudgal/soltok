import {
	Box,
	Button,
	Center,
	HStack,
	Input,
	Spinner,
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
	const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
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

	const searchHandler = async (e: FormEvent) => {
		e.preventDefault();

		setIsCheckingAvailability(true);
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
				setIsCheckingAvailability(false);
				return;
			}

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

			setIsFetchedResult(true);
		} catch (error) {
			console.error("searchHandler =>", error);
		}
		setIsCheckingAvailability(false);
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
					placeholder="Search for a token name to check availability"
					focusBorderColor="purple.400"
				/>
				<Button
					type="submit"
					colorScheme="purple"
					isLoading={isCheckingAvailability}
				>
					Check Availability
				</Button>
			</VStack>

			{isCheckingAvailability && (
				<Center py={8}>
					<Spinner size="lg" />
				</Center>
			)}

			{!isCheckingAvailability &&
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

			{!isCheckingAvailability &&
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
