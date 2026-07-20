(async function loadSiteFooter(){
  const mount = document.getElementById('site-footer');
  if(!mount) return;

  try{
    const requestUrl = new URL('./footer.html', window.location.href);
    const response = await fetch(requestUrl);
    if(!response.ok) throw new Error(`Footer request failed: ${response.status}`);
    const footerUrl = new URL(response.url || requestUrl.href);

    const template = document.createElement('template');
    template.innerHTML = (await response.text()).trim();
    const fragment = template.content;
    const footer = fragment.querySelector('.site-footer');
    if(!footer) throw new Error('footer.html does not contain .site-footer');

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    footer.querySelectorAll('a[href]').forEach(function(link){
      const href = link.getAttribute('href');

      if(href === currentPage){
        link.classList.add('current');
        link.setAttribute('aria-current', 'page');
      }

      if(href && !href.startsWith('#') && !/^[a-z][a-z0-9+.-]*:/i.test(href)){
        link.href = new URL(href, footerUrl).href;
      }
    });

    mount.replaceWith(fragment);
  }catch(error){
    console.error('Unable to load the shared site footer.', error);
  }
})();
