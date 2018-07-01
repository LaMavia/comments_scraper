import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Comment } from './interfaces/comment.interface';
import { User } from './interfaces/user.interface';
import { inBrowser } from './inbrowser/main';

@Injectable()
export class ReaderService {
  async getComments(
    url: string,
    waitForComments: number,
    waitAfterScroll: number,
  ): Promise<Comment[]> {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1920,
      height: 1080,
    });

    await page.goto(url, { waitUntil: 'networkidle2' }).catch(console.error);
    const comments: Comment[] = await page
      .evaluate(inBrowser, waitForComments, waitAfterScroll)
      .catch(err => new Promise((_res, rej) => {
        browser.close()
        return rej(err)
      }));
    await browser.close();
    return comments || [];

    /*fetch(
      'https://www.youtube.com/comment_service_ajax?action_get_comments=1&pbj=1&ctoken=Eh4SC3VGN1pfZGUyRUxRwAEAyAEA4AEBogIFKKMDQAAYBjKKAwr0AkFEU0pfaTBkdzI4U1FCMkxuR204OUJtZDNYS0U3cHc0dXVvSEFRNmFiVFZ1T3R2NW1rV2kxODlGTDRFY1E3WjNRbDJUc3ZFb1pyakdaam5JQ0kwUjBqMGJHZ2VqRWV3eXFNZU16N01iakxtdGxPZURjUXZDdlpib1V5bWFnbFRxQ0Z0Y002cENlNDcxVV9tbWdNR245RkNRRVZQUWFVTHNiSVNPMXZmdUJfa0xBcnpTYW9ybmJZallkTHAwZ2tuOU5HRDdvdWt1SllqQVRFMWF5clFfTE05TjQzaEg2aXZvRFUySGE2RlRwZFpLeEhfVHZ4dno4cVFFVEtGTjctYkJ1NE11MWtld01ZcWZya2N4Ui01Zy04ZDdGbVlSTFFDWFZSSTMyZ1dta2dvcDRFNThiamhVaVotOTZuMEpnaTVycGJMYy01akU1YjNlc2hOTDBZMWJDaEdQZlBRWXZ4ZEJ0WFJ5UEx5eUR0VW1aZHhacjgzbSIPIgt1RjdaX2RlMkVMUTAAKBQ%253D&continuation=Eh4SC3VGN1pfZGUyRUxRwAEAyAEA4AEBogIFKKMDQAAYBjKKAwr0AkFEU0pfaTBkdzI4U1FCMkxuR204OUJtZDNYS0U3cHc0dXVvSEFRNmFiVFZ1T3R2NW1rV2kxODlGTDRFY1E3WjNRbDJUc3ZFb1pyakdaam5JQ0kwUjBqMGJHZ2VqRWV3eXFNZU16N01iakxtdGxPZURjUXZDdlpib1V5bWFnbFRxQ0Z0Y002cENlNDcxVV9tbWdNR245RkNRRVZQUWFVTHNiSVNPMXZmdUJfa0xBcnpTYW9ybmJZallkTHAwZ2tuOU5HRDdvdWt1SllqQVRFMWF5clFfTE05TjQzaEg2aXZvRFUySGE2RlRwZFpLeEhfVHZ4dno4cVFFVEtGTjctYkJ1NE11MWtld01ZcWZya2N4Ui01Zy04ZDdGbVlSTFFDWFZSSTMyZ1dta2dvcDRFNThiamhVaVotOTZuMEpnaTVycGJMYy01akU1YjNlc2hOTDBZMWJDaEdQZlBRWXZ4ZEJ0WFJ5UEx5eUR0VW1aZHhacjgzbSIPIgt1RjdaX2RlMkVMUTAAKBQ%253D&itct=CAcQybcCIhMI-9z3o6v92wIVlNlVCh15WQXD',
      {
        credentials: 'include',
        headers: {},
        referrer: 'https://www.youtube.com/watch?v=uF7Z_de2ELQ',
        referrerPolicy: 'origin-when-cross-origin',
        body:
          'session_token=QUFFLUhqa0s2alhOWGR0X0hCeTBNanNhWGFDUG56aDE4d3xBQ3Jtc0tueGl4Z1NaQ2hQMzRyWkxLSjNMZVhGSndlOVBuM2dzeWlLMG4xS213SzdfZlVhS0Zob2hWX3hnNXlUOHAxbWlWcjBsZzJCM3pkTWhCOEFqbEp1MC1Pd3ZHMG00LXdnV3lkQjFIb1dIeG5sTjk2VDVBOWN5WmxENnBON25EclBhZUU1VXNFSk1IMzZtS29aWXlsN2FlMVJEdkJTM3loSVZIREVvQnFlNERrUFZ3NmdVQUU%3D',
        method: 'POST',
        mode: 'cors',
      },
    );*/
  }
}
/*.map(
            (el): Comment => {
              const Image: string = el
                .querySelector('img#img')
                .getAttribute('src');
              const Name: string = el.querySelector(
                'span.style-scope.ytd-comment-renderer',
              ).innerHTML;
              const Url = el
                .querySelector('a.yt-simple-endpoint')
                .getAttribute('href');
              const Content = el.querySelector('#content-text').innerHTML;
              const Likes = +el.querySelector('span#vote-count-left')
                .innerHTML;
              return {
                Author: {
                  Image,
                  Name,
                  Url,
                },
                Content,
                Likes,
              };
            },
          );*/
