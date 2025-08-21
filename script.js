let inputField = document.querySelector("#inputField");
let addTaskBtn = document.querySelector(".addTaskBtn");
let todoContainer = document.querySelector(".todoContainer");

let API = "https://68a2e756c5a31eb7bb1e3933.mockapi.io/api/v1/todos";

addTaskBtn.addEventListener("click", postData);

async function fetchData() {
  let response = await fetch(API);
  let data = await response.json();

  if (data) {
    todoContainer.innerHTML = "";

    data.forEach((obj) => {
      let div = document.createElement("div");
      div.className = "todo";
      div.innerHTML = `
          <p class = "paraText">${obj.text}</p>
          <input
            type="text"
            id="editInput"
            placeholder="edit your task here....."
            value = "${obj.text}"
          />
          <div>
            <button  class = "editBtn">Edit</button>
            <button class = "saveBtn">Save</button>
            <button class = "deleteBtn">Delete</button>
          </div>`;

      let editBtn = div.querySelector(".editBtn");
      let saveBtn = div.querySelector(".saveBtn");
      let deleteBtn = div.querySelector(".deleteBtn");
      let editInput = div.querySelector("#editInput");
      let paraText = div.querySelector(".paraText");

      deleteBtn.addEventListener("click", function () {
        deleteData(obj.id);
      });

      editBtn.addEventListener("click", function () {
        editBtn.style.display = "none";
        saveBtn.style.display = "inline";
        editInput.style.display = "inline";
        paraText.style.display = "none";
      });

      saveBtn.addEventListener("click", async function () {
        let editValue = editInput.value;
        let response = await updateData(obj.id, editValue);
        if (response.status === 200) {
          editBtn.style.display = "inline";
          saveBtn.style.display = "none";
          editInput.style.display = "none";
          paraText.style.display = "inline";
        }
      });

      todoContainer.append(div);
    });
  }
}

async function postData() {
  let value = inputField.value.trim();

  if (!value) {
    alert("Enter some task here...");
    return;
  }
  let objData = {
    text: value,
  };

  let response = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objData),
  });
  if (response.status === 201) {
    fetchData();
    inputField.value = "";
  }
}
async function updateData(id, value) {
  let objData = {
    text: value.trim(),
  };

  let response = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objData),
  });
  fetchData();
  return response;
}

async function deleteData(id) {
  let response = await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  if (response.status === 200) {
    fetchData();
  }
}
fetchData();
