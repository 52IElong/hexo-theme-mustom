import part from "../common/part.js";
import util from "../common/util.js";

let tag = 'toc';
let element = null;
let setScroll = null;
let highlightId = null;

const init = (params, callback) => {
  part(tag, el => {
    element = el;
    document.querySelector(tag).replaceWith(element);
    callback && callback(element);
  });
};

const hide = o => {
  element && (element.style.display = 'none');
};

const show = o => {
  element && (element.style.display = 'block');
};

const update = (content, offset) => {
  let message = element.querySelector('[p-toc-message]');
  let main = element.querySelector('[p-toc-list]');
  if (element && element.style.display !== 'none' && content) {
    message.style.display = 'none';
    main.innerHTML = content;

    let as = main.querySelectorAll('.toc-link');
    if (as.length) {
      as.forEach(a => {
        let id = a.getAttribute('data-id');
        a.href = `javascript:scrollTo(0, document.querySelector('#${id}').offsetTop - ${offset})`;
      });

      highlightId = null;
      document.removeEventListener('scroll', setScroll);
      setScroll = e => {
        let headerlinks = document.querySelectorAll('.headerlink');
        headerlinks && util.forEach(headerlinks, h => {
          if (h.offsetTop - offset + 1 > window.scrollY) {
            let match = h.href.match(/#(.+)$/);
            if (match) {
              let id = match[1];
              if (highlightId) {
                let highlight = main.querySelector(`.toc-link[data-id="${highlightId}"]`);
                highlight && highlight.classList.remove('active');
              }
              let target = main.querySelector(`.toc-link[data-id="${id}"]`);
              target && target.classList.add('active');
              highlightId = id;
            }
            return true;
          }
        });
      };
      document.addEventListener('scroll', setScroll);
    }
  } else {
    message.style.display = 'block';
    main.innerHTML = '';
  }
};

export default {
  tag,
  init,
  hide,
  show,
  update
};