// Service Worker for Interactive Timeline Editor - FIXED OFFLINE SUPPORT
const WTHtimelineCacheName = 'WTH-timeline-v1.1.2';
const WTHtimelineAssets = [
	'/',
	'/index.html',
	'/offline.html',
	'/styles/main.css',
	'/manifest.json',
	'/version.json',
	'/netlify.toml',
	'/_redirects',
	'/_headers',
	'/robots.txt',
	'/styles/accessibility.css',
	'/scripts/dom-manager.js',
	'/scripts/accessibility.js',
	'/scripts/translations.js',
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
	// Fallback for root paths
	'./',
	'./index.html',
	'./offline.html',
	'/styles/main.css',
	'/styles/accessibility.css',
	'/scripts/dom-manager.js',
	'/scripts/accessibility.js',
	'/scripts/translations.js',
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
	'/assets/screenshots/screenshot-mobile_375x667.png'
];

// Install Event - Cache all essential assets
self.addEventListener('install', (event) => {
	console.log('WTH Timeline Service Worker: Installing...');
	
	event.waitUntil(
		caches.open(WTHtimelineCacheName)
		.then((cache) => {
			console.log('WTH Timeline Service Worker: Caching app shell');
			// Use addAll but handle individual failures
			return Promise.all(
				WTHtimelineAssets.map(asset => {
					return cache.add(asset).catch(error => {
						console.log('WTH Timeline Service Worker: Failed to cache', asset, error);
					});
				})
			);
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

// Enhanced Fetch Event - Cache-first strategy for offline support
self.addEventListener('fetch', (event) => {
	// Skip non-HTTP requests
	if (!event.request.url.startsWith('http')) {
		return;
	}
	
	// Handle navigation requests (HTML pages)
	if (event.request.mode === 'navigate') {
		event.respondWith(
			caches.match(event.request)
			.then(response => {
				// Return cached version if available
				if (response) {
					return response;
				}
				// Try network for navigation requests
				return fetch(event.request)
				.then(networkResponse => {
					// Cache the new response
					if (networkResponse.ok) {
						const responseToCache = networkResponse.clone();
						caches.open(WTHtimelineCacheName)
						.then(cache => {
							cache.put(event.request, responseToCache);
						});
					}
					return networkResponse;
				})
				.catch(() => {
					// Fallback to offline.html for failed navigation requests
					return caches.match('/offline.html')
					.then(offlineResponse => {
						return offlineResponse || new Response('Offline content not available', {
							status: 503,
							statusText: 'Service Unavailable'
						});
					});
				});
			})
			.catch(() => {
				return caches.match('/offline.html');
			})
		);
		return;
	}
  // specific handling for API/data requests
  if (event.request.url.includes('/api/') || event.request.url.includes('/data/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Return empty data or cached data for API failures
          return new Response(JSON.stringify({offline: true, data: []}), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }
	
	// For all other requests (CSS, JS, images)
	event.respondWith(
		caches.match(event.request)
		.then(response => {
			// Return cached version
			if (response) {
				return response;
			}
			
			// Clone the request because it can only be used once
			const fetchRequest = event.request.clone();
			
			return fetch(fetchRequest)
			.then(networkResponse => {
				// Check if we received a valid response
				if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
					return networkResponse;
				}
				
				// Cache the new response
				const responseToCache = networkResponse.clone();
				caches.open(WTHtimelineCacheName)
				.then(cache => {
					cache.put(event.request, responseToCache);
				});
				
				return networkResponse;
			})
			.catch(() => {
				// Enhanced fallback for different file types
				if (event.request.destination === 'style') {
					return caches.match('/styles/main.css');
				}
				if (event.request.destination === 'script') {
					// Try to return the specific script or a generic fallback
					const scriptPath = event.request.url.split('/').pop();
					return caches.match(`/scripts/${scriptPath}`)
					.then(scriptResponse => {
						return scriptResponse || new Response('console.log("Offline mode");', {
							headers: { 'Content-Type': 'application/javascript' }
						});
					});
				}
				// Generic fallback response
				return new Response('Resource not available offline', {
					status: 408,
					headers: { 'Content-Type': 'text/plain' }
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

// Handle background sync
function WTHtimelineHandleBackgroundSync() {
	return caches.open(WTHtimelineCacheName).then(cache => {
		// Update critical assets
		const criticalAssets = [
			'/',
			'/index.html',
			'/styles/main.css',
			'/scripts/control.js',
			'/scripts/dom-manager.js'
		];
		
		return Promise.all(
			criticalAssets.map(asset => {
				return fetch(asset, { cache: 'reload' }).then(response => {
					if (response.status === 200) {
						return cache.put(asset, response);
					}
					}).catch(error => {
					console.log('WTH Timeline Service Worker: Failed to update', asset, error);
				});
			})
			).then(() => {
				console.log('WTH Timeline Service Worker: Background sync completed');
				// Notify clients
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

// Enhanced offline detection and messaging
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'CHECK_SYNC_STATUS') {
		event.ports[0].postMessage({
			type: 'SYNC_STATUS',
			lastSync: new Date().toISOString(),
			isOnline: navigator.onLine
		});
	}
});

// Periodicsync event (if supported)
self.addEventListener('periodicsync', (event) => {
	if (event.tag === 'WTH-timeline-update') {
		console.log('WTH Timeline Service Worker: Periodic sync triggered');
		event.waitUntil(
			WTHtimelineHandleBackgroundSync()
		);
	}
});