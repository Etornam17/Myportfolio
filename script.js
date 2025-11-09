document.addEventListener("DOMContentLoaded", () => {
  const addProjectBtn = document.getElementById("addProjectBtn");
  const uploadForm = document.querySelector(".upload-box");
  const projectGallery = document.querySelector(".project-gallery");

  // Load existing projects from localStorage
  let projects = JSON.parse(localStorage.getItem("projects")) || [];

  // Display projects on load
  displayProjects();

  // Toggle the upload form visibility
  addProjectBtn.addEventListener("click", () => {
    uploadForm.style.display =
      uploadForm.style.display === "none" || uploadForm.style.display === ""
        ? "flex"
        : "none";
  });

  // Handle form submission
  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = uploadForm.querySelector('input[type="text"]').value.trim();
    const link = uploadForm.querySelector('input[type="url"]').value.trim();
    const fileInput = uploadForm.querySelector('input[type="file"]');
    const uploadedFile = fileInput.files[0] || null;

    if (!title) {
      alert("Please enter a project title.");
      return;
    }

    const newProject = {
      id: Date.now(),
      title,
      link: link || null,
      fileName: uploadedFile ? uploadedFile.name : null,
      fileType: uploadedFile ? uploadedFile.type : null,
      image: null,
    };

    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        newProject.image = reader.result;
        saveProject(newProject);
      };
      reader.readAsDataURL(uploadedFile);
    } else {
      saveProject(newProject);
    }
  });

  // Save project to localStorage
  function saveProject(project) {
    projects.push(project);
    localStorage.setItem("projects", JSON.stringify(projects));
    displayProjects();
    uploadForm.reset();
    uploadForm.style.display = "none";
  }

  // Display all saved projects
  function displayProjects() {
    projectGallery.innerHTML = "";

    projects.forEach((proj) => {
      const card = document.createElement("div");
      card.classList.add("project-card");

      card.innerHTML = `
        ${proj.image ? `<img src="${proj.image}" alt="Project Screenshot">` : ""}
        <h3>${proj.title}</h3>
        ${proj.link ? `<a href="${proj.link}" target="_blank">🔗 View Project</a>` : ""}
        ${proj.fileName ? `<p>📎 File: ${proj.fileName}</p>` : ""}
        <button class="delete-btn">🗑 Delete</button>
      `;

      card.querySelector(".delete-btn").addEventListener("click", () => deleteProject(proj.id));
      projectGallery.appendChild(card);
    });
  }

  // Delete a project by ID
  function deleteProject(id) {
    projects = projects.filter((proj) => proj.id !== id);
    localStorage.setItem("projects", JSON.stringify(projects));
    displayProjects();
  }
});
