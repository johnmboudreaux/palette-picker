(function($){
  function init() {
    $.ajax({
      url: '/api/v1/projectFolders',
      method: 'GET',
      dataType: 'json'
    }).done(function(response) {
      console.log(response);
    })
      .fail(function(error) {
        console.log(error);
      });

    $('#button').click(function() {
      $.ajax({
        url: '/api/v1/createProject',
        method: 'POST',
        dataType: 'json',
        projectData: {id: 1, name: 'project2', palettes: [] }
      }).done(function(response) {
        console.log(response);
      })
        .fail(function(error) {
          console.log(error);
        });
    });
  }

  $(init);


})(window.jquery);
