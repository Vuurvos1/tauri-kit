import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const TAURI_KIT_GITHUB = 'https://api.github.com/repos/vuurvos1/tauri-kit/releases/latest';

/* example response
{
  "version": "0.1.2",
  "notes": "See the assets to download and install this version.",
  "pub_date": "2023-06-26T17:56:39.501Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVUUzlqdVgyZmNoeHB1dVF0MmVFenZWVG9BRkZqWHljMTNsWkMzVUhvTzVPQ2tzcW5tYk1lM0hXMktkeTFnNGZHb0kyVm9lakJzaE9FU3g0RXRXTjVISTZNOFJZL1R4UHdnPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNjg3ODAyMTU5CWZpbGU6dGF1cmkta2l0XzAuMS4yX3g2NF9lbi1VUy5tc2kuemlwCksrSkxuV3oyNmltYUdHMHhnSlV2RUdIdVlnOTA0S0MrbGNFclhqelpHMmNZNEtqQWprekdxcVBqeithSFZTTHNmTDlNaTNRTm1qR3FqWmI2SkpvSEJ3PT0K",
      "url": "https://github.com/Vuurvos1/tauri-kit/releases/download/v0.1.2/tauri-kit_0.1.2_x64_en-US.msi.zip"
    },
    "linux-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9tIHRhdXJpIHNlY3JldCBrZXkKUlVUUzlqdVgyZmNoeGtnaXozQUpWR2YwdW9sWE95aGlmWXVjaVRBSGJDT0s0L3JDTXBSa2ljNUhxVGR3cy9UcGhxT2piT0dISkQ3RWJ5SzJyeElvYmU2b2tQdFFKc1A1REEwPQp0cnVzdGVkIGNvbW1lbnQ6IHRpbWVzdGFtcDoxNjg3ODAyMTg4CWZpbGU6dGF1cmkta2l0XzAuMS4yX2FtZDY0LkFwcEltYWdlLnRhci5negpCZWpkV00rdXZWZnlBdm1WWWd1aWdoTTg5MStkRTRjWDE3dG5kc0NZd0NCaGN6amI0UUdubm1FMjJGaEQ2RWEycE90dkh2STBTa1J6Nkx6TlZlcmREUT09Cg==",
      "url": "https://github.com/Vuurvos1/tauri-kit/releases/download/v0.1.2/tauri-kit_0.1.2_amd64.AppImage.tar.gz"
    }
  }
}
*/

export const GET = (async ({ url }) => {
	const res = await fetch(TAURI_KIT_GITHUB);
	if (!res.ok) {
		throw error(204, '');
	}
	const data = await res.json();

	const response = {
		version: data.tag_name,
		notes: data.body,
		pub_date: data.published_at,
		platforms: {} as Record<string, { url: string; signature: string }>
	};

	const platforms = {
		'windows-x86_64': '.msi.zip',
		'linux-x86_64': 'amd64.AppImage.tar.gz'
		// 'darwin-x86_64': 'app.tar.gz', // macos
		// 'darwin-aarch64': 'app.tar.gz' // macos arm
	} as const;

	type Platform = keyof typeof platforms;
	type Extension = (typeof platforms)[Platform];

	const promises = [];

	for (const asset of data.assets) {
		for (const [platform, extension] of Object.entries(platforms) as [Platform, Extension][]) {
			if (!response.platforms[platform]) response.platforms[platform] = { url: '', signature: '' };

			if (asset.name.endsWith(extension)) {
				response.platforms[platform].url = asset.browser_download_url;

				continue;
			}

			if (asset.name.endsWith(extension + '.sig')) {
				promises.push(
					fetch(asset.browser_download_url)
						.then((res) => res.text())
						.then((text) => {
							response.platforms[platform].signature = text;
							return text;
						})
				);

				continue;
			}
		}
	}

	try {
		const _signatures = await Promise.all(promises);
	} catch (err) {
		console.error(err);
		throw error(400, 'min and max must be numbers, and min must be less than max');
	}

	return new Response(JSON.stringify(response), {
		headers: {
			'content-type': 'application/json',
			'cache-control': 'public, max-age=3600'
		}
	});
}) satisfies RequestHandler;
