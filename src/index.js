import { getUserData, handleError, hasAuthorizationHeader, sendLogs } from "./helpers";

const handleRequest = async (request, env, context) => {
	/**
	 * Initialize logger credentials
	 */
	const loggerCredentials = env["JAM_LOGGER"];

	/**
	 * Handle GET request
	 * @param {*} request
	 * @returns {Response}
	 */

	const url = new URL(request.url);
	if (url.pathname !== "/") return handleError(loggerCredentials, 404);
	if (!hasAuthorizationHeader(request)) return handleError(loggerCredentials, 401);

	const authorizationHeader = request.headers.get("Authorization");
	const base64Credentials = authorizationHeader.split(" ")[1];
	const credentials = atob(base64Credentials);
	const [username, password] = credentials.split(":");
	const userData = getUserData(username, env);

	if (userData && userData.activeState && password === userData.password) {

		await sendLogs(loggerCredentials, 200, "User authorized successfully");
		return new Response("Hello Worker", { status: 200 });
	}

	return handleError(loggerCredentials, 401);
};

export default {
	async fetch(request, env, context) {
		return handleRequest(request, env, context);
	}
};
