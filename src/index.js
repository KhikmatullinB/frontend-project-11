import { data } from './data.js';

const root = document.getElementById('app');

data.forEach((element) => {
  const item = document.createElement('div');
  item.textContent = element;
  item.classList.add('item');
  root.appendChild(item);
});
