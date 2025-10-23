// Service Worker for Interactive Timeline Editor
const WTHtimelineCacheName = 'WTH-timeline-v1.0.5';
const WTHtimelineAssets = [
	'/',
	'/index.html',
	'/offline.html',
	'/styles/main.css',
	'/styles/accessibility.css',
	'/scripts/dom-manager.js',
	'/scripts/accessibility.js',
	'/scripts/control.js',
	'/assets/icons/icon-72x72.png',
    '/assets/icons/icon-96x96.png',
    '/assets/icons/icon-128x128.png',
    '/assets/icons/icon-144x144.png',
    '/assets/icons/icon-152x152.png',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-384x384.png',
	'/assets/icons/icon-512x512.png',
	'/assets/screenshots/screenshot-desktop_1280x720.png',
	'/assets/screenshots/screenshot-mobile_375x667.png',
	'/manifest.json'
];

// Install Event - Cache all essential assets including offline.html
self.addEventListener('install', (event) => {
	console.log('WTH Timeline Service Worker: Installing...');
	
	event.waitUntil(
		caches.open(WTHtimelineCacheName)
		.then((cache) => {
			console.log('WTH Timeline Service Worker: Caching app shell and offline page');
			return cache.addAll(WTHtimelineAssets);
		})
		.then(() => {
			console.log('WTH Timeline Service Worker: Install completed');
			return self.skipWaiting();
		})
		.catch((error) => {
			console.error('WTH Timeline Service Worker: Installation failed', error);
		})
	);
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
	console.log('WTH Timeline Service Worker: Activating...');
	
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cache) => {
					if (cache !== WTHtimelineCacheName) {
						console.log('WTH Timeline Service Worker: Deleting old cache', cache);
						return caches.delete(cache);
					}
				})
			);
			}).then(() => {
			console.log('WTH Timeline Service Worker: Activation completed');
			return self.clients.claim();
		})
	);
});

// Enhanced Fetch Event - Serve from cache, fallback to offline.html
self.addEventListener('fetch', (event) => {
	// Skip cross-origin requests and file:// protocol
	if (!event.request.url.startsWith(self.location.origin) || event.request.url.startsWith('file://')) {
		return;
	}
	
	// Handle navigation requests specifically
	if (event.request.mode === 'navigate') {
		event.respondWith(
			fetch(event.request)
			.then((response) => {
				return response;
			})
			.catch(() => {
				// Return offline.html when network fails
				return caches.match('/offline.html');
			})
		);
		return;
	}
	
	event.respondWith(
		caches.match(event.request)
		.then((response) => {
			// Return cached version or fetch from network
			return response || fetch(event.request)
			.then((fetchResponse) => {
				// Cache new requests for offline use
				if (event.request.url.startsWith('http') && 
					event.request.method === 'GET' &&
					!event.request.url.includes('/api/')) {
					
					const responseToCache = fetchResponse.clone();
					caches.open(WTHtimelineCacheName)
					.then((cache) => {
						cache.put(event.request, responseToCache);
					});
				}
				return fetchResponse;
			})
			.catch(() => {
				// Enhanced fallback for failed requests
				if (event.request.destination === 'document') {
					return caches.match('/offline.html');
				}
				// For other file types, return appropriate fallback
				return new Response('Offline content not available', {
					status: 408,
					statusText: 'Network connection failed'
				});
			});
		})
	);
});

// Message Event - Handle messages from the app
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
	
	// Handle offline status check
	if (event.data && event.data.type === 'CHECK_OFFLINE_STATUS') {
		event.ports[0].postMessage({
			type: 'OFFLINE_STATUS',
			isOffline: !navigator.onLine
		});
	}
});

// Background Sync Event
self.addEventListener('sync', (event) => {
	if (event.tag === 'WTH-timeline-background-sync') {
		console.log('WTH Timeline Service Worker: Background sync triggered');
		event.waitUntil(
			WTHtimelineHandleBackgroundSync()
		);
	}
});

// Periodic Sync Event
self.addEventListener('periodicsync', (event) => {
	if (event.tag === 'WTH-timeline-update') {
		console.log('WTH Timeline Service Worker: Periodic sync triggered');
		event.waitUntil(
			WTHtimelineHandlePeriodicSync()
		);
	}
});

// Handle background sync
function WTHtimelineHandleBackgroundSync() {
	return caches.open(WTHtimelineCacheName).then(cache => {
		// Check for updated assets
		return Promise.all(
			WTHtimelineAssets.map(asset => {
				return fetch(asset, { cache: 'no-cache' }).then(response => {
					if (response.status === 200) {
						return cache.put(asset, response);
					}
					}).catch(error => {
					console.log('WTH Timeline Service Worker: Failed to update', asset, error);
				});
			})
			).then(() => {
				console.log('WTH Timeline Service Worker: Background sync completed');
				// Notify all clients that sync completed
				return self.clients.matchAll().then(clients => {
					clients.forEach(client => {
						client.postMessage({
							type: 'SYNC_COMPLETED',
							timestamp: new Date().toISOString()
						});
					});
				});
			});
	});
}

// Handle periodic sync
function WTHtimelineHandlePeriodicSync() {
	return caches.open(WTHtimelineCacheName).then(cache => {
		// Update critical assets only
		const criticalAssets = [
			'/',
			'/index.html',
			'/offline.html',
			'/styles/main.css',
			'/scripts/control.js'
		];
		
		return Promise.all(
			criticalAssets.map(asset => {
				return fetch(asset, { cache: 'no-cache' }).then(response => {
					if (response.status === 200) {
						return cache.put(asset, response);
					}
					}).catch(error => {
					console.log('WTH Timeline Service Worker: Failed to update', asset, error);
				});
			})
			).then(() => {
				console.log('WTH Timeline Service Worker: Periodic sync completed');
			});
	});
}

// Enhanced offline detection
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'CHECK_SYNC_STATUS') {
		// Return current sync status
		event.ports[0].postMessage({
			type: 'SYNC_STATUS',
			lastSync: new Date().toISOString(),
			isOnline: navigator.onLine
		});
	}
});