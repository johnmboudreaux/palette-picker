$(function() {

  $('#generate-button').click(setAllColors);
  $('#save-project-button').click(setProject);
  $('#save-palette-button').click(createPalette);

  $( window ).on( "load", function() {
    setAllColors();
    loadProjects();
  });

  const generateRandomHex = () => {
    const value = Math.floor(Math.random() * 255).toString(16);

    return value.length === 1 ? '0' + value : value;
  };

  const generateColor = () => {
    const red = generateRandomHex();
    const green = generateRandomHex();
    const blue = generateRandomHex();
    return `#${red}${green}${blue}`;
  };

  const setColor = (color, position) => {
    $('.palette-' + position).find('h3').text(color);
    $('.palette-' + position).css('background', color);
  };

  function setAllColors() {
    for (var i = 1; i < 6; i++) {
      setColor(generateColor(), i);
    }
  }

  // fetch calls
  const loadProjects = async () => {
    const allProjects = await getProjects();
    console.log(allProjects);
  };

  function setProject() {
    let projectName = $('#save-project-input').val();
    let postBody = { 'title': projectName };

    fetch('/api/v1/projects', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(postBody)
    })
      .then(response => response.json())
      .then(parsedResponse => {
        $('#save-projects').html(parsedResponse.name);
      });
  }

  function createPalette() {
    const projectId = $("#project-selector").val();
    const paletteName = $('#save-palette-input').val();
    const color1 = $('#color1').text();
    const color2 = $('#color2').text();
    const color3 = $('#color3').text();
    const color4 = $('#color4').text();
    const color5 = $('#color5').text();
    let postBody = {
      name: paletteName,
      color1: color1,
      color2: color2,
      color3: color3,
      color4: color4,
      color5: color5,
      projectId: projectId
    };
    return fetch(`/api/v1/projects/${projectId}/palettes`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(postBody)
    });
  }

  function getProjects() {
    return fetch('/api/v1/projects')
      .then(response => response.json())
      .then(parsedResponse => {
        return parsedResponse;
      })
      .catch(error => console.log(error));
  }

  const populateDropDown = async () => {
    const optionList = document.getElementById('project-selector').options;
    const options = await getProjects();
    console.log(options);
    options.forEach( option => optionList.add(new Option(option.title, option.id)));
  };

  populateDropDown();


});
