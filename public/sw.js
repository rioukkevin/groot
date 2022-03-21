self.addEventListener('install', function(event) {
  var indexPage = new Request('/');
  event.waitUntil(
    fetch(indexPage).then(function(response) {
      return caches.open('kevinrioupro-offline').then(function(cache) {
        console.log('Jarvis:  Let\'s do it'+ response.url);
        return cache.put(indexPage, response);
      });
  }));
});

self.addEventListener('fetch', function(event) {
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }
  var updateCache = function(request){
    return caches.open('kevinrioupro-offline').then(function (cache) {
      return fetch(request).then(function (response) {
        return cache.put(request, response);
      });
    });
  };

  event.waitUntil(updateCache(event.request));

  event.respondWith(
    fetch(event.request).catch(function(error) {
      console.log( 'Jarvis: Network request Failed. Serving content from cache: ' + error );
      return caches.open('kevinrioupro-offline').then(function (cache) {
        return cache.match(event.request).then(function (matching) {
          var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
          return report
        });
      });
    })
  );
})
