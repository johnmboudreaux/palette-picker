$(function() {

  $('#generate-button').click(setAllColors);
  $('#save-project-button').click(setProject);
  $('#save-palette-button').click(createPalette);
  $('body').on('click', '#swatch-delete-button', deletePalette)

  $(window).on("load", function() {
    setAllColors();
    loadProjects();
  });

  function generateRandomHex() {
    const value = Math.floor(Math.random() * 255).toString(16);

    return value.length === 1
      ? '0' + value
      : value;
  }

  function generateColor() {
    const red = generateRandomHex();
    const green = generateRandomHex();
    const blue = generateRandomHex();
    return `#${red}${green}${blue}`;
  }

  function setColor(color, position) {
    $('.palette-' + position).find('h3').text(color);
    $('.palette-' + position).css('background', color);
  }

  function setAllColors() {
    for (var i = 1; i < 6; i++) {
      setColor(generateColor(), i);
    }
  }

  function lockColor() {
    
  }

  // async functions
  async function loadProjects() {
    const allProjects = await getProjects();
    console.log(allProjects);
  }

  function setProject() {
    let projectName = $('#save-project-input').val();
    let postBody = {
      'title': projectName
    };

    fetch('/api/v1/projects', {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(postBody)
    }).then(response => response.json()).then(parsedResponse => {
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
    fetch(`/api/v1/projects/${projectId}/palettes`, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(postBody)
    }).then(populateDropDown());
  }

  function appendPalette(palettes) {
    $('#projects').html('');
    palettes.forEach((palette) => {
      return fetch(`/api/v1/projects/${palette.id}/palettes`).then(response => response.json()).then(parsedResponse => {
        $('#projects').append(`
            <h5>${palette.title}</h5>
            <div class="color-palette" id="project-palette${palette.id}">
            </div>`);
        if (parsedResponse) {
          parsedResponse.forEach((item) => {
            $('#project-palette' + palette.id).append(`<div>
              <h5>${item.name}</h5>
                <div class="color-swatch left-border" style="background: ${item.color1}"></div>
                <div class="color-swatch" style="background: ${item.color2}"></div>
                <div class="color-swatch" style="background: ${item.color3}"></div>
                <div class="color-swatch" style="background: ${item.color4}"></div>
                <div class="color-swatch right-border" style="background: ${item.color5}"></div>
                <button class="delete-button" id="swatch-delete-button" data-palette-id="${item.id}">X</button>
              </div>`);
          });
        }
      });
    });
  }

  function deletePalette(event) {
    let paletteId = $(event.target).attr('data-palette-id');
    fetch(`/api/v1/palettes/${paletteId}`, {method: 'DELETE'}).then(response => {
      populateDropDown();
    }).catch(error => console.log(error));
  }

  function getProjects() {
    return fetch('/api/v1/projects').then(response => response.json()).then(parsedResponse => {
      return parsedResponse;
    }).catch(error => console.log(error));
  }

  async function populateDropDown() {
    const optionList = $('#project-selector');
    const options = await getProjects();
    appendPalette(options);
    optionList.html('');
    options.forEach(option => optionList.append(`<option value="${option.id}">${option.title}</option>`))
  }

  populateDropDown();

});
