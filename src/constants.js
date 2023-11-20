export const DEFAULT_API_VERSION = "2023-10";

export const logBody = {
	jamId: "JAM_KIS6",
	pid: "JAM_KIS6",
	message: "",
	nested: {
		reporter: {
			jamId: "JAM_KIS6",
			pid: "JAM_KIS6"
		},
		payload: {
			emoji: "",
			flag: "Testing JAM_KIS6 logs",
			topic: "Testing JAM_KIS6 logs",
			brief: "Testing JAM_KIS6 logs",
			context: "Testing JAM_KIS6 logs"
		}
	}
};

export const errorState = {
	401: "Not authorized",
	404: "Not found",
	405: "Method not allowed",
	500: "Something went wrong"
};
