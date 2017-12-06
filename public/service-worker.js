this.addEventListener('install', event => { //this in this file will always ref service worker cana also use 'self'
  event.waitUntil(
    caches.open('assets-v1').then(cache => {
      return cache.addAll([
        '/',
        '/js/scripts.js',
        '/css/styles.css',
        '/assets/background.jpg',
        '/assets/color-wheel.jpg',
        '/assets/padlock-closed.png',
        '/assets/padlock-open.png'
      ]);//end cacheaddAll
    })//end .then()
  );//end waitUntil
});

this.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );// end respondWith
});

this.addEventListener('activate', event => {
  var cacheWhitelist = ['assets-v1'];
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
