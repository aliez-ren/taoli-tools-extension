const TYPE = "EXTENSION_PROXY_FETCH";

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
	const { type, req } = msg;
	if (type !== TYPE) {
		return;
	}

	(async () => {
		try {
			const res = await fetch(...req);
			const text = await res.text();
			const headers = Object.fromEntries(res.headers.entries());

			sendResponse({
				status: res.status,
				statusText: res.statusText,
				headers,
				text,
			});
		} catch (err) {
			sendResponse(String(err));
		}
	})();

	return true;
});

chrome.action.onClicked.addListener(async () => {
	const url = "https://taoli.tools";
	await chrome.tabs.create({ url });
});
