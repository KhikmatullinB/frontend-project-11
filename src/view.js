import onChange from 'on-change';

const handleProcessState = (elements, i18nextInstance, processState) => {
  switch (processState) {
    case 'filling':
      elements.submit.disabled = false;
      break;
    case 'sending':
      elements.submit.disabled = true;
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.input.classList.remove('is-invalid');
      elements.feedback.textContent = i18nextInstance.t('process.download');
      break;
    case 'added':
      elements.submit.disabled = false;
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');
      elements.input.classList.remove('is-invalid');
      elements.feedback.textContent = i18nextInstance.t('success.rss');

      elements.form.reset();
      elements.input.focus();
      break;
    case 'error':
      elements.submit.disabled = false;
      elements.input.focus();
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }

  const renderErrors = (elements, i18nextInstance, errorValue) => {
    if (errorValue === '') {
      return;
    }
    elements.feedback.classList.remove('text-success');
    elements.feedback.classList.add('text-danger');
    elements.input.classList.add('is-invalid');

    elements.feedback.textContent = i18nextInstance.t(`errors.${errorValue}`);
  };

  const renderFeeds = (elements, i18nextInstance, feeds) => {
    elements.feeds.innerHTML = '';
    const container = document.createElement('div');
    container.classList.add('card', 'border-0');
    elements.feeds.append(container);

    const div = document.createElement('div');
    div.classList.add('card-body');
    container.append(div);

    const h2 = document.createElement('h2');
    h2.classList.add('card-title', 'h4');
    h2.textContent = i18nextInstance.t('main.feeds');
    div.append(h2);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    container.append(ul);

    feeds.forEach((feed) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'border-0', 'border-end-0');
      const h3 = document.createElement('h3');
      h3.classList.add('h6', 'm-0');
      h3.textContent = feed.title;
      li.append(h3);
      const p = document.createElement('p');
      p.classList.add('m-0', 'small', 'text-black-50');
      p.textContent = feed.description;
      li.append(p);

      ul.append(li);
    });
  };
};
