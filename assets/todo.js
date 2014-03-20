
var todo = todo || {},
    budget = 74,
    points = 0,
    data; //= JSON.parse(localStorage.getItem("todoData"));

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

        todo.add();

        //if ($.isEmptyObject(data)) {
        //    todo.add();
        //} else {
        //    $.each(data, function (index, params) {
        //        generateStories(params);
        //    });
        //}
 
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

            var placeholder, runOnce = false, currentArea, taskItems, taskPoints = 0, allTaskPoints = 0, notBudgetTaskPoints = 0;;
            var sortIndex;
            var secondSortIndex;
            var position = 0;
            var positionTwo;

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
                        
                        //placeholder = $();
                        //currentArea = $();
                        //taskItems = $();
                        //taskPoints = 0;

                        //currentArea = ui.item.parent().attr('id');
                        placeholder = $(".ui-sortable-placeholder");
                        taskItems = placeholder.prev(".todo-task");

                        //sortIndex = ui.placeholder.index() + 1;
                        //if (!secondSortIndex) {
                        //    secondSortIndex = ui.placeholder.index() + 1;
                        //}
                        //positionTwo = position;
                        //position = secondSortIndex - sortIndex;

                        //console.log(position);

                        //if (placeholder.parent().attr('id') == "pending") {
                        //    ui.item.addClass("green");
                        //} else {
                        //    ui.item.removeClass("green");
                        //}


                        //if (ui.item.parent().attr('id') == "pending") {

                        //    taskItems = placeholder.nextAll(".todo-task");

                        //    $.each(taskItems, function(index, value) {

                        //        taskPoints += $(value).data("points");

                        //    });

                        //    allTaskPoints = allTaskPoints - taskPoints;

                        //    placeholder.hide();
                        //    $(".change-position").show();

                        //    //placeholder.show();
                        //    //$(".change-position").hide();

                        //    taskItems.addClass("remove");

                        //}

                        if (placeholder.parent().attr('id') == "pending" && taskItems.hasClass("remove")) {


                            placeholder.hide();
                            $(".change-position").show();
                            ui.item.removeClass("green");

                        } else if (placeholder.parent().attr('id') == "inProgress") {

                            ui.item.removeClass("green");
                            
                        } else {

                            ui.item.addClass("green");
                            placeholder.show();
                            $(".change-position").hide();

                        }


                    }
                },
                start: function (event, ui) {

                    if (ui.item.parent().attr('id') == "inProgress") {
                        allTaskPoints = 0;

                        ui.item.addClass("active");

                        $.each($("#pending").find(".todo-task"), function (index, value) {

                            allTaskPoints += $(value).data("points");
                        
                            if ((allTaskPoints + ui.item.data("points")) > budget) {

                                $(value).addClass("remove");
                            
                            }


                        });

                        allTaskPoints += ui.item.data("points");


                        $("#pending").find("h3").text("Inom budget " + budget + " " + allTaskPoints);

                    }
                   
                },
                stop: function (event, ui) {

                    $(ui.item).removeClass("active");

                    if ($(".remove") && ui.item.parent().attr('id') == "pending" && $(".change-position").css('display') == 'none') {
                        $(".remove").insertAfter("#inProgress h3");
                        ui.item.removeClass("green");
                    }
                    if (ui.item.parent().attr('id') == "inProgress") {
                        $(".remove").removeClass("remove");
                        ui.item.removeClass("green");
                    }
                    if ($(".change-position").css('display') == 'block') {
                        $(ui.item).insertAfter(".change-position");
                        $(".change-position").insertAfter("#inProgress h3");
                        $(".change-position").hide();
                        ui.item.removeClass("green");
                        $("#pending .todo-task").removeClass("remove");
                        updateStories(ui);
                    }

                    allTaskPoints = 0;
                    
                    

                    $.each($("#pending").find(".todo-task"), function (index, value) {

                        allTaskPoints += $(value).data("points");
                        

                    });

                    if (allTaskPoints < budget) {

                        $.each($("#inProgress").find(".todo-task:not(.change-position)"), function (index, value) {
                            
                            notBudgetTaskPoints += $(value).data("points");
                            
                            if (budget >= (notBudgetTaskPoints + allTaskPoints)) {
                                
                                $("#pending").append($(value));

                            }

                        });

                    }

                    allTaskPoints = 0;
                    notBudgetTaskPoints = 0;

                },
                receive: function (event, ui) {

                    updateStories(ui);

                }
            });


            var updateStories = function (ui) {
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
                //localStorage.setItem("todoData", JSON.stringify(data));
            };


        });

    };



    // Add Task
    var generateStories = function (params) {
        var parent = $(codes[params.code]),
            wrapper;

        if (!parent) {
            return;
        }

        points += parseInt(params.points);

        if (points > budget) {
            parent = $("#inProgress");
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
                    //localStorage.setItem("todoData", JSON.stringify(data));

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