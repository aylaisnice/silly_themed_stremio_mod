'use strict';

const CACHE_VERSION = 1;
let CURRENT_CACHE = 'offline-v' + CACHE_VERSION;

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', event => {
	// The primary use of onactivate is for cleanup of resources used in previous versions of a Service worker script.

	event.waitUntil(caches.keys().then(cacheNames => Promise.all(
		cacheNames.map(cacheName => {
			if (cacheName === CURRENT_CACHE) {
				// If this cache name isn't present in the array of "expected" cache names,
				// then delete it.
				console.log('Deleting out of date cache:', cacheName);
				return caches.delete(cacheName);
			}
		})
	)));

	event.waitUntil(self.clients.claim()); // Become available to all pages
});

self.addEventListener('fetch', event => {
	var url = new URL(event.request.url)

	var isImage = url.pathname.endsWith('.png') || url.pathname.endsWith('.jpg') || url.pathname.endsWith('/img')
	var isOurHost = url.hostname == self.location.hostname
	var isOfficialAddon = (url.host.endsWith('.strem.io') || url.host.endsWith('.stremio.com')) && url.pathname.endsWith('.json')

	var isRelevant = event.request.method == 'GET' && (isOurHost || isOfficialAddon || isImage) && url.hostname != "127.0.0.1" && url.hostname != "localhost";

	if (!isRelevant) {
		return
	}

	if (isOurHost) {
		url.searchParams.delete('ver')
	}

	// if we use ?ver=..., ignore the search, so we can avoid filling the cache with blob.css/blob.js with different versions
	// XXX: technically it would also be good to check if the version requested is the same as the one in cache
	// NOTE: it's not fatal to have it, since the assumption is, if there is a connection to load a new index.html, there will be connection to download the new vers too

	event.respondWith(caches.match(url).then(function(cachedResponse) {
		if (isImage && cachedResponse !== undefined) {
			return cachedResponse
		}
		// caches.match() always resolves
		// but in case of success response will have value
		return fetch(event.request).then(function (fetchedResponse) {
			// response may be used only once
			// we need to save clone to put one copy in cache
			// and serve second one

			if (cachedResponse === undefined) {
				let responseClone = fetchedResponse.clone();
				caches.open(CURRENT_CACHE).then(function (cache) {
					cache.put(url, responseClone);
				});
			}
			return fetchedResponse;
		}).catch(function () {
			if (cachedResponse !== undefined) {
				return cachedResponse;
			}
		});
	}));
});

