  
$(document).ready(function() {
  // Global Settings
  let edit = false;

  // Testing Jquery
  console.log('jquery is working!');
  fetchTasks();
  $('#task-result').hide();


  // search key type event
  $('#search').keyup(function() {
    if($('#search').val()) {
      let search = $('#search').val();
    //  console.log(search);
      $.ajax({
        url: 'task-search.php',   //   la direccion a la que estamos enviando
        data: {search},         //   el dato que estamos enviando (el valor del input)
        type: 'POST',           //  el metodo que estamos usando
        success: function (response) {   // aqui esta lo que nos respondio el servidor
          if(!response.error) {
            let tasks = JSON.parse(response);  // convertimos la respuesta del servidor en un objeto de javascript
            let template = '';
            tasks.forEach(task => {
              template += `
                     <li><a href="#" class="task-item">${task.name}</a></li>
                    ` 
            });
            $('#container').html(template);
            $('#task-result').show();
            
          }
        } 
      })
    }
  });

  $('#task-form').submit(e => {
    e.preventDefault();    //  cancela el comportamiento por defecto del formulario. (no hace el submit)
    const postData = {     // guardando los datos que se envian desde el formulario
      name: $('#name').val(),
      description: $('#description').val(),
      id: $('#taskId').val()
    };
    // esta es otra forma de enviar la informacion. como la que esta arriba (  $.ajax({});  )
    const url = edit === false ? 'task-add.php' : 'task-edit.php';  //  AQUI COMPRUEBA SI ESTA EDITANDO O ESTA CREANDO UNA TAREA NUEVA
    console.log(postData, url);
    $.post(url, postData, (response) => {
      console.log(response);
      $('#task-form').trigger('reset');   // limpia el formulario despues de enviar los datos
      fetchTasks();
    });
  });

  // Fetching Tasks
  function fetchTasks() {
    $.ajax({
      url: 'tasks-list.php',
      type: 'GET',
      success: function(response) {
        const tasks = JSON.parse(response);
        let template = '';
        tasks.forEach(task => {
          template += `
                  <tr taskId="${task.id}">
                  <td>${task.id}</td>
                  <td>
                  <a href="#" class="task-item">
                    ${task.name} 
                  </a>
                  </td>
                  <td>${task.description}</td>
                  <td>
                    <button class="task-delete btn btn-danger">
                     Delete 
                    </button>
                  </td>
                  </tr>
                `
        });
        $('#tasks').html(template);
      }
    });
  }

  // Get a Single Task by Id  -------  ESTE ES PARA EDITAR UNA TAREA
  $(document).on('click', '.task-item', (e) => {
    const element = $(this)[0].activeElement.parentElement.parentElement;
    const id = $(element).attr('taskId');
    $.post('task-single.php', {id}, (response) => {
      const task = JSON.parse(response);
      $('#name').val(task.name);
      $('#description').val(task.description);
      $('#taskId').val(task.id);
      edit = true;
    });
    e.preventDefault();
  });

  // Delete a Single Task   ---  PARA ELIMINAR LAS TAREAS
  $(document).on('click', '.task-delete', (e) => {
    if(confirm('Are you sure you want to delete it?')) {
      const element = $(this)[0].activeElement.parentElement.parentElement;
      const id = $(element).attr('taskId');
      $.post('task-delete.php', {id}, (response) => {
        fetchTasks();
      });
    }
  });
});
