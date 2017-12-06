/*eslint-disable */
$(function() {
  $('#generate-button').click(setAllColors);
  $('#save-project-button').click(checkProjectName);
  $('#destroy-project-button').click(deleteProject);
  $('#save-palette-button').click(createPalette);
  $('body').on('click', '#swatch-delete-button', deletePalette);
  $('.palette-container').on('click', '.lock', (event) => toggleLock(event.target));
  $('.right-side').on('click', '.colors', event => selectToDisplayMainPalette(event.target));


  //feature detection
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(error => {
        console.log(`ServiceWorker reg failed: ${error}`);
      });
    });//end event listener
  }

  setAllColors();
  loadProjects();

  function generateRandomHex() {
    const value = Math.floor(Math.random() * 255).toString(16);
    return value.length === 1 ? '0' + value : value;
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
      const color = generateColor();
      if (!$(`.palette-${i}`).hasClass('locked')) {
        setColor(color, i);
      }
    }
  }

  function toggleLock(target) {
    const lock = $(target);

    if (lock.attr('src') === '../assets/padlock-open.png') {
      lock.attr('src', './assets/padlock-closed.png');
      lock.closest('.palette-color-container').addClass('locked');
    } else {
      lock.attr('src', '../assets/padlock-open.png');
      lock.closest('.palette-color-container').removeClass('locked');
    }
  }

  function selectToDisplayMainPalette(eventTarget) {
    const palette = eventTarget.closest('.colors');

    for (let i = 1; i < 6; i++) {
      const smallColor = $(palette).find(`.select-main-palette${i}`).css('background-color');
      setColor(smallColor, i);
    }
  }

  async function loadProjects() {
    const allProjects = await getProjects();
  }

  function setProject(projectName) {
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
    }).then(response => response.json()).then(() => {
      populateDropDown();
    });
  }

  function checkProjectName() {
    const projectTitle = $('#save-project-input').val();
    $('#save-project-input').val('');
    fetch(`/api/v1/projects/`)
      .then(response => response.json())
      .then(projects => {
        const match = projects.find(project => projectTitle === project.title);
        if (!match) {
          setProject(projectTitle);
        } else {
          alert('Duplicate project names not allowed.');
        }
      });
  }

  function createPalette() {
    const projectId = $("#project-selector").val();
    const paletteName = $('#save-palette-input').val();
    $('#save-palette-input').val('');
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
            <h5 id="palette-${palette.id}">${palette.title}</h5>
            <div class="color-palette" id="project-palette${palette.id}">
            </div>`);
        if (parsedResponse) {
          parsedResponse.forEach((item) => {
            $('#project-palette' + palette.id).append(
              `<div class="dynamic-swatch-container">
                <h5 class="swatch-title">${item.name}</h5>
                <div class="colors">
                  <div class="color-swatch select-main-palette1 left-border" style="background: ${item.color1}"></div>
                  <div class="color-swatch select-main-palette2" style="background: ${item.color2}"></div>
                  <div class="color-swatch select-main-palette3" style="background: ${item.color3}"></div>
                  <div class="color-swatch select-main-palette4" style="background: ${item.color4}"></div>
                  <div class="color-swatch select-main-palette5 right-border" style="background: ${item.color5}"></div>
                  <button class="delete-button" id="swatch-delete-button" data-palette-id="${item.id}">X</button>
                </div>
              </div>`);
          });
        }
      });
    });
  }

  function deletePalette(event) {
    let paletteId = $(event.target).attr('data-palette-id');
    fetch(`/api/v1/palettes/${paletteId}`, {method: 'DELETE'}).then(response => {
      populateDropDown(response);
    }).catch(error => console.log(error));
  }

  function getProjects() {
    return fetch('/api/v1/projects').then(response => response.json()).then(parsedResponse => {
      return parsedResponse;
    }).catch(error => console.log(error));
  }

  async function deleteProject() {
    const projectId = $('#delete-project-selector').val();
    fetch(`/api/v1/projects/${projectId}`, {method: 'DELETE'}).then(response => {
      populateDropDown(response);
    }).catch(error => console.log(error));
  }

  async function populateDropDown() {
    const optionList = $('#project-selector');
    const deleteOptionList = $('#delete-project-selector');
    const options = await getProjects();
    appendPalette(options);
    optionList.html('');
    deleteOptionList.html('');
    optionList.append(`<option value="" selected>Project Name</option>`);
    deleteOptionList.append(`<option value="" selected>Project Name</option>`);
    options.forEach(option => {
      optionList.append(`<option value="${option.id}">${option.title}</option>`);
      deleteOptionList.append(`<option value="${option.id}">${option.title}</option>`);
    });
  }

  populateDropDown();
});
