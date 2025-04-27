document.getElementById('studentForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const student_id = document.getElementById('student_id').value;
  const course = document.getElementById('course').value;
  const year_level = document.getElementById('year_level').value;
  const birthday = document.getElementById('birthday').value;

  // Check if the update button is visible to determine if we are updating
  if (!document.getElementById('updateButton').classList.contains('hidden')) {
      const id = document.getElementById('studentForm').dataset.id; // Get the ID from the dataset
      const updatedStudent = { id, name, student_id, course, year_level, birthday };

      fetch('http://localhost/student_api/api.php', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedStudent)
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          loadStudents(); // Reload the students list after updating
          clearForm(); // Clear the form after submission
      });
  } else {
      // Adding a new student
      fetch('http://localhost/student_api/api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, student_id, course, year_level, birthday })
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          loadStudents(); // Reload the students list after adding
          clearForm(); // Clear the form after submission
      });
  }
});

function loadStudents() {
  fetch('http://localhost/student_api/api.php')
  .then(response => response.json())
  .then(data => {
      const tbody = document.getElementById('studentTable').querySelector('tbody');
      tbody.innerHTML = ''; // Clear existing rows
      data.forEach((student, index) => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <td>${index + 1}</td> <!-- Display the index + 1 for numbering -->
              <td>${student.name}</td>
              <td>${student.student_id}</td>
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
  // Fetch the student's current details
  fetch(`http://localhost/student_api/api.php?id=${id}`)
  .then(response => response.json())
  .then(student => {
      // Populate the form with the student's current details
      document.getElementById('name').value = student.name || '';
      document.getElementById('student_id').value = student.student_id || '';
      document.getElementById('course').value = student.course || '';
      document.getElementById('year_level').value = student.year_level;
      document.getElementById('birthday').value = student.birthday || '';

      document.getElementById('studentForm').dataset.id = id; // Store the ID for updating
      document.getElementById('updateButton').classList.remove('hidden'); // Show update button
      document.getElementById('addButton').classList.add('hidden'); // Hide add button
  });
}

function deleteStudent(id) {
  fetch('http://localhost/student_api/api.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
  })
  .then(response => response.json())
  .then(data => {
      alert(data.message);
      loadStudents(); // Reload the students list after deleting
  })
  .catch(error => {
      console.error('Error deleting student:', error);
  });
}

function clearForm() {
  document.getElementById('studentForm').reset(); // Clear the form fields
  delete document.getElementById('studentForm').dataset.id; // Clear the ID after form reset
  document.getElementById('updateButton').classList.add('hidden'); // Hide update button
  document.getElementById('addButton').classList.remove('hidden'); // Show add button
}

loadStudents();