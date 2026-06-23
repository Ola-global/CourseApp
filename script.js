const sections = document.querySelectorAll(".view");
const courseList = document.getElementById("courseList");
const form = document.getElementById("courseForm");
const formTitle = document.getElementById("formTitle");

document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
  showSection('home');
});

function showSection(id) {
  sections.forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  if (id === "courses") renderCourses();
  if (id === "home") updateDashboard();
  
  window.scrollTo(0, 0);
}

function getCourses() {
  return JSON.parse(localStorage.getItem("courses")) || [];
}

function saveCourses(courses) {
  localStorage.setItem("courses", JSON.stringify(courses));
  updateDashboard(); 
}

function updateDashboard() {
  const courses = getCourses();
  const totalUnits = courses.reduce((sum, course) => sum + parseInt(course.unit || 0), 0);
  
  document.getElementById('stat-total-courses').innerText = courses.length;
  document.getElementById('stat-total-units').innerText = totalUnits;

  const welcomeMsg = document.getElementById('welcome-msg');
  if (welcomeMsg) {
    welcomeMsg.innerText = courses.length > 0 ? "Welcome Back" : "Welcome";
  }

  const recentList = document.getElementById('recent-activity');
  if (recentList) {
    recentList.innerHTML = "";

    if (courses.length === 0) {
      recentList.innerHTML = "<p style='color: #6b7280; font-size: 0.9rem;'>No courses added yet.</p>";
    } else {
      const recent = courses.slice(-3).reverse();
      recent.forEach(course => {
        const div = document.createElement('div');
        div.className = 'recent-item';
        div.innerHTML = `
          <span>${course.title}</span>
          <strong>${course.code}</strong>
        `;
        recentList.appendChild(div);
      });
    }
  }
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const code = document.getElementById("code").value.trim();
  const unit = document.getElementById("unit").value;
  const editIndex = document.getElementById("editIndex").value;

  let courses = getCourses();

  if (editIndex === "") {
    courses.push({ title, code, unit });
  } else {
    courses[editIndex] = { title, code, unit };
    formTitle.innerText = "Add New Course"; 
  }

  saveCourses(courses);
  form.reset();
  document.getElementById("editIndex").value = "";

  showSection("courses");
});

function renderCourses() {
  const courses = getCourses();
  courseList.innerHTML = "";

  if (courses.length === 0) {
    courseList.innerHTML = `
      <div class="glass card" style="grid-column: 1/-1; text-align: center;">
        <p>No courses found in your records.</p>
        <button class="nav-btn" style="color: #059669; margin-top: 10px;" onclick="showSection('add')">Add your first course</button>
      </div>
    `;
    return;
  }

  courses.forEach((course, index) => {
    const div = document.createElement("div");
    div.className = "course-card";

    div.innerHTML = `
      <span class="course-code">${course.code}</span>
      <h3>${course.title}</h3>
      <p class="course-unit"><strong>Units:</strong> ${course.unit}</p>

      <div class="actions">
        <button class="btn-small edit-btn" onclick="editCourse(${index})">Edit Details</button>
        <button class="btn-small delete-btn" onclick="deleteCourse(${index})">Remove</button>
      </div>
    `;

    courseList.appendChild(div);
  });
}

function editCourse(index) {
  const courses = getCourses();
  const course = courses[index];

  document.getElementById("title").value = course.title;
  document.getElementById("code").value = course.code;
  document.getElementById("unit").value = course.unit;
  document.getElementById("editIndex").value = index;

  formTitle.innerText = "Modify Course"; 
  showSection("add");
}

function deleteCourse(index) {
  if (confirm("Are you sure you want to delete this course?")) {
    const courses = getCourses();
    courses.splice(index, 1);
    saveCourses(courses);
    renderCourses();
  }
}