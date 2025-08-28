function handleClick() {
  const value = document.getElementById("numTeachers").value;
  const num_division = document.getElementById("numDivision").value;
  localStorage.setItem("number_of_teacher", value);
  localStorage.setItem("number_of_division", num_division);
  location.href = "Details.html";
}

function generateTeacherForm() {
  const numTeachers = localStorage.getItem("number_of_teacher");
  const formContainer = document.getElementById("teacherFormContainer");
  formContainer.innerHTML = "";

  for (let i = 1; i <= numTeachers; i++) {
    let div = document.createElement("div");
    div.innerHTML = `
      <h3>Teacher ${i}</h3>
      <input type="text" placeholder="Teacher Name" class="teacherName">
      <input type="text" placeholder="Teacher ID" class="teacherId">
      <input type="text" placeholder="Subject" class="subject">
      </div>
    `;
    formContainer.appendChild(div);
  }
}

function submitData() {
  let teachers = [];

  document.querySelectorAll("#teacherFormContainer > div").forEach((div, i) => {
    const name = div.querySelector(".teacherName")?.value.trim();
    const teacherIDRaw = div.querySelector(".teacherId")?.value.trim();
    const subject = div.querySelector(".subject")?.value.trim();
    // const statusInput = div.querySelector(`input[name="status${i + 1}"]:checked`);
    // const status = statusInput ? statusInput.value : null;

    const teacherID = teacherIDRaw && !isNaN(teacherIDRaw) ? parseInt(teacherIDRaw) : null;

    if (name && teacherID !== null && subject) {
      teachers.push({ name, teacherID, subject});
    } else {
      console.warn(`Skipping incomplete teacher entry at index ${i + 1}`);
    }
  });

  console.log("Submitting these teachers:", teachers);

  // Submit to MongoDB if there's at least one valid teacher
  if (teachers.length > 0) {
    fetch("http://localhost:1000/api/teachers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ teachers }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Data saved in MongoDB:", data);
        alert("Data saved successfully!");
        location.href = "timetable.html";
      })
      .catch(error => {
        console.error("Error saving data:", error);
        alert("Error saving teacher data.");
      });
  } else {
    alert("No complete teacher data to submit.");
  }
}

