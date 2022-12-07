import { Box, Center, Link, Text } from "@chakra-ui/react";

const Footer = () => {
	return (
		<Box p={5} as="footer">
			<Center>
				<Text>
					Developed By{" "}
					<Link
						href="https://www.bhagyamudgal.com"
						target="_blank"
						rel="noopener noreferrer"
						color="purple.300"
					>
						Bhagya Mudgal
					</Link>
				</Text>
			</Center>
		</Box>
	);
};

export default Footer;
