import * as yup from 'yup';
import i18next from 'i18next';
import resources from '../locales/ru.js';
import axios from 'axios';

const runApp = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  });

  const initialState = {
    form: {
      processState: 'filling',
      errors: '',
    },
    feeds: [],
    posts: [],
    visitedPostsId: new Set(),
    currentPostId: '',
  };

  yup.setLocale({
    string: {
      default: 'NotValidUrl',
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
      .url()
      .notOneOf(watchedState.feeds.map((feed) => feed.url));
  });
};
