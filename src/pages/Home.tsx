import {
	Box,
	Container,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useBreakpointValue,
} from "@chakra-ui/react";
import { useMemo } from "react";
import FindTokens from "../components/Home/FindTokens";
import { AiOutlineSearch } from "react-icons/ai";

const Home = () => {
	const tabList = useMemo(() => {
		return [
			{
				name: "Find Tokens",
				component: <FindTokens />,
				icon: <AiOutlineSearch />,
			},
		];
	}, []);

	const renderTabList = (
		<TabList w="full" maxW={{ base: "sm", md: "full" }} mx="auto">
			{tabList.map((tab) => {
				return (
					<Tab key={tab.name}>
						<Box mr={1.5}>{tab.icon}</Box>
						{tab.name}
					</Tab>
				);
			})}
		</TabList>
	);

	const renderTabPanels = (
		<TabPanels py={6}>
			{tabList.map((tab) => {
				return (
					<TabPanel px={0} key={tab.name}>
						{tab.component}
					</TabPanel>
				);
			})}
		</TabPanels>
	);

	const orientation: "vertical" | "horizontal" | undefined =
		useBreakpointValue({
			base: "vertical",
			md: "horizontal",
		});

	return (
		<Container>
			<Tabs
				display="flex"
				flexDirection="column"
				variant="solid-rounded"
				colorScheme="purple"
				isFitted
				defaultIndex={0}
				isLazy
				align="center"
				orientation={orientation ?? "vertical"}
			>
				{renderTabList}

				{renderTabPanels}
			</Tabs>
		</Container>
	);
};

export default Home;
