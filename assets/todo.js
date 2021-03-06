﻿
var todo = todo || {},
    budget = 40,
    points = 0,
    allPoints = 0,
    maxPoints = 0,
    data;

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
            "1": "#over-budget",
            "2": "#below-budget",
            "3": "#planned",
            "4": "#ongoing",
            "5": "#ended"
        },
        dragContainer = {
            "1": "#over-budget",
            "2": "#below-budget",
        };

    todo.init = function (options) {

        options = options || {};
        options = $.extend({}, defaults, options);

        todo.add();

        $("#over-budget").find("h3").text("Inom resterande budget " + " på " + budget + "p");

        $("#subnav li a").on("click", function (e) {
            e.preventDefault();
            var navSate = $(this).attr("class");
            $("#" + navSate).prevAll(".task-list").hide();
            $("#" + navSate).nextAll(".task-list").hide();
            $("#" + navSate).show();
            $(this).parent().addClass("active");
            $(this).parent().prevAll("li").removeClass("active");
            $(this).parent().nextAll("li").removeClass("active");

            if (navSate == "backlog") {
                $("#over-budget").show();
                $("#below-budget").show();
                $("#below-budget").nextAll(".task-list").hide();
            }

        });

        $.each(dragContainer, function (index, value) {

            var placeholder, taskItems, allTaskPoints = 0, notBudgetTaskPoints = 0;

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

                        placeholder = $(".ui-sortable-placeholder");
                        taskItems = placeholder.prev(".todo-task");


                        if (placeholder.parent().attr('id') == "over-budget" && taskItems.hasClass("remove")) {


                            placeholder.hide();
                            $(".change-position").show();
                            ui.item.removeClass("green");

                        } else if (placeholder.parent().attr('id') == "below-budget") {

                            ui.item.removeClass("green");
                            
                        } else {

                            ui.item.addClass("green");
                            placeholder.show();
                            $(".change-position").hide();

                        }


                    }
                },
                start: function (event, ui) {

                    if (ui.item.parent().attr('id') == "below-budget") {
                        allTaskPoints = 0;

                        ui.item.addClass("active");

                        $.each($("#over-budget").find(".todo-task"), function (index, value) {

                            allTaskPoints += $(value).data("points");
                        
                            if ((allTaskPoints + ui.item.data("points")) > budget) {

                                $(value).addClass("remove");
                            
                            }

                        });

                        allTaskPoints += ui.item.data("points");

                    }
                   
                },
                stop: function (event, ui) {

                    $(ui.item).removeClass("active");

                    if ($(".remove") && ui.item.parent().attr('id') == "over-budget" && $(".change-position").css('display') == 'none') {
                        $(".remove").insertAfter("#below-budget h3");
                        ui.item.removeClass("green");
                    }
                    if (ui.item.parent().attr('id') == "below-budget") {
                        $(".remove").removeClass("remove");
                        ui.item.removeClass("green");
                    }
                    if ($(".change-position").css('display') == 'block') {
                        $(ui.item).insertAfter(".change-position");
                        $(".change-position").insertAfter("#below-budget h3");
                        $(".change-position").hide();
                        ui.item.removeClass("green");
                        $("#over-budget .todo-task").removeClass("remove");
                        updateStories(ui);
                    }

                    allTaskPoints = 0;
                    
                    

                    $.each($("#over-budget").find(".todo-task"), function (index, value) {

                        allTaskPoints += $(value).data("points");
                        

                    });

                    if (allTaskPoints < budget) {

                        $.each($("#below-budget").find(".todo-task:not(.change-position)"), function (index, value) {
                            
                            notBudgetTaskPoints += $(value).data("points");
                            
                            if (budget >= (notBudgetTaskPoints + allTaskPoints)) {
                                
                                $("#over-budget").append($(value));

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
            parent = $("#below-budget");
        } else if (points <= budget) {
            
        }

        if (params.code != "1" && params.code != "2") {

            parent = $(codes[params.code]);

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

        //$.each($("#subnav li a:not(.backlog)"), function (index, states) {

            
        //    maxPoints = $(this).data("points");

        //    if (index == 0) {
        //        allPoints += parseInt(params.points);
        //    }

        //    if (allPoints > maxPoints) {
        //        return;
        //    }

        //    parent = "#" + $(this).attr("class");

        //    wrapper = $("<div />", {
        //        "class": defaults.todoTask,
        //        "id": defaults.taskId + params.id,
        //        "data": params.id,
        //        "data-points": params.points
        //    }).appendTo(parent);

        //    $("<div />", {
        //        "class": "points",
        //        "text": params.points
        //    }).appendTo(wrapper);

        //    $("<div />", {
        //        "class": defaults.todoHeader,
        //        "text": params.title
        //    }).appendTo(wrapper);

        //    $("<div />", {
        //        "class": "tags",
        //        "text": params.tag
        //    }).appendTo(wrapper);

        //});

    };

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

                    // Generate Todo Element
                    generateStories(tempData);
                });
                $.each(stories["planned"], function (index, params) {

                    title = params.text;
                    points = params.size;
                    tag = params.project.name;

                    id = new Date().getTime();
                    tempData = {
                        id: id,
                        code: "3",
                        title: title,
                        points: points,
                        tag: tag
                    };

                    // Saving element in local storage
                    data[id] = tempData;

                    // Generate Todo Element
                    generateStories(tempData);
                });
                $.each(stories["ongoing"], function (index, params) {

                    title = params.text;
                    points = params.size;
                    tag = params.project.name;

                    id = new Date().getTime();
                    tempData = {
                        id: id,
                        code: "4",
                        title: title,
                        points: points,
                        tag: tag
                    };

                    // Saving element in local storage
                    data[id] = tempData;

                    // Generate Todo Element
                    generateStories(tempData);
                });
                $.each(stories["ended"], function (index, params) {

                    title = params.text;
                    points = params.size;
                    tag = params.project.name;

                    id = new Date().getTime();
                    tempData = {
                        id: id,
                        code: "5",
                        title: title,
                        points: points,
                        tag: tag
                    };

                    // Saving element in local storage
                    data[id] = tempData;

                    // Generate Todo Element
                    generateStories(tempData);
                });
            }
        });

    };

})(todo, data, jQuery);