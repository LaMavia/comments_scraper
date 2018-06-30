export function inBrowser(waitForComments = 850, waitAfterScroll = 2500) {
  const wait = ms => new Promise(res => setTimeout(res, ms));
  return new Promise((resolve, reject) => {
    // window.scrollBy(0, window.innerHeight);
    document.getElementById('meta').scrollIntoView();

    return wait(1300).then(() => {
      // TODO Optimize that wait func.
      const commentsBox = document.querySelector(
        'div#contents.style-scope.ytd-item-section-renderer'
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

      function ds() {
        return (
          document.scrollingElement.scrollHeight -
          document.scrollingElement.scrollTop -
          window.innerHeight
        );
      }

      function mutationCallback(mutationList) {
        clearTimeout(timer);
        for (const mut of mutationList) {
          if (mut.type === 'childList') {
            wait(waitForComments).then(() => {
              const newComments = retrieveComments(mut.target);
              if (newComments) {
                comments = comments.concat(
                  newComments.filter(
                    newComment =>
                      !comments.some(
                        oldComment => newComment.Content === oldComment.Content,
                      ),
                  ),
                );
              }
            });
          }
        }
        // Scroll for more events to trigger
        window.scrollBy(0, window.innerHeight); // document.scrollingElement.scrollHeight * 0.5
        document.scrollingElement.dispatchEvent(new UIEvent('scroll'));

        timer = setTimeout(() => resolve(comments), waitAfterScroll);
      }

      function retrieveComments(box) {
        console.log(box);
        const comments = [...document.querySelectorAll('#body')].map(el => {
          debugger;
          const Image = el
            .querySelector('img#img.yt-img-shadow')
            .getAttribute('src');
          debugger;
          const Name = el
            .querySelector('span.style-scope.ytd-comment-renderer')
            .innerHTML.replace(/\n\s*/g, '');
          const Url = el
            .querySelector('a.yt-simple-endpoint')
            .getAttribute('href');
          const Content = el.querySelector('#content-text').innerHTML;
          const Likes = +el.querySelector('span#vote-count-left').innerHTML;
          return {
            Author: {
              Image,
              Name,
              Url,
            },
            Content,
            Likes,
          };
        });
        return comments;
      }
    });
  });
}
