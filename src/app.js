import * as yup from 'yup';

const runApp = () => {
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

const elements = {
    former: document.querySelector('form'),
    input: document.querySelector('input'),
    button: document.querySelector('button'),
    
}
}