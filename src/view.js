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
  }
};
