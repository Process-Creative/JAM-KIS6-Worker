import { sendLogs } from "../helpers";

/**
 * Get shopify credentials from PT2J
 * @param {string} clientPid
 * @param {string} clientPassword
 * @returns {object} Shopify credentials
 */
export const getShopifyCredentials = async (workerCredentials, requestCredentials, apiUrl) => {
	const { username, password } = JSON.parse(workerCredentials);
	const response = await fetch(apiUrl, {
		headers: {
			Authorization: `Basic ${btoa(username + ":" + password)}`,
			"X-Jam-Auth": requestCredentials
		}
	});

	if (!response.ok) {
		console.error("Response not OK:", response.status, response.statusText);
		return;
	}

	return await response.json();
};

/**
 * Verify worker credentials from 7PR4
 * @param {string} apiUrl
 * @param {string} base64Credentials - base64 encoded credentials
 * @returns {object} boolean
 */
export const verifyRequestCredentials = async (apiUrl, base64Credentials, loggerCredentials) => {
	try {
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: base64Credentials
			}
		});

		if (response.ok) {
			const data = await response.json();
			if (data && data.isVerified !== undefined) {
				return data.isVerified;
			}
			// Handle unexpected JSON response
			console.error("Invalid JSON response:", JSON.stringify(data));
			loggerCredentials && (await sendLogs(loggerCredentials, 401, "Invalid JSON response"));
			return false;
		}
		// Handle non-successful responses here
		loggerCredentials && (await sendLogs(loggerCredentials, response.status, response.statusText));
		return false;
	} catch (error) {
		loggerCredentials && (await sendLogs(loggerCredentials, error.status || 500, error.message || "Fetch error"));
		return false;
	}
};
