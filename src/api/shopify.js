import { generateApiUrl, handleError, sendLogs } from "../helpers";

export class ProductProvider {
	constructor(clientCredentials, loggerCredentials) {
		const { shopifyUrl, shopifyApiVersion, shopifyAccessToken } = clientCredentials;

		this.shopifyApiUrl = generateApiUrl(shopifyUrl, shopifyApiVersion);
		this.accessToken = shopifyAccessToken;
		this.loggerCredentials = loggerCredentials;
	}

	/**
	 * Generate GraphQL query for Shopify API
	 * @returns {string} - GraphQL query
	 */
	generateVariantQuery = () => {
		return `
			mutation productVariantUpdate($input: ProductVariantInput!) {
				productVariantUpdate(input: $input) {
					productVariant {
						barcode
					}
					userErrors {
						field
						message
					}
				}
			}
		`;
	};

	handleAddVariant = async (queryInput) => {
		const shopifyResponse = await this.updateVariant(queryInput);

		if (!shopifyResponse) return handleError(this.loggerCredentials, 500, "Could not create variant");

		if (shopifyResponse?.errors) {
			const { message } = shopifyResponse?.errors[0] || "";
			return handleError(this.loggerCredentials, 500, message);
		}

		await sendLogs(this.loggerCredentials, 200, "Successfully created variant");
		return new Response(JSON.stringify({ data: shopifyResponse }), { status: 200 });
	};

	/**
	 * Create variant on Shopify store
	 * @returns {Object} - returns object containing product id
	 */
	updateVariant = async (queryInput) => {
		//{
		//	"id": "gid://shopify/ProductVariant/47213471498534",
		//	"barcode": "1234_example",
		//	"compareAtPrice": "1000"
		//}
		if (!queryInput?.productId) return;

		const query = this.generateVariantQuery();
		const requestBody = {
			query,
			variables: {
				input: queryInput
			}
		};

		const response = await fetch(this.shopifyApiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Shopify-Access-Token": this.accessToken
			},
			body: JSON.stringify(requestBody)
		});

		return await response.json();
	};
}
