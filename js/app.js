/**
 * Created by Pallavi on 03/06/17.
 */

// Plugin definition.
$.fn.todo = function( options ) {
    // Extend our default options with those provided.
    // Note that the first argument to extend is an empty
    // object – this is to keep from overriding our "defaults" object.
    var opts = $.extend({}, $.fn.todo.defaults, options );
    if(Array.isArray && !Array.isArray(opts.boards)){
        opts.boards = [];
    }

    return this.each(function() {
        let $el = $(this).addClass("board-container");

        //Local copy of boards data for each element;
        //let $boards = $.extend({},opts.boards);
        let allBoards = []; // Keep references to all boards in this instance.
        let resetCounts = function(){
            let totalCount = 0;
            for(let board of allBoards){
                totalCount += board.resetCount();
            }
            $el.attr("data-count","Total: "+totalCount);
        }
        //$el.data("boards",$boards);
        let $inputDOM = $('<div class="form-group"><label class="pull-left control-label">Add Task:<label></div>');
        let $input = $('<input type="text" class="form-control" placeholder="Type a task and press enter to add task.">');
        $input.on('keyup', function (e) {
            if (e.keyCode == 13) {
                let task = $(this).val();
                let $boardDOM = $("div#"+opts.initialBoard);
                $boardDOM.append($("<div>",{class:"list-group-item",text:task}));
                resetCounts();
                $(this).val("");
            }
        });
        $inputDOM.append($input);
        $el.append($inputDOM);
        for(let board of opts.boards){
            let $boardDOM = $("<div>",{class: "list-group col-sm-3 module-color-blue", id:board.id, title:board.name});
            allBoards.push($boardDOM);
            for (let item of board.contents){
                $boardDOM.append($("<div>",{class:"list-group-item",text:item}));
            }
            $boardDOM.resetCount = function(){
                let count = $boardDOM.children(':visible').length;
                $boardDOM.attr("data-count",count);
                return count;
            }
            $el.append($boardDOM);
            //Sortable plugin used for dragging and dropping the items.
            Sortable.create($boardDOM[0], {
                group: "itemcontainer",
                sort: true,
                ghostClass: 'sortable-ghost',
                store: {
                    get: function(sortable){
                        resetCounts();
                        return [];
                    },
                    set: function(sortable){
                        resetCounts();
                    }
                }
            });
        }
    });
};

// Plugin defaults – added as a property on our plugin function.
$.fn.todo.defaults = {
    initialBoard: "todo",
    boards: [{
        name: "To Do",
        id: "todo",
        contents: ["Task 1", "Task 2", "Task 3", "Task 4"]
    },{
        name: "In Progress",
        id: "inprogress",
        contents: ["Task 5", "Task 6", "Task 7"]
    },{
        name: "Done",
        id: "done",
        contents: ["Task 8", "Task 9", "Task 10", "Task 11", "Task 12"]
    }]
};


//If the above was a plugin file, we would initiate the plugin as follows.
$("#boards-container").todo();

//Changing Theme feature.
$('.nav-icon').on('click',function() {
    $('.navbar,.footer,.list-group').toggleClass('module-color-orange module-color-blue ');
});

//Delete Board item feature.
$('.trash').on('dragover', function() {
    $('.sortable-ghost', $('.list-group')).remove();
    $(".trash i").css({
        "background": "red"
    });
});
$('.trash').on('dragleave', function() {
    $(".trash i").css({
        "background": "#708090"
    });
});