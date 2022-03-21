if (navigator.serviceWorker.controller) {
  console.log('Jarvis: I found the Service Worker ;)')
} else {
  navigator.serviceWorker.register('sw.js', {
    scope: './'
  }).then(function(reg) {
    console.log('Jarvis: Service worker has been registered for scope:'+ reg.scope);
  });
}

