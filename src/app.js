import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import _ from 'lodash';
import resources from './locales/locales.js';
import getParsedRSS from './rssParser.js';
import watch from './view.js';

const timeout = 5000;

const buildProxiedUrl = (url) => {
  const proxiedUrl = new URL('https://allorigins.hexlet.app/get');
  proxiedUrl.searchParams.set('disableCache', 'true');
  proxiedUrl.searchParams.set('url', url);
  return proxiedUrl;
};
const getDownloadedRss = (url) => axios.get(buildProxiedUrl(url));

const runApp = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const initialState = {
    form: {
      state: 'filling',
      errors: '',
    },
    feeds: [],
    posts: [],
    visitedPostsId: new Set(),
    currentPostId: '',
  };

  yup.setLocale({
    string: {
      default: 'notValidUrl',
    },
    mixed: {
      notOneOf: 'notOneOf',
    },
  });

  const input = document.querySelector('#url-input');
  const form = document.querySelector('.rss-form');
  const feedback = document.querySelector('.feedback');
  const submit = document.querySelector('button[type="submit"]');
  const feeds = document.querySelector('.feeds');
  const posts = document.querySelector('.posts');
  const modal = document.querySelector('#modal');

  const elements = {
    input,
    form,
    feedback,
    submit,
    feeds,
    posts,
    modal,
  };

  const watchedState = watch(initialState, elements, i18nextInstance);

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const inputValue = formData.get('url');

    const schema = yup
      .string()
      .required()
      .url('notValidUrl')
      .notOneOf(watchedState.feeds.map((feed) => feed.url));

    schema
      .validate(inputValue)
      .then(() => {
        watchedState.form.errors = '';
        watchedState.form.state = 'sending';
        return getDownloadedRss(inputValue);
      })
      .then((response) => {
        const parsedContent = getParsedRSS(response.data.contents);
        const { feed, posts } = parsedContent;
        const itemId = posts.map((item) => ({ ...item, id: _.uniqueId() }));
        watchedState.feeds.unshift(feed);
        watchedState.posts.unshift(itemId);
        watchedState.form.errors = '';
        watchedState.form.state = 'added';
      })
      .catch((err) => {
        watchedState.form.state = 'error';
        if (err.isAxiosError) {
          watchedState.form.errors = 'network';
        } else if (err.isParsingError) {
          watchedState.form.errors = 'notValidRss';
        } else if (err.name === 'ValidationError') {
          watchedState.form.errors = err.message;
        } else {
          watchedState.form.errors = 'unknown';
        }
      });
  });
  elements.posts.addEventListener('click', (event) => {
    const currentId = event.target.dataset.id;
    watchedState.visitedPostsId.add(currentId);
    watchedState.currentPostId = currentId;
  });

  const updateRssPosts = () => {
    const urls = watchedState.feeds.map((feed) => feed.url);
    const promises = urls.map((url) => getDownloadedRss(url).then((updatedResponse) => {
      const updatedParsedContent = getParsedRSS(updatedResponse.data.contents);
      const { posts: newPosts } = updatedParsedContent;
      const addedPostsLinks = watchedState.posts.map((post) => post.link);
      const addedNewPosts = newPosts.filter((post) => !addedPostsLinks.includes(post.link));
      watchedState.posts = addedNewPosts.concat(watchedState.posts);
      console.log(addedNewPosts);
    })
      .catch((err) => {
        throw err;
      }));
    Promise.all(promises).finally(() => setTimeout(() => updateRssPosts(), timeout));
  };
  updateRssPosts();
};

export default runApp;
