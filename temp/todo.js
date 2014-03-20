/*
 * @author Shaumik "Dada" Daityari
 * @copyright December 2013
 */

/* Some info
Using newer versions of jQuery and jQuery UI in place of the links given in problem statement
All data is stored in local storage
User data is extracted from local storage and saved in variable todo.data
Otherwise, comments are provided at appropriate places
*/

var todo = todo || {},
    data = JSON.parse(localStorage.getItem("todoData"));

data = data || {};

(function(todo, data, $) {

    var defaults = {
            todoTask: "todo-task",
            todoHeader: "task-header",
            todoDate: "task-date",
            todoDescription: "task-description",
            taskId: "task-",
            formId: "todo-form",
            dataAttribute: "data",
            deleteDiv: "delete-div",
            deleteAll: ".delete-all"
        }, codes = {
            "1" : "#pending",
            "2" : "#inProgress"
        };

    todo.init = function (options) {

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "./data/stories.json",
            async: true,
            success: function(stories) {
                $.each(stories["items"], function (index, params) {
                    generateStories(params);
                });
            }
        });

        // Add Task
        var generateStories = function (params) {
            var parent = $(codes["1"]),
                wrapper;

            if (!parent) {
                return;
            }

            wrapper = $("<div />", {
                "class": defaults.todoTask,
                "id": defaults.taskId + params.id,
                "data": params.id
            }).appendTo(parent);

            $("<div />", {
                "class": defaults.todoHeader,
                "text": params.text
            }).appendTo(wrapper);

            $("<div />", {
                "class": "points",
                "text": params.size
            }).appendTo(wrapper);

            $("<div />", {
                "class": defaults.todoDescription,
                "text": params.description
            }).appendTo(wrapper);

            wrapper.draggable({
                revert: "invalid",
                containment: 'body',
                scroll: false,
                start: function () {
                    $("#" + defaults.deleteDiv).show();
                },
                stop: function () {
                    $("#" + defaults.deleteDiv).hide();
                }
            });

        };

        options = options || {};
        options = $.extend({}, defaults, options);

        $.each(codes, function (index, value) {
            $(value).droppable({
                over: function (event, ui) {
                    if ($(this).attr("id") == "pending") {
                        ui.draggable.removeClass('orange');
                        ui.draggable.addClass('green');
                    } else {
                        ui.draggable.removeClass('green');
                        ui.draggable.addClass('orange');
                    }
                },
                drop: function (event, ui) {
                    var element = ui.helper,
                        css_id = element.attr("id"),
                        id = css_id.replace(options.taskId, ""),
                        object = data[id];

                    // Removing old element
                    removeElement(object);

                    // Changing object code
                    object.code = index;

                    // Generating new element
                    generateStories(object);

                }
            });
        });

        //$.each(data, function (index, params) {
        //    generateElement(params);
        //});

        /*generateElement({
            id: "123",
            code: "1",
            title: "asd",
            date: "22/12/2013",
            description: "Blah Blah"
        });*/

        /*removeElement({
            id: "123",
            code: "1",
            title: "asd",
            date: "22/12/2013",
            description: "Blah Blah"
        });*/

        // Adding drop function to each category of task
        //$.each(codes, function (index, value) {
        //    $(value).droppable({
        //        over: function (event, ui) {
        //            if ($(this).attr("id") == "pending") {
        //                ui.draggable.removeClass('orange');
        //                ui.draggable.addClass('green');
        //            } else {
        //                ui.draggable.removeClass('green');
        //                ui.draggable.addClass('orange');
        //            }
        //        },
        //        drop: function (event, ui) {
        //                var element = ui.helper,
        //                    css_id = element.attr("id"),
        //                    id = css_id.replace(options.taskId, ""),
        //                    object = data[id];

        //                    // Removing old element
        //                    removeElement(object);

        //                    // Changing object code
        //                    object.code = index;

        //                    // Generating new element
        //                    generateElement(object);

        //                    // Updating Local Storage
        //                    data[id] = object;
        //                    localStorage.setItem("todoData", JSON.stringify(data));

        //                    // Hiding Delete Area
        //                    $("#" + defaults.deleteDiv).hide();
        //            }
        //    });
        //});

        // Adding drop function to delete div
        //$("#" + options.deleteDiv).droppable({
        //    drop: function(event, ui) {
        //        var element = ui.helper,
        //            css_id = element.attr("id"),
        //            id = css_id.replace(options.taskId, ""),
        //            object = data[id];

        //        // Removing old element
        //        removeElement(object);

        //        // Updating local storage
        //        delete data[id];
        //        localStorage.setItem("todoData", JSON.stringify(data));

        //        // Hiding Delete Area
        //        $("#" + defaults.deleteDiv).hide();
        //    }
        //});
    };

    // Add Task
    //var generateElement = function(params){
    //    var parent = $(codes[params.code]),
    //        wrapper;

    //    if (!parent) {
    //        return;
    //    }

    //    wrapper = $("<div />", {
    //        "class" : defaults.todoTask,
    //        "id" : defaults.taskId + params.id,
    //        "data" : params.id
    //    }).appendTo(parent);

    //    $("<div />", {
    //        "class" : defaults.todoHeader,
    //        "text": params.title
    //    }).appendTo(wrapper);

    //    //$("<div />", {
    //    //    "class" : defaults.todoDate,
    //    //    "text": params.date
    //    //}).appendTo(wrapper);

    //    $("<div />", {
    //        "class" : "points",
    //        "text": params.points
    //    }).appendTo(wrapper);

    //    $("<div />", {
    //        "class" : defaults.todoDescription,
    //        "text": params.description
    //    }).appendTo(wrapper);

    //    wrapper.draggable({
    //        revert: "invalid",
    //        containment: 'body',
    //        scroll: false,
    //        start: function() {
    //            $("#" + defaults.deleteDiv).show();
    //        },
    //        stop: function() {
    //            $("#" + defaults.deleteDiv).hide();
    //        }
    //    });

    //};

    // Remove task
    var removeElement = function (params) {
        $("#" + defaults.taskId + params.id).remove();
    };

    todo.add = function() {
        var inputs = $("#" + defaults.formId + " :input"),
            errorMessage = "Title can not be empty",
            id, title, description, date, points, tempData;

        if (inputs.length !== 5) {
            return;
        }

        title = inputs[0].value;
        description = inputs[1].value;
        date = inputs[2].value;
        points = inputs[3].value;

        if (!title) {
            generateDialog(errorMessage);
            return;
        }

        id = new Date().getTime();

        tempData = {
            id : id,
            code: "1",
            title: title,
            date: date,
            description: description,
            points: points
        }

        // Saving element in local storage
        data[id] = tempData;
        localStorage.setItem("todoData", JSON.stringify(data));

        // Generate Todo Element
        generateElement(tempData);

        // Reset Form
        inputs[0].value = "";
        inputs[1].value = "";
        inputs[2].value = "";
        inputs[3].value = "";
    };

    //var generateDialog = function (message) {
    //    var responseId = "response-dialog",
    //        title = "Messaage",
    //        responseDialog = $("#" + responseId),
    //        buttonOptions;

    //    if (!responseDialog.length) {
    //        responseDialog = $("<div />", {
    //                title: title,
    //                id: responseId
    //        }).appendTo($("body"));
    //    }

    //    responseDialog.html(message);

    //    buttonOptions = {
    //        "Ok" : function () {
    //            responseDialog.dialog("close");
    //        }
    //    };

    //    responseDialog.dialog({
    //        autoOpen: true,
    //        width: 400,
    //        modal: true,
    //        closeOnEscape: true,
    //        buttons: buttonOptions
    //    });
    //};

    //todo.clear = function () {
    //    data = {};
    //    localStorage.setItem("todoData", JSON.stringify(data));
    //    $("." + defaults.todoTask).remove();
    //};

})(todo, data, jQuery);