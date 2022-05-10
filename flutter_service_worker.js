'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "ab71efabec58cd93f573848f23c288d0",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/images/ayam1.jpg": "e9eaee539ec6250595fc8f7f32bad576",
"assets/images/ayam2.jpg": "f32675e99a46a35b75bafecabf0b673d",
"assets/images/baso1.jpg": "466607202ba770f5c5359fdf3894ac93",
"assets/images/baso2.jpg": "69ab5f4bd5c7b759656818c88c3f447c",
"assets/images/baso3.jpg": "66470b0a93d9619b8e5c8826b4949174",
"assets/images/dawet1.jpg": "3433f1814de34f1a19b50587fcd83e44",
"assets/images/dawet2.jpg": "253056526e799b38dee732b8ddbeae1e",
"assets/images/dawet3.jpg": "abc8345845819c81863f00099dba0962",
"assets/images/kupang1.jpg": "c703d8677b2cec9674f8d65905d2a493",
"assets/images/kupang2.jpg": "2d582f1e7bb0ea902032631103500041",
"assets/images/kupang3.jpg": "4d87617e0451d557dd1678e07168ebb8",
"assets/images/pecel1.jpg": "96ea990b13c074343d22e57330c88531",
"assets/images/pecel2.jpg": "3e369513f8416cb3997d0490ce0b6afd",
"assets/images/pecel3.jpg": "f87c98b3aab1cdc708c56e47d6a3001c",
"assets/images/rawon1.jpg": "f528182e49e0d6d3b291dc9ef95334b1",
"assets/images/rawon2.jpg": "f64bfc76ad5ebb715e47e3e7b4e09479",
"assets/images/rawon3.jpg": "03fb816eb5ab873e8112d65c6bb6b309",
"assets/images/sate1.jpg": "4bdea2131e6b6d84d992c79072e1701b",
"assets/images/sate2.jpg": "656bb2f1191d251f3b3acbe4ede0dcdf",
"assets/images/sinjay1.jpg": "6885c60b28a14ffead19aaf151e4a818",
"assets/images/sinjay2.jpg": "448d38765d2c76c4dc1e69ce5fe33b72",
"assets/images/sinjay3.jpg": "2044756a403f44b1bb035f299546a5f3",
"assets/images/sinjay4.jpg": "794c513c2e25056a7a858867f7f1d451",
"assets/images/soto1.jpg": "a4f8af7e7c0bea02e854a5b93c8a9da3",
"assets/images/soto2.jpg": "0bd977524649cfb1e9443f17cd646cb8",
"assets/images/soto3.jpg": "a03e2178eb94bebf448cf3c474b974bb",
"assets/images/soto4.jpg": "45ad441298b96e8a0106216c9eaa0a07",
"assets/NOTICES": "254dc8e7b0b7aa112db0326fd3140801",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "3688efe0a39e59781b4f95efbd6b5b62",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "2198089142eb3ead13e22900b6ea166d",
"/": "2198089142eb3ead13e22900b6ea166d",
"main.dart.js": "087327eaf221c7b7b74faedb127f2853",
"manifest.json": "4a33084e1f79a1fda0ade5c3e603691f",
"version.json": "0f9bce56ce444507437dffde0ccdb766"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
