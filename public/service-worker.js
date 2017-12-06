this.addEventListener('install', event => {
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
        '/',
        '/scripts.js',
        '/css/styles.css',
        '/assets/color-wheel.jpg',
        '/assets/background.jpg',
        '/assets/padlock-open.jpg',
        '/assets/padlock-closed.jpg'
        // '/lib/jquery-3.2.1.js'
      ]);// end cache.addAll
    })// end .then
  );// end wait until
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })// end of .match
  );// end of respondWith
});

this.addEventListener('activate', event => {
  let cacheWhiteList = ['assets-v2'];

  event.waitUntil(
    caches.keys().then(keylist => {
      return promise.all(keylist.map(key => {
        if (cacheWhiteList.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
