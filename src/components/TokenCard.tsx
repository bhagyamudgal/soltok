import {
	Box,
	Center,
	Flex,
	HStack,
	Image,
	Spinner,
	Text,
	VStack,
} from "@chakra-ui/react";
import { TokenInfo } from "@solana/spl-token-registry";

const TokenCard = ({ tokenDetails }: { tokenDetails: TokenInfo }) => {
	return (
		<Box bgColor="gray.800" p={6} rounded="md">
			<VStack spacing={4}>
				<HStack
					justifyContent="space-between"
					w="full"
					align="flex-start"
				>
					<Text color="purple.300" fontWeight="medium">
						Name
					</Text>
					<Text align="right" w="70%">
						{tokenDetails.name}
					</Text>
				</HStack>
				<HStack
					justifyContent="space-between"
					w="full"
					align="flex-start"
				>
					<Text color="purple.300" fontWeight="medium">
						Symbol
					</Text>
					<Text>{tokenDetails.symbol}</Text>
				</HStack>
				{tokenDetails.decimals && (
					<HStack
						justifyContent="space-between"
						w="full"
						align="flex-start"
					>
						<Text color="purple.300" fontWeight="medium">
							Decimals
						</Text>
						<Text>{tokenDetails.decimals}</Text>
					</HStack>
				)}
				{tokenDetails.logoURI && (
					<HStack justifyContent="space-between" w="full">
						<Text color="purple.300" fontWeight="medium">
							Logo
						</Text>
						<Image
							src={tokenDetails.logoURI}
							alt={tokenDetails.name}
							w={42}
							fallback={
								<Center>
									<Spinner />
								</Center>
							}
						/>
					</HStack>
				)}
				{tokenDetails?.tags && (
					<HStack justifyContent="space-between" w="full">
						<Text color="purple.300" fontWeight="medium">
							Tags
						</Text>
						<Flex
							wrap="wrap"
							justifyContent="flex-end"
							alignItems="center"
						>
							{tokenDetails?.tags?.map((tag) => {
								return (
									<Box
										key={tag}
										bgColor="purple.400"
										px={3}
										py={1}
										rounded="xl"
										fontWeight="medium"
										m={2}
									>
										{tag}
									</Box>
								);
							})}
						</Flex>
					</HStack>
				)}
			</VStack>
		</Box>
	);
};

export default TokenCard;
