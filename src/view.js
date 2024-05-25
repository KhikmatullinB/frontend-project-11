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
};
