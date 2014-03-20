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

        options = options || {};
        options = $.extend({}, defaults, options);

        if ($.isEmptyObject(data)) {
            todo.add();
        } else {
            $.each(data, function (index, params) {
                generateStories(params);
            });
        }
 
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
        //                    generateStories(object);

        //                    // Updating Local Storage
        //                    data[id] = object;
        //                    localStorage.setItem("todoData", JSON.stringify(data));

        //                    // Hiding Delete Area
        //                    $("#" + defaults.deleteDiv).hide();
        //            }
        //    });
        //});


        $.each(codes, function (index, value) {

            var placeholder, runOnce = false, itemsAbove, currentArea, taskItems, taskItemsAbove, taskPoints = 0, budget = 74, allTaskPoints = 0;
            var sortIndex;
            var secondSortIndex;
            var position = 0;
            var positionTwo = 0;

            $("#pending").find("h3").text("Inom budget " + budget);

            $(value).sortable({
                items: '> .todo-task',
                opacity: 0.5,
                cursor: "pointer",
                connectWith: ".task-list",
                containment: "#task-lists",
                scroll: true,
                scrollSensitivity: 280,
                scrollSpeed: 2,
                change: function(event, ui) {
                    if (ui.sender == null) {
                        
                        placeholder = $();
                        currentArea = $();

                        taskItemsAbove = 0;

                        currentArea = ui.item.parent().attr('id');
                        placeholder = $(".ui-sortable-placeholder");

                        sortIndex = ui.placeholder.index() + 1;
                        if (!secondSortIndex) {
                            secondSortIndex = ui.placeholder.index() + 1;
                        }
                        positionTwo = position;
                        position = secondSortIndex - sortIndex;


                        if (placeholder.parent().attr('id') == "pending" && currentArea == "inProgress" && position >= positionTwo) {

                            itemsAbove = $("#pending").find($("#pending > div").get(sortIndex - 3)).data("points");

                            //console.log(allTaskPoints + "-" + taskPoints + "+" + itemsAbove);

                            itemsAbove = (allTaskPoints - taskPoints) + itemsAbove;

                        }
                        
                        
                        if (placeholder.parent().attr('id') == "pending") {
                            ui.item.addClass("green");
                        } else {
                            ui.item.removeClass("green");
                        }

                        //console.log("change");

                        //console.log(position + " >= " + positionTwo);

                        
                        console.log(allTaskPoints + " > " + budget);

                        console.log(ui.item.data("points") + " större än " + taskPoints);

                        if (ui.item.data("points") > taskPoints) {
                            
                        

                        if (placeholder.parent().attr('id') == "pending" && currentArea == "inProgress" && allTaskPoints > budget && position >= positionTwo) {

                            taskItems = $();
                            taskPoints = 0;
                            taskItems = placeholder.nextAll(".todo-task");
                            taskItemsAbove = placeholder.prevAll(".todo-task");
                            var taskItemsAbovePoints = 0;

                            $.each(taskItems, function(index, value) {

                                taskPoints += $(value).data("points");

                            });

                            $.each(taskItemsAbove, function (index, value) {

                                taskItemsAbovePoints += $(value).data("points");

                            });

                            
                            

                            allTaskPoints = allTaskPoints - taskPoints;

                                

                                placeholder.hide();
                                $(".change-position").show();

                                //if (!$("#inProgress > div:first").attr("class") == "todo-task ui-sortable-placeholder") {

                                //} else {

                                //}

                                taskItems.addClass("remove");


                             //else if (ui.item.data("points") <= taskPoints && runOnce == false) {

                            //    //console.log(ui.item.data("points") + " mindre eller lika med " + taskPoints);
                            //    placeholder.hide();
                            //    $(".change-position").show();
                            //    runOnce = true;
                            //    taskItems.addClass("remove");
                            //}
                        } else if (position <= positionTwo) {

                            placeholder.hide();
                            $(".change-position").show();

                            //console.log(allTaskPoints + "neråt större än budget " + budget);

                        } 
                        else {

                            placeholder.show();
                            $(".change-position").hide();
                        }
                        }
                    }
                },
                start: function(event, ui) {
                    $(ui.item).addClass("active");

                    $.each($("#pending").find(".todo-task"), function (index, value) {
                        allTaskPoints += $(value).data("points");
                    });
                    allTaskPoints += ui.item.data("points");
                    console.log(allTaskPoints);
                    $("#pending").find("h3").text("Inom budget " + budget + " " + allTaskPoints);
                },
                stop: function (event, ui) {

                    $(ui.item).removeClass("active");
                    

                    if ($(".remove") && ui.item.parent().attr('id') == "pending" && $(".change-position").css('display') == 'none') {
                        $(".remove").insertAfter("#inProgress h3");
                        ui.item.removeClass("green");
                    }
                    if (ui.item.parent().attr('id') == "inProgress") {
                        $(".remove").removeClass("remove");
                    }
                    if ($(".change-position").css('display') == 'block') {
                        $(ui.item).insertAfter(".change-position");
                        $(".change-position").insertAfter("#inProgress h3");
                        $(".change-position").hide();
                        ui.item.removeClass("green");
                    }

                    allTaskPoints = 0;
                    runOnce = false;
                },
                receive: function (event, ui) {
                    var element = ui.item,
                        css_id = element.attr("id"),
                        id = css_id.replace(options.taskId, ""),
                        object = data[id];

                    // Removing old element
                    //removeElement(object);

                    // Changing object code
                    object.code = index;

                    // Generating new element
                    //generateStories(object);

                    // Updating Local Storage
                    data[id] = object;
                    localStorage.setItem("todoData", JSON.stringify(data));

                }
            });
        });

    };

    // Add Task
    var generateStories = function (params) {
        var parent = $(codes[params.code]),
            wrapper;

        if (!parent) {
            return;
        }

        wrapper = $("<div />", {
            "class": defaults.todoTask,
            "id": defaults.taskId + params.id,
            "data": params.id,
            "data-points": params.points
        }).appendTo(parent);

        $("<div />", {
            "class": "points",
            "text": params.points
        }).appendTo(wrapper);

        $("<div />", {
            "class": defaults.todoHeader,
            "text": params.title
        }).appendTo(wrapper);

        $("<div />", {
            "class": "tags",
            "text": params.tag
        }).appendTo(wrapper);

    };

    // Remove task
    //var removeElement = function (params) {
    //    $("#" + defaults.taskId + params.id).remove();
    //};

    todo.add = function() {
        var id, title, points, tag, tempData;

        $.ajax({
            type: "GET",
            dataType: "json",
            url: "./data/stories.json",
            async: true,
            success: function (stories) {
                $.each(stories["items"], function (index, params) {
                    
                    title = params.text;
                    points = params.size;
                    tag = params.project.name;

                    id = new Date().getTime();
                    tempData = {
                        id: id,
                        code: "1",
                        title: title,
                        points: points,
                        tag: tag
                    };

                    // Saving element in local storage
                    data[id] = tempData;
                    localStorage.setItem("todoData", JSON.stringify(data));

                    // Generate Todo Element
                    generateStories(tempData);
                });
            }
        });

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