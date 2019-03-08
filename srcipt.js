// Format query params
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}

// News API Filter Algorithm (article title)

function searchNewsAPI(inputVal) {
  const params = {
    q: inputVal,
    language: 'en',
    pagesize: 20
  };

  const options = {
    headers: new Headers({
      'X-Api-Key': newsAPIKey
    })
  };

  const searchNewsURL = 'https://newsapi.org/v2/everything';
  const queryString = formatQueryParams(params);
  const url = searchNewsURL + '?' + queryString;

  fetch(url, options)
    .then(response => response.json())
    .then(responseJson => filterNews(responseJson, inputVal))
    .catch(error => console.log(error.message));
}

function filterNews(responseJson, inputVal) {
  let inputArray = inputVal.split(' ');
  inputArray = inputArray.map(word => {
    return word.charAt(0).toUpperCase() + word.substr(1);
  });

  let results = responseJson['articles'].map(element => {
    return element;
  });

  let relevantNews = results.map(article => {
    let wordArray = article['title'].split(' ');
    let filteredArray = wordArray.filter(word => {
      return word === inputArray[0] || word === inputArray[1];
    });
    if (filteredArray.length > 0) {
      return article;
    }
  });

  let finalResults = relevantNews.filter(articles => articles !== undefined);

  displayNews(finalResults);
}

// Display News and check for undefined image link or no paragraph content

function displayNews(finalResults) {
  let htmlContent = finalResults.map(element => {
    if (element.urlToImage === null) {
      if (element.content === null) {
        return `
        <li>
        <img src="" alt="">
          <h3>${element.title}</h3>
          <a href="${element.url}" target="_blank">Go to Article</a>
          <p>was null</p>
        </li>
        `;
      }
      return `
        <li>
          <img src="" alt="">
          <h3>${element.title}</h3>
          <a href="${element.url}" target="_blank">Go to Article</a>
          <p>${element.content}</p>
        </li>
      `;
    }

    if (element.content === null) {
      return `
      <li>
        <img src="${element.urlToImage}" alt="article image">
        <h3>${element.title}</h3>
        <a href="${element.url}" target="_blank">Go to Article</a>
        <p>was null</p>
      </li>
      `;
    }

    return `
    <li>
      <img src="${element.urlToImage}" alt="article image">
      <h3>${element.title}</h3>
      <a href="${element.url}" target="_blank">Go to Article</a>
      <p>${element.content}</p>
    </li>
    `;
  });

  $('#js-news-results').html(htmlContent);
}
