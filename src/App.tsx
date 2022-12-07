import { Box, Flex } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ToastNotification from "./components/ToastNotification";
import Home from "./pages/Home";

function App() {
	return (
		<RecoilRoot>
			<Flex
				direction="column"
				minW="full"
				minH="100vh"
				bgColor="gray.900"
				color="gray.50"
			>
				<Header />

				<Box flexGrow={1}>
					<Home />
				</Box>

				<Footer />

				<ToastNotification />
			</Flex>
		</RecoilRoot>
	);
}

export default App;
