const nameInput = document.getElementById("name");
const linkInput = document.getElementById("link");
const saveBtn = document.getElementById("save");
const formGroupLink = document.querySelector(".form-link");
const formGroupName = document.querySelector(".form-name");

function isValidURL(url) {
  const regex =
    /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
  return regex.test(url);
}

function getBookmarks() {
  return JSON.parse(localStorage.getItem("bookmarks")) || [];
}

function saveBookmark(name, url) {
  const bookmarks = getBookmarks();
  bookmarks.push({ name, url });
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  displayBookmarks(false);
}

function showErrorWindow(...texts) {
  const filter = document.querySelector(".filter");
  const windowBox = document.querySelector(".window");
  const oldTexts = windowBox.querySelectorAll(".text");
  oldTexts.forEach((el) => el.remove());
  texts.forEach((text) => {
    const textContainer = document.createElement("div");
    textContainer.className = "text";
    const icon = document.createElement("i");
    icon.className = "fa-solid fa-circle-exclamation";
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    textContainer.appendChild(icon);
    textContainer.appendChild(paragraph);
    windowBox.appendChild(textContainer);
  });

  filter.style.display = "flex";
  windowBox.style.display = "flex";
  requestAnimationFrame(() => {
    filter.style.opacity = "1";
    windowBox.style.opacity = "1";
  });
}

function hideErrorWindow() {
  const filter = document.querySelector(".filter");
  const windowBox = document.querySelector(".window");
  filter.style.opacity = "0";
  windowBox.style.opacity = "0";
  setTimeout(() => {
    filter.style.display = "none";
    windowBox.style.display = "none";
  }, 400);
}
function checkRepeat(name) {
  const bookmarks = getBookmarks();
  const isRepeated = bookmarks.some((bookmark) => bookmark.name === name);
  return isRepeated;
}

function handleBookmark() {
  const nameValue = document.getElementById("name").value.trim();
  const linkValue = document.getElementById("link").value.trim();
  const errors = [];
  if (nameValue === "") {
    errors.push("Name cannot be empty.");
  }
  if (nameValue.length < 3) {
    errors.push("The name should be at least 3 letters.");
  }
  if (!isValidURL(linkValue)) {
    errors.push("Invalid URL. Make sure it starts with http or https.");
  }
  if (checkRepeat(nameValue)) {
    errors.push("Name exists. Choose another name.");
  }
  if (errors.length > 0) {
    showErrorWindow(...errors);
    return;
  }
  saveBookmark(nameValue, linkValue);
  document.getElementById("name").value = "";
  document.getElementById("link").value = "";
  formGroupLink.classList.remove("valid");
  formGroupName.classList.remove("valid")
}
linkInput.addEventListener("input", function () {
  if (liveValidate(this, "link")) {
    formGroupLink.classList.remove("invalid");
    formGroupLink.classList.add("valid");
  }
  else {
    formGroupLink.classList.remove("valid");
    formGroupLink.classList.add("invalid");
  }
});

nameInput.addEventListener("input", function () {
  if (liveValidate(this, "name")) {
    formGroupName.classList.remove("invalid");
    formGroupName.classList.add("valid");
  }
  else {
    formGroupName.classList.remove("valid");
    formGroupName.classList.add("invalid");
  }
});

function liveValidate(inputElement, type) {
  const value = inputElement.value.trim();

  let isValid = true;

  if (type === "name") {
    if (value === "") {
      isValid = false;
    }
    if (value.length > 0 && value.length < 3) {
      isValid = false;
    }
    if (value.length >= 3 && checkRepeat(value)) {
      isValid = false;
    }
  } else if (type === "link") {
    if (!isValidURL(value)) {
      isValid = false;
    }
  }
  return isValid;
}

function createBookmarkRow(bookmark, index, totalLength, isDeleted) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${index + 1}</td>
    <td>${bookmark.name}</td>
    <td>
      <a class="visit" href="${bookmark.url}" target="_blank">
        <span>Visit</span>
        <i class="fa-regular fa-eye"></i>
      </a>
    </td>
    <td>
      <a class="delete ${index}" href="#" onclick="delete_websites(this)">
        <span>Delete</span>
        <i class="fa-solid fa-minus"></i>
      </a>
    </td>
  `;
  if (!isDeleted && index === totalLength - 1) {
    row.style.opacity = "0";
    row.style.transition = "opacity 0.4s ease";
    setTimeout(() => {
      row.style.opacity = "1";
    }, 150);
  }
  return row;
}

function displayBookmarks(isDeleted = false) {
  const bookmarks = getBookmarks();
  const table = document.getElementById("bookmarkTable");
  const container = document.querySelector(".transition");
  const baseHeight = 1.5;
  const perItemHeight = 5.5;
  const newHeight = baseHeight + bookmarks.length * perItemHeight;
  container.style.transition = "height 0.3s ease";
  container.style.height = `${newHeight}rem`;
  table.innerHTML = `
    <tr>
      <td>Index</td>
      <td>Name</td>
      <td></td>
      <td></td>
    </tr>
  `;
  bookmarks.forEach((bookmark, index) => {
    const row = createBookmarkRow(bookmark, index, bookmarks.length, isDeleted);
    table.appendChild(row);
  });
}

function delete_websites(element) {
  const index = parseInt(element.classList[1]);
  const bookmarks = getBookmarks();
  bookmarks.splice(index, 1);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  displayBookmarks(true);
}

window.onload = () => displayBookmarks();
