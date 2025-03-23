
var elms = document.getElementsByClassName( 'ltr' );

    for ( var i = 0; i < elms.length; i++ ) {
        new Splide( elms[ i ] , {
            type: "loop",
            drag: "free",
            arrows: false,
            pagination: false,
            perPage: 5,

        autoScroll: {
            speed: 1, 
            pauseOnHover: false,
          },
          }).mount(window.splide.Extensions);
    }
 


var elm = document.getElementsByClassName( 'rtl' );

    for ( var i = 0; i < elm.length; i++ ) {
        new Splide( elm[ i ] , {
            direction: "rtl",
            type: "loop",
            drag: "free",
            arrows: false,
            pagination: false,
            perPage: 5,

        autoScroll: {
            speed: 1, 
            pauseOnHover: false,
        },
        }).mount(window.splide.Extensions);
    }