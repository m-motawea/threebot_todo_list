function openForm() {
  document.getElementById("newTaskPopup").style.display = "block";
}

function closeForm() {
  document.getElementById("newTaskPopup").style.display = "none";
}

function getItem(id) {
    $.ajax({
        url: "actors/todo_list/get_item",
        type: "GET",
        data: {"item_id": id},
        async: false,
        success: function(data) {
            var itemIdInput = document.getElementById("editItemId");
            itemIdInput.value = id
            var titleInput = document.getElementById("editTitle");
            titleInput.value = data.title
            var descriptionInput = document.getElementById("editDescription");
            descriptionInput.value = data.description
            var deadlineInput = document.getElementById("editDeadline");
            deadlineInput.value = data.deadline
            var doneInput = document.getElementById("editDone");
            if (data.done) {
                doneInput.checked = true
            } else {
                doneInput.checked = false
            };
            var timeCreatedLabel = document.getElementById("itemTimeCreated")
            timeCreatedLabel.innerHTML = data.time_created
            var lastUpdatedLabel = document.getElementById("itemLastUpdated")
            lastUpdatedLabel.innerHTML = data.last_updated
        }
    })
    var modal = document.getElementById("itemModal");
    var btnClose = document.getElementById("closeItem");

    btnClose.onclick = function() {
        var titleInput = document.getElementById("editTitle");
        titleInput.disabled = true
        var descriptionInput = document.getElementById("editDescription");
        descriptionInput.disabled = true
        var deadlineInput = document.getElementById("editDeadline");
        deadlineInput.disabled = true
        var doneInput = document.getElementById("editDone");
        doneInput.disabled = true
        var btnUpdate = document.getElementById("itemUpdate");
        btnUpdate.style.display = "none";
        modal.style.display = "none";
    }

    var btnEdit = document.getElementById("editItem");
    btnEdit.onclick = function() {
        var titleInput = document.getElementById("editTitle");
        titleInput.disabled = false
        var descriptionInput = document.getElementById("editDescription");
        descriptionInput.disabled = false
        var deadlineInput = document.getElementById("editDeadline");
        deadlineInput.disabled = false
        var doneInput = document.getElementById("editDone");
        doneInput.disabled = false
        var btnUpdate = document.getElementById("itemUpdate");
        btnUpdate.style.display = "block";
    }
    modal.style.display = "block";
}

function deleteItem(id, btn) {
    $.ajax({
        url: "actors/todo_list/delete_item",
        type: "GET",
        data: {"item_id": id},
        async: false,
        complete: function(XMLHttpRequest, status) {
            window.location.reload();
        }
    })
}

function createTask() {
    $.ajax({
        url: "actors/todo_list/add_item",
        type: "GET",
        async: false,
        data: {
            "title": $('#newTitle').val(),
            "description": $('#newDescription').val(),
            "deadline": $('#newDeadline').val()
        },
        complete: function(XMLHttpRequest, status) {
            window.location.reload();
        }
    })
}

function updateTask() {
    $.ajax({
        url: "actors/todo_list/edit_item",
        type: "GET",
        async: false,
        data: {
            "item_id": $('#editItemId').val(),
            "title": $('#editTitle').val(),
            "description": $('#editDescription').val(),
            "deadline": $('#editDeadline').val(),
            "done": document.getElementById("editDone").checked
        },
        complete: function(XMLHttpRequest, status) {
            window.location.reload();
        }
    })
}

$(document).ready(function(){
    $('#newTaskForm').ajaxForm(createTask)
    $('#editTaskForm').ajaxForm(updateTask)
    $.ajax({
        url: "actors/todo_list/list_items",
        type: "GET",
        async: false,
        success: function(data) {
            for (item of data) {
                var html = `
                <tr id="item:${item.id}">
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${item.deadline}</td>
                <td>${item.done}</td>
                <td><button onclick="getItem(${item.id});">view</button></td>
                <td><button type="button" onclick="deleteItem(${item.id}, this)">delete</button></td>
                </tr>
                `
                $("#itemsTable tbody").append(html);
            }
        }
    })
});

