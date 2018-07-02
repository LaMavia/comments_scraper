export function inBrowser(waitForComments = 850, waitAfterScroll = 2500) {
  const wait = ms => new Promise(res => setTimeout(res, ms));
  return new Promise((resolve, reject) => {
    const commentsBox = document.querySelector(
      'div#contents.style-scope.ytd-item-section-renderer',
    );
    const observerConfig = {
      attributes: false,
      childList: true,
      subtree: true,
    };
    const observer = new MutationObserver(mutationCallback);
    let comments = [];
    let timer;
    observer.observe(commentsBox, observerConfig);

    window.scrollBy(0, window.innerHeight * 1);
    document.body.dispatchEvent(new UIEvent('scroll'));
    window.scrollBy(0, window.innerHeight * -0.3);

    function mutationCallback(mutationList) {
      clearTimeout(timer);
      let target
      window.scrollBy(0, document.scrollingElement.scrollHeight * 0.5); // document.scrollingElement.scrollHeight * 0.5
      document.scrollingElement.dispatchEvent(new UIEvent('scroll'));
      for (const mut of mutationList) {
        if (mut.type === 'childList') {
          target = mut.target
        }
      }

      timer = setTimeout((target) => {
        comments ? resolve(retrieveComments(target).filter(Boolean)) : clearTimeout(timer);
      }, waitAfterScroll, target);
    }

    function retrieveComments(box) {
      return [...document.querySelectorAll('#body')].map(el => {
        const Image = el
          .querySelector('img#img.yt-img-shadow')
          .getAttribute('src');
        const Name = el
          .querySelector('span.style-scope.ytd-comment-renderer')
          .innerHTML.replace(/\n\s*/g, '');
        const Url = el
          .querySelector('a.yt-simple-endpoint')
          .getAttribute('href');
        const Content = el.querySelector('#content-text').innerHTML;
        const Likes = +el.querySelector('span#vote-count-left').innerHTML;
        return !Image ? null : {
          Author: {
            Image,
            Name,
            Url,
          },
          Content,
          Likes,
        };
      });
    }
  });
}
