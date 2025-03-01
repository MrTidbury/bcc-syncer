$(document).ready(function(){
    console.log("Hello World loading js");

    $.get("/xhr/load_events", function(response) {

        $(".loading-container").fadeOut(700, () => {
            window.location.href = "/rallylist";
        });
    });

  });
