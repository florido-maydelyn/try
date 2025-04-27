document.getElementById('student_form').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const course = document.getElementById('course').value;
  const year_level = document.getElementById('year_level').value;
  const birthday = document.getElementById('birthday').value;

  if (!document.getElementById('update_button').classList.contains('hidden')) {
      const id = document.getElementById('student_form').dataset.id;
      const updatedStudent = { id, name, email, course, year_level, birthday };

      fetch('https://restapi.hershive.com/florido/florido_end_file.php', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedStudent)
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          loadStudents();
          clearForm();
      });
  } else {
      fetch('https://restapi.hershive.com/florido/florido_end_file.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, course, year_level, birthday })
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          loadStudents();
          clearForm();
      });
  }
});

function loadStudents() {
  fetch('https://restapi.hershive.com/florido/florido_end_file.php')
  .then(response => response.json())
  .then(data => {
      const tbody = document.getElementById('student_table').querySelector('tbody');
      tbody.innerHTML = '';
      data.forEach((student, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${index + 1}</td>
              <td>${student.name}</td>
              <td>${student.email}</td>
              <td>${student.course}</td>
              <td>${student.year_level}</td>
              <td>${student.birthday}</td>
              <td>
                  <button onclick="editStudent(${student.id})">Edit</button>
                  <button onclick="deleteStudent(${student.id})">Delete</button>
              </td>
          `;
          tbody.appendChild(row);
      });
  })
  .catch(error => {
      console.error('Error loading students:', error);
  });
}

function editStudent(id) {
  fetch(`https://restapi.hershive.com/florido/florido_end_file.php?id=${id}`)
  .then(response => response.json())
  .then(student => {
      document.getElementById('name').value = student.name || '';
      document.getElementById('email').value = student.email || '';
      document.getElementById('course').value = student.course || '';
      document.getElementById('year_level').value = student.year_level;
      document.getElementById('birthday').value = student.birthday || '';

      document.getElementById('student_form').dataset.id = id;
      document.getElementById('update_button').classList.remove('hidden');
      document.getElementById('add_button').classList.add('hidden');
  });
}

function deleteStudent(id) {
  fetch('https://restapi.hershive.com/florido/florido_end_file.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
  })
  .then(response => response.json())
  .then(data => {
      alert(data.message);
      loadStudents();
  })
  .catch(error => {
      console.error('Error deleting student:', error);
  });
}

function clearForm() {
  document.getElementById('student_form').reset();
  delete document.getElementById('student_form').dataset.id;
  document.getElementById('update_button').classList.add('hidden');
  document.getElementById('add_button').classList.remove('hidden');
}

loadStudents();
