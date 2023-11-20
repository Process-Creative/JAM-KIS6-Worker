import { getShopifyCredentials, verifyRequestCredentials } from "./api/jam";
import { handleError, hasAuthorizationHeader, sendLogs } from "./helpers";
import { ProductProvider } from "./api/shopify";

const handleRequest = async (request, env, context) => {
	/**
	 * Initialize credentials
	 */
	const workerCredentials = env["JAM_WORKER"];
	const loggerCredentials = env["JAM_LOGGER"];

	/**
	 * Handle GET request
	 * @param {*} request
	 * @returns {Response}
	 */
	if (request.method !== "POST") return handleError(loggerCredentials, 405);

	const url = new URL(request.url);

	if (url.pathname !== "/") return handleError(loggerCredentials, 404);

	if (!hasAuthorizationHeader(request)) {
		return handleError(loggerCredentials, 401);
	}

	// Verify worker is authorized to fetch user credentials
	const requestAuthHeader = request.headers.get("Authorization");
	const isVerifiedRequest = await verifyRequestCredentials(env["JAM_7PR4_URL"], requestAuthHeader, loggerCredentials);

	if (!isVerifiedRequest) return handleError(loggerCredentials, 401);

	const requestCredentials = request.headers.get("X-Jam-Auth");
	const clientCredentials = await getShopifyCredentials(workerCredentials, requestCredentials, env["JAM_PT2J_URL"]);
	if (!clientCredentials) return handleError(loggerCredentials, 401);

	let requestBody;
	try {
		requestBody = await request.json();
	} catch (error) {
		console.error("ERROR: Could not parse request body");
	}

	if (!requestBody) return handleError(loggerCredentials, 400, "Invalid request body");
	const getShopifyProducts = new ProductProvider(clientCredentials, loggerCredentials);

	return await getShopifyProducts.handleAddVariant(requestBody);
};

export default {
	async fetch(request, env, context) {
		return handleRequest(request, env, context);
	}
};
