
const getProjects = () => {
  return fetch('/api/v1/projects')
    .then(response => response.json())
    .then(parsedResponse => parsedResponse)
    .catch(error => console.log(error));
};
