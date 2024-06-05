const getParsedRSS = (content, url = null) => {
  const parser = new DOMParser();
  const parsedContent = parser.parseFromString(content, 'application/xml');
  if (parsedContent.querySelector('parsererror')) {
    const error = new Error('notValidRss');
    error.isParsingError = true;
    error.data = parsedContent.textContent;
    throw error;
  }

  const title = parsedContent.querySelector('title').textContent;
  const description = parsedContent.querySelector('description').textContent;
  const feed = { title, description, url };

  const items = parsedContent.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const itemLink = item.querySelector('link').textContent;

    return {
      title: itemTitle,
      description: itemDescription,
      link: itemLink,
    };
  });

  return { feed, posts };
};

export default getParsedRSS;
