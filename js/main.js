(function ($, MyTool, undefined) {

    var DATA_URL = 'data/tool.json';
        template = new Plates.Map(), //initialize the Plates template
        $errorContainer = $('.js-logs'),
        $contentHolder = $('.content');

    /**
    * Initialize the tool
    * @method init
    * @for MyTool
    */
    MyTool.init = function(){
        logProcess('initialize tool, waiting for click on button...');
        MyTool.bindEvents();
    };

    /**
    * Bind events
    * @method bindEvents
    * @for MyTool
    */
    MyTool.bindEvents = function(){
        $('.js-btn-load').on('click', MyTool.loadData);
    };

    /**
    * Display messages in the app (private method)
    * @method logProcess
    * @for MyTool
    * @param message (String) message to display
    */
    var logProcess = function(message){
        $errorContainer.append('<li>' + message + '</li>');
    };

    /**
    * Load data from json file
    * @method loadData
    * @for MyTool
    * @param e (Event) click event
    */
    MyTool.loadData = function(e){

        if($contentHolder.data('loaded') === 'true'){
            return;
        }

        var $loadBtn = $(e.currentTarget);
        $loadBtn.addClass('disabled');

        if (typeof window.runtime !== 'undefined'){ //if inside Air environment
            logProcess('load data from json file...');
            var request = new air.URLRequest(DATA_URL),
                loader = new air.URLLoader();

            loader.load(request);
            //air.Introspector.Console.log(loader);
            loader.addEventListener("complete", function(e){
                var rawJson = JSON.parse(e.currentTarget.data);
                logProcess('data loaded.');
                MyTool.processData(rawJson);
            });

        }else{ //in browser
            logProcess('load data from json file...');
            $.ajax({
                url:DATA_URL,
                success: function(data){
                    logProcess('data loaded.');
                    MyTool.processData(data);
                },
                error: function(){
                    console.log("error");
                }
            });
        }
    };

    /**
    * Render the data using Plates rendering engine
    * @method processData
    * @for MyTool
    * @param data (JSON object) data object to render
    */
    MyTool.processData = function(data){
        logProcess('render the data...');
        $contentHolder.data('loaded', 'true');
        if(data !== ''){
            //air.Introspector.Console.log(data);
            $contentHolder.append(Plates.bind($("#tool-template").html(), data, template));
        }
    };

}(jQuery, window.MyTool = window.MyTool || {}));

MyTool.init();