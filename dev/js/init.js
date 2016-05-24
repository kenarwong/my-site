$(document).ready(function(e){
    // Disable menu switch when clicking outside of menu
    $(document).on('click', function(event) {
        if (!$(event.target).closest('#nav-menu').length &&
            !($(event.target).is('#nav-menu')))
        {
            if ($('input#menu-switch').prop('checked')) {
                $('input#menu-switch').prop('checked',false);
            }
        }
    });

    // Make nav-placeholder the same height as the nav
    $('#nav-placeholder').css('height',$('nav').height());

    // updatePage fnc
    // takes href of link clicked
    // performs css transitions and re-mounts main-container
    var updatePage = function(href) {
        var totalDelay = 500; // total delay (ms) for page transition

        $('#main-container').css('height',$('#main-container').css('height')); // Retain height

        // fadeOut fnc for sections
        var fadeOut = function(element,preDelay,delayTime) {
            if(element) {
                setTimeout(function() {
                    $(element).addClass('fadeOut' + delayTime).delay(delayTime).addClass('fadedOut');
                }, preDelay);
            }
        };

        var header = $('#main-container h1.content-header');
        var sections = $('#main-container div.content-wrapper > div.content-section');

        // Fade out header with total delay
        fadeOut(header,0,totalDelay);

        // Mark section indices
        var sectionIndices = (function() {
            var arr = [];
            for (var i = 0; i < sections.length; i++) {
                arr.push(i);
            }
            return arr;
        })();

        // Shuffle section indices
        var sectionIndicesShuffled = [];
        while (sectionIndices.length > 0) {
            var j = Math.floor(Math.random() * sectionIndices.length);
            console.log(sectionIndices[j]);
            sectionIndicesShuffled.push(sectionIndices[j]);
            sectionIndices.splice(sectionIndices.indexOf(sectionIndices[j]),1);
            //console.log(sectionIndices);
            //console.log(sectionIndicesShuffled);
        }

        var delays;
        if (sections.length == 3) {
            delays = [400,300,200];
        } else if (sections.length == 2) {
            delays = [400,200];
        }
        else if (sections.length == 1) {
            delays = [300];
        } else {
            console.log("unrecognized section length of: " + sections.length);
        }
        for (var i = 0; i < sections.length; i++) {
            fadeOut(sections[sectionIndicesShuffled[i]],0,delays[i]); // Fade out sections with no preDelay
             // Reduce fade time
        }
        //fadeOut(sections[0],200,totalDelay - 200);
        //fadeOut(sections[1],300,totalDelay - 300);
        //fadeOut(sections[2],400,totalDelay - 400);

        // Delay re-mounting of main-container
        // Perform post-mount functions
        $('#main-container').delay(totalDelay).queue(function(next){
            // Post execution functions
            var postExec = function() {
                $('#main-container').css('height',''); // Remove height property
                $('#main-container .fadeOut').removeClass('fadeOut'); // Remove fadeOut class
                $('#main-container .fadedOut').removeClass('fadedOut'); // Remove fadedOut class
            }

            // Unmount old component, render new component
            React.unmountComponentAtNode(document.getElementById('main-container')); // React unmount fnc
            var reactElement = React.createElement(ContentBox, {url: "api/content/" + href, data:[], postExec:postExec});
            React.render(
                reactElement,
                document.getElementById('main-container')
                ); // Mount new content from api
            next();
        });

        // Handle css
        var selected = $('li.content-link.selected');
        selected.removeClass('selected');
        selected[0].offsetWidth = selected[0].offsetWidth; // trigger reflow
        $('li.content-link > a[href="' + href + '"]').parent().addClass('selected');
    };

    $(document).on('click','.content-link > a', function(e) {
        $('input#menu-switch').prop('checked',false); // Close menu if open

        // Prevent link click
        // TODO: fallback if libs fail
        e.preventDefault();

        // Change content
        updatePage($(this).attr('href'));

        // Handle history
        window.history.pushState({href:$(this).attr('href')},$(this).attr('href'),$(this).attr('href'))
    });

    window.onpopstate = function(event) {
        //console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
        updatePage(event.state ? event.state.href : "home"); // default home if no state data
    };
});

(function() {
})();
