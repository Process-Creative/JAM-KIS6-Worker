import { errorState, logBody } from "./constants";

/**
 * Check if the request contains basic auth header
 * @param {Request} request
 * @returns {boolean} true if the request contains basic auth header
 */
export const hasAuthorizationHeader = (request) => {
	const authorization = request.headers.get("Authorization");
	if (authorization && authorization.includes("Basic")) {
		return true;
	}
	return false;
};

/**
 * Get user data from Cloudflare secrets
 * @param {string} username
 * @param {object} env - environment variables
 * @returns {object} userData object
 */
export const getUserData = (username, env) => {
	let userData;
	try {
		userData = JSON.parse(env[username]);
	} catch (error) {
		console.error("ERROR: Could not find user ", username);
	}

	return userData;
};

export const generateLogBody = (status, message) => {
	logBody.message = message;

	if (status === 200) {
		logBody.nested.payload.emoji = "✅";
		logBody.nested.payload.flag = "SUCCESS";
		logBody.nested.payload.context = message;
	} else {
		logBody.nested.payload.emoji = "⛔️";
		logBody.nested.payload.flag = "ERROR";
		logBody.nested.payload.context = message;
	}

	return logBody;
};

export const sendLogs = async (credentials, status, message) => {
	const body = generateLogBody(status, message);
	const { apiUrl, username, password } = JSON.parse(credentials);

	await fetch(apiUrl, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Basic ${btoa(`${username}:${password}`)}`
		}
	});
};

/**
 * Handle error response
 * @param {number} status
 * @param {string} message - optional
 * @returns {Response} error response object
 */
export const handleError = async (credentials, status, message) => {
	const errorCode = Object.keys(errorState).includes(status.toString()) ? status : 500;
	const errorMessage = message || errorState[errorCode];
	await sendLogs(credentials, errorCode, errorMessage);
	return new Response(errorMessage, { status: errorCode });
};
