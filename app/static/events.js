$(document).ready(function(){

    console.log("Hello World");

    const originalHeight = 200;


    const expanded_width_matrix = {
        576: "1750px",
        768: "1750px",
        992: "735px",
        1070: "705px",
        1200: "665px",
    }

    const collapsed_width_matrix = {
        576: "525px",
        768: "525px",
        992: "215px",
        1200: "215px",
    }

    function get_card_expanded_height() {
        var pageWidth = $(document).width();
        console.log("Page Width: " + pageWidth);
        if (pageWidth > 1200) { return expanded_width_matrix[1200]; }
        
        const matchingKey = Object.keys(expanded_width_matrix)
            .map(Number)
            .filter(key => pageWidth < key)
            .sort((a, b) => a - b)[0];
        let matchingWidth =  expanded_width_matrix[matchingKey]
        console.log("Page Width: " + pageWidth + " Expanded Height: " + matchingWidth);
        return matchingWidth

    }

    function get_card_collapsed_height() {
        var pageWidth = $(document).width();
        console.log("Page Width: " + pageWidth);
        if (pageWidth > 1200) { return collapsed_width_matrix[1200]; }
        
        const matchingKey = Object.keys(collapsed_width_matrix)
            .map(Number)
            .filter(key => pageWidth < key)
            .sort((a, b) => a - b)[0];
        
        let matchingWidth =  collapsed_width_matrix[matchingKey]
        console.log("Page Width: " + pageWidth + " Expanded Height: " + matchingWidth);
        return matchingWidth

    }



    $(".btnShowMore").click(function () {
        var eventCard = $(this).closest('.event-card');
        var eventExpanded = eventCard.find('#rally-desc-cont-expanded')
        var eventSummary = eventCard.find('#rally-desc-cont')

        eventSummary.fadeOut(275, () => {
            eventExpanded.fadeIn(275);
        })
    
        let expanded_height = get_card_expanded_height();
        eventCard.animate({ height: expanded_height }, 550, function () { // Set to expanded height
            
        });
    })

    $(".btnShowLess").click(function () {
        var eventCard = $(this).closest('.event-card');
        var eventExpanded = eventCard.find('#rally-desc-cont-expanded')
        var eventSummary = eventCard.find('#rally-desc-cont')
        
        eventExpanded.fadeOut(275, () => {
            eventSummary.fadeIn(275);
        })

        var viewportWidth = $("body").innerWidth();
        let collapsedheight = get_card_collapsed_height();

        eventCard.animate({ height: collapsedheight}, 550, function () { // Set to expanded height
        });
    })

  });
