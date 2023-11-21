# JAM-KIS6-Worker
Process JAM - This worker updates a Shopify variant on the targeted storefront.

[![Deploy](https://github.com/Process-Creative/JAM-KIS6-Worker/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/Process-Creative/JAM-KIS6-Worker/actions/workflows/deploy.yml)

## Usage
### Example request
Send a `POST` request to `https://jam-kis6.pro-cess.cc`
with an `Authotization` header with Basic auth using a valid Worker username and password (From password vault)
and an `X-Jam-Auth` header with Basic auth using a valid Client/Store username and password (From password vault)

Request body should be in the format:
```
{
    "id": "gid://shopify/ProductVariant/<VARIANT_ID>",
    "barcode": "1234_example",
    "compareAtPrice": "1000"
}
```

## Development
1. Clone the repo
2. Create a `wrangler.toml` file from `wrangler.toml.example`
3. Update `"name"` field in `wrangler.toml` to `"jam-<worker_code>"`
4. Update deploy badge URL on README.md to replace `JAM-CF-Worker-Template` with `JAM-<WORKER_CODE>-Worker`
5. Update package.json to change your worker's name and worker specific commands
	- `"name": "jam-<worker_code>"` - Add worker code in lowercase
 	-	`"description": ""` - Add worker description
	- "scripts": {
			//...
   		"log": "wrangler tail jam-<worker_code>" - Add worker code in lowercase
6. Generate a password for the worker and add it to [jam-7pr4 secrets](https://dash.cloudflare.com/6442f52d3d49251b0d036b8bcbfdfd20/workers/services/view/jam-7pr4/production/settings/bindings) in this format: `JAM_CODE: {"jamId":"JAM_CODE","password":"123456","activeState":true}`

To run the worker locally:
1. Run `npm install`
2. Run `npm start`

## Deployment
Once the worker is in production, we will no longer deploy manually. Deployment will be handled by the GitHub workflow that will run every time there is a new merge to the main branch.
Before the worker goes to production, it can be manually deployed. Please make sure you have updated the worker name in `wrangler.toml` as this is where the worker will be deployed when you run `npm run deploy`

### Before creating a PR
1. Please make sure to run Prettier and ESLint to ensure consistent formatting and linting.
2. Please create a custom domain for the worker from cloudflare dashboard:
	- Go to Cloudflare Dashboard > Workers & Pages > `jam-<worker-code>` > Triggers > Add custom domain
 	- The worker will have a default domain setup as jam-example.pro-cess.workers.dev, please add a new custom domain in the format of `jam-example.pro-cess.cc`
3. Please add your wrangler.toml file content to 1pass `Engineering: JAM` vault under jam-`<worker-code>`.wrangler.toml
4. Please add repository secrets to your GitHub repo so that it can action the deployment workflow on change to main branch (this only needs to be done once per repo)
	- Go to GitHub repository > Settings > Secrets and Variables > Actions and add the following repository secrets:
   - CF_ACCOUNT_ID (Can be found in on 1pass Engineering: JAM vault - Shared across workers within the same project)
   - CF_API_TOKEN (Can be found in on 1pass Engineering: JAM vault - Shared across workers within the same project)
   - CF_WORKER_NAME (Set it to the worker name jam-<worker-code>, eg. jam-expl)
5. Create a new secret note for the above secrets on 1pass Engineering: JAM vault under jam-`<worker-code>`.github.secrets
6. Add worker URL and description to GitHub repository details section


