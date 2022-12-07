import { createStandaloneToast, UseToastOptions } from "@chakra-ui/react";

type Props = {
	id: string;
	description: string;
	removeTitle?: boolean;
};

const { ToastContainer, toast } = createStandaloneToast();

const ToastNotification = () => {
	return <ToastContainer />;
};

const defaults: UseToastOptions = {
	position: "bottom-left",
	isClosable: true,
	duration: 6000,
	variant: "solid",
};

const showSuccessToast = ({ id, description, removeTitle = false }: Props) => {
	if (!toast.isActive(id)) {
		return toast({
			id,
			title: removeTitle ? "" : "Success",
			description,
			status: "success",
			...defaults,
		});
	}
};

const showErrorToast = ({ id, description, removeTitle = false }: Props) => {
	if (!toast.isActive(id)) {
		return toast({
			id,
			title: removeTitle ? "" : "Error",
			description,
			status: "error",
			...defaults,
		});
	}
};

const showInfoToast = ({ id, description }: Props) => {
	if (!toast.isActive(id)) {
		return toast({
			id,
			description,
			status: "info",
			...defaults,
		});
	}
};

export default ToastNotification;
export { toast, showSuccessToast, showErrorToast, showInfoToast };
