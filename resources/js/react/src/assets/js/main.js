(function ($) {
    'use strict';
    /*----------------------------------------*/
    /* Hiraola's Newsletter Popup
/*----------------------------------------*/
    setTimeout(function () {
        $('.popup_wrapper').css({
            opacity: '1',
            visibility: 'visible',
        });
        $('.popup_off').on('click', function () {
            $('.popup_wrapper').fadeOut(500);
        });
    }, 5000);
    /*----------------------------------------*/
    /*  Hiraola's Sticky Menu Activation
/*----------------------------------------*/
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $('.header-sticky').addClass('sticky');
        } else {
            $('.header-sticky').removeClass('sticky');
        }
    });
    /*----------------------------------------*/

    /*  Toolbar Button
/*----------------------------------------*/
    $('.toolbar-btn').on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        var target = $this.attr('href');
        var prevTarget = $this
            .parent()
            .siblings()
            .children('.toolbar-btn')
            .attr('href');
        $(target).toggleClass('open');
        $(prevTarget).removeClass('open');
    });

    /**********************
     *Close Button Actions
     ***********************/

    $('.btn-close').on('click', function (e) {
        e.preventDefault();
        var $this = $(this);
        $this.parents('.open').removeClass('open');
    });
    /*----------------------------------------*/


    /*  Hiraola's Offcanvas
/*----------------------------------------*/
    /*Variables*/
    var $offcanvasNav = $(
            '.offcanvas-menu, .offcanvas-minicart_menu, .offcanvas-search_menu, .mobile-menu'
        ),
        $offcanvasNavWrap = $(
            '.offcanvas-menu_wrapper, .offcanvas-minicart_wrapper, .offcanvas-search_wrapper, .mobile-menu_wrapper'
        ),
        $offcanvasNavSubMenu = $offcanvasNav.find('.sub-menu'),
        $menuToggle = $('.menu-btn'),
        $menuClose = $('.btn-close');

    /*Add Toggle Button With Off Canvas Sub Menu*/
    $offcanvasNavSubMenu
        .parent()
        .prepend(
            '<span class="menu-expand"><i class="ion-ios-plus-empty"></i></span>'
        );

    /*Close Off Canvas Sub Menu*/
    $offcanvasNavSubMenu.slideUp();

    /*Category Sub Menu Toggle*/
    $offcanvasNav.on('click', 'li a, li .menu-expand', function (e) {
        var $this = $(this);
        if (
            $this
                .parent()
                .attr('class')
                .match(
                    /\b(menu-item-has-children|has-children|has-sub-menu)\b/
                ) &&
            ($this.attr('href') === '#' ||
                $this.attr('href') === '' ||
                $this.hasClass('menu-expand'))
        ) {
            e.preventDefault();
            if ($this.siblings('ul:visible').length) {
                $this.siblings('ul').slideUp('slow');
            } else {
                $this
                    .closest('li')
                    .siblings('li')
                    .find('ul:visible')
                    .slideUp('slow');
                $this.closest('li').siblings('li').removeClass('menu-open');
                $this.siblings('ul').slideDown('slow');
                $this.parent().siblings().children('ul').slideUp();
            }
        }
        if (
            $this.is('a') ||
            $this.is('span') ||
            $this.attr('class').match(/\b(menu-expand)\b/)
        ) {
            $this.parent().toggleClass('menu-open');
        } else if (
            $this.is('li') &&
            $this.attr('class').match(/\b('menu-item-has-children')\b/)
        ) {
            $this.toggleClass('menu-open');
        }
    });

    $('.btn-close').on('click', function (e) {
        e.preventDefault();
        $('.mobile-menu .sub-menu').slideUp();
        $('.mobile-menu .menu-item-has-children').removeClass('menu-open');
    });
    /*----------------------------------------*/
    /*  Category Menu
/*----------------------------------------*/
    $('.rx-parent').on('click', function () {
        $('.rx-child').slideToggle();
        $(this).toggleClass('rx-change');
    });
    //    category heading
    $('.category-heading').on('click', function () {
        $('.category-menu-list').slideToggle(900);
        $('.cat-mega-menu, .right-menu > ul').slideUp();
        $('.menu-expand').removeClass('active');
    });
    /*-- Category Menu Toggles --*/
    function categorySubMenuToggle() {
        var screenSize = $(window).width();
        if (screenSize <= 991) {
            $('#cate-toggle .right-menu > a').prepend(
                '<i class="expand menu-expand"></i>'
            );
            $('.category-menu .right-menu ul').slideUp();
        } else {
            $('.category-menu .right-menu > a i').remove();
            $('.category-menu .right-menu ul').slideDown();
        }
    }
    categorySubMenuToggle();
    $(window).resize(categorySubMenuToggle);
    /*-- Category Sub Menu --*/
    function categoryMenuHide() {
        var screenSize = $(window).width();
        if (screenSize <= 991) {
            $('.category-menu-list').hide();
        } else {
            $('.category-menu-list').show();
        }
    }
    categoryMenuHide();
    $(window).resize(categoryMenuHide);
    $('.category-menu-hidden').find('.category-menu-list').hide();
    $('.category-menu-list').on(
        'click',
        'li a, li a .menu-expand',
        function (e) {
            var $a = $(this).hasClass('menu-expand')
                ? $(this).parent()
                : $(this);
            $(this).toggleClass('active');
            $(this).children('.menu-expand').toggleClass('active');
            if ($a.parent().hasClass('right-menu')) {
                if (
                    $a.attr('href') === '#' ||
                    $(this).hasClass('menu-expand')
                ) {
                    if ($a.siblings('ul:visible').length > 0)
                        $a.siblings('ul').slideUp();
                    else {
                        $(this)
                            .parents('li')
                            .siblings('li')
                            .find('ul:visible')
                            .slideUp();
                        $a.siblings('ul').slideDown();
                    }
                }
            }
            if ($(this).hasClass('menu-expand') || $a.attr('href') === '#') {
                e.preventDefault();
                return false;
            }
        }
    );

    /*----------------------------------------*/
    /*  Nice Select
/*----------------------------------------*/
    $('.nice-select').niceSelect();
    /*----------------------------------------*/
    /*  Hiraola's Product Slider
/*----------------------------------------*/
    // $('.hiraola-product_slider').slick({
    //     infinite: true,
    //     arrows: true,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 5,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 5,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 4,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's Product Slider Two
/*----------------------------------------*/
    // $('.hiraola-product_slider-2').slick({
    //     infinite: true,
    //     arrows: true,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's Product Slider Three
/*----------------------------------------*/
    // $('.hiraola-product_slider-3').slick({
    //     infinite: true,
    //     arrows: true,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's Special Product Slider
/*----------------------------------------*/
    // $('.hiraola-special-product_slider').slick({
    //     infinite: true,
    //     arrows: true,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's Trending Product Slider
/*----------------------------------------*/
    // $('.hiraola-trending-product_slider').slick({
    //     infinite: true,
    //     arrows: false,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's Blog Slider
/*----------------------------------------*/
    // $('.hiraola-blog_slider').slick({
    //     infinite: true,
    //     arrows: false,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's Single Blog Slider
/*----------------------------------------*/
    // $('.hiraola-single-blog_slider').slick({
    //     infinite: true,
    //     arrows: false,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     fade: true,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's Testimonial Slider
/*----------------------------------------*/
    // $('.hiraola-testimonial_slider').slick({
    //     infinite: true,
    //     arrows: true,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     centerMode: true,
    //     centerPadding: '450px',
    //     focusOnSelect: true,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '290px',
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '230px',
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '50px',
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '30px',
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '30px',
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's Testimonial Slider Two
/*----------------------------------------*/
    // $('.testimonial-img_slider').slick({
    //     infinite: true,
    //     arrows: false,
    //     dots: false,
    //     centerMode: true,
    //     focusOnSelect: true,
    //     centerPadding: '170px',
    //     asNavFor: '.testimonial-content_slider',
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '105px',
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '210px',
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '150px',
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '130px',
    //             },
    //         },
    //         {
    //             breakpoint: 479,
    //             settings: {
    //                 slidesToShow: 1,
    //                 centerPadding: '80px',
    //             },
    //         },
    //     ],
    // });
    // $('.testimonial-content_slider').slick({
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     asNavFor: '.testimonial-img_slider',
    //     arrows: false,
    //     fade: true,
    //     dots: true,
    // });
    /*----------------------------------------*/
    /*  Hiraola's Brand Product Slider
/*----------------------------------------*/
    // $('.hiraola-brand-product_slider').slick({
    //     infinite: true,
    //     arrows: false,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 4,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*  Hiraola's Product Tab Slider Two
/*----------------------------------------*/

    /*  Hiraola's Product Tab Slider Three
/*----------------------------------------*/
    // $('.hiraola-product-tab_slider-3').slick({
    //     infinite: true,
    //     arrows: true,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 4,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's List Product Slider
/*----------------------------------------*/
    // $('.list-product_slider').slick({
    //     infinite: true,
    //     arrows: false,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     rows: 3,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /* Hiraola's Countdown
/*----------------------------------------*/
    $('.hiraola-countdown').countdown('2022/12/01', function (event) {
        $(this).html(
            event.strftime(
                '<div class="count"><span class="count-amount">%D</span><span class="count-period">Days</span></div><div class="count"><span class="count-amount">%H</span><span class="count-period">Hrs</span></div><div class="count"><span class="count-amount">%M</span><span class="count-period">Mins</span></div><div class="count"><span class="count-amount">%S</span><span class="count-period">Secs</span></div>'
            )
        );
    });

    /*---------------------------------------------*/
    /*  Hiraola's Brand Slider
/*----------------------------------------------*/
    // $('.hiraola-brand_slider').slick({
    //     infinite: true,
    //     arrows: true,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 6,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1501,
    //             settings: {
    //                 slidesToShow: 6,
    //             },
    //         },
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 5,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 4,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 3,
    //             },
    //         },
    //         {
    //             breakpoint: 576,
    //             settings: {
    //                 slidesToShow: 2,
    //             },
    //         },
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------
	/* 	Instafeed active
------------------------------------*/
    if ($('#Instafeed').length) {
        var feed = new Instafeed({
            get: 'user',
            userId: 6665768655,
            accessToken: '6665768655.1677ed0.313e6c96807c45d8900b4f680650dee5',
            target: 'Instafeed',
            resolution: 'low_resolution',
            limit: 6,
            template:
                '<li><a href="{{link}}" target="_new"><img src="{{image}}" /></a></li>',
        });
        feed.run();
    }

    /*----------------------------------------*/
    /*  Hiraola's Scroll To Top
/*----------------------------------------*/
    $.scrollUp({
        scrollText: '<i class="fa fa-chevron-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
    });

    /*----------------------------------------*/
    /*  Cart Plus Minus Button
/*----------------------------------------*/
    $('.cart-plus-minus').append(
        '<div class="dec qtybutton"><i class="fa fa-angle-down"></i></div><div class="inc qtybutton"><i class="fa fa-angle-up"></i></div>'
    );
    $('.qtybutton').on('click', function () {
        var $button = $(this);
        var oldValue = $button.parent().find('input').val();
        if ($button.hasClass('inc')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 1) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 1;
            }
        }
        $button.parent().find('input').val(newVal);
    });

    /*----------------------------------------*/
    /* Toggle Function Active
/*----------------------------------------*/
    // showlogin toggle
    $('#showlogin').on('click', function () {
        $('#checkout-login').slideToggle(900);
    });
    // showlogin toggle
    $('#showcoupon').on('click', function () {
        $('#checkout_coupon').slideToggle(900);
    });
    // showlogin toggle
    $('#cbox').on('click', function () {
        $('#cbox-info').slideToggle(900);
    });

    // showlogin toggle
    $('#ship-box').on('click', function () {
        $('#ship-box-info').slideToggle(1000);
    });

    /*----------------------------------------*/
    /* FAQ Accordion
/*----------------------------------------*/
    $('.card-header a').on('click', function () {
        $('.card').removeClass('actives');
        $(this).parents('.card').addClass('actives');
    });

    /*----------------------------------------*/
    /*  Sidebar Categories Menu Activation
/*----------------------------------------*/
    $('.sidebar-categories_menu li.has-sub > a').on('click', function () {
        $(this).removeAttr('href');
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp();
        } else {
            element.addClass('open');
            element.children('ul').slideDown();
            element.siblings('li').children('ul').slideUp();
            element.siblings('li').removeClass('open');
            element.siblings('li').find('li').removeClass('open');
            element.siblings('li').find('ul').slideUp();
        }
    });

    /*---------------------------------------------*/
    /*  Hiraola'sCounterUp
/*----------------------------------------------*/
    $('.count').counterUp({
        delay: 10,
        time: 1000,
    });

    /*----------------------------------------*/
    /*  Hiraola's Product View Mode
/*----------------------------------------*/
    function porductViewMode() {
        $(window).on({
            load: function () {
                var activeChild = $('.product-view-mode a.active');
                var firstChild = $('.product-view-mode').children().first();
                var window_width = $(window).width();

                if (window_width < 576) {
                    $('.product-view-mode a').removeClass('active');
                    $('.product-view-mode')
                        .children()
                        .first()
                        .addClass('active');
                    $('.shop-product-wrap')
                        .removeClass('gridview-3 gridview-4 gridview-5')
                        .addClass('gridview-2');
                }
            },
            resize: function () {
                var ww = $(window).width();
                var activeChild = $('.product-view-mode a.active');
                var firstChild = $('.product-view-mode').children().first();
                var defaultView = $('.product-view-mode').data('default');

                if (ww < 1200 && ww > 575) {
                    if (activeChild.hasClass('grid-5')) {
                        $('.product-view-mode a.grid-5').removeClass('active');
                        if (defaultView == 4) {
                            $('.product-view-mode a.grid-4').addClass('active');
                            $('.shop-product-wrap')
                                .removeClass('gridview-2 gridview-3 gridview-5')
                                .addClass('gridview-4');
                        } else if (defaultView == 'list') {
                            $('.product-view-mode a.list').addClass('active');
                            $('.shop-product-wrap')
                                .removeClass(
                                    'gridview-2 gridview-3 gridview-4 gridview-5'
                                )
                                .addClass('listview');
                        } else {
                            $('.product-view-mode a.grid-3').addClass('active');
                            $('.shop-product-wrap')
                                .removeClass('gridview-2 gridview-4 gridview-5')
                                .addClass('gridview-3');
                        }
                    }
                }

                if (ww < 768 && ww > 575) {
                    if (activeChild.hasClass('grid-4')) {
                        $('.product-view-mode a.grid-4').removeClass('active');
                        if (defaultView == 'list') {
                            $('.product-view-mode a.list').addClass('active');
                            $('.shop-product-wrap')
                                .removeClass(
                                    'gridview-2 gridview-3 gridview-4 gridview-5'
                                )
                                .addClass('listview');
                        } else {
                            $('.product-view-mode a.grid-3').addClass('active');
                            $('.shop-product-wrap')
                                .removeClass('gridview-2 gridview-4 gridview-5')
                                .addClass('gridview-3');
                        }
                    }
                }
                if (activeChild.hasClass('list')) {
                } else {
                    if (ww < 576) {
                        $('.product-view-mode a').removeClass('active');
                        $('.product-view-mode')
                            .children()
                            .first()
                            .addClass('active');
                        $('.shop-product-wrap')
                            .removeClass('gridview-3 gridview-4 gridview-5')
                            .addClass('gridview-2');
                    } else {
                        if (activeChild.hasClass('grid-2')) {
                            if (ww < 1200) {
                                $(
                                    '.product-view-mode a:not(:first-child)'
                                ).removeClass('active');
                            } else {
                                $('.product-view-mode a').removeClass('active');
                                $('.product-view-mode a:nth-child(2)').addClass(
                                    'active'
                                );
                                $('.shop-product-wrap')
                                    .removeClass(
                                        'gridview-2 gridview-4 gridview-5'
                                    )
                                    .addClass('gridview-3');
                            }
                        }
                    }
                }
            },
        });
        $('.product-view-mode a').on('click', function (e) {
            e.preventDefault();

            var shopProductWrap = $('.shop-product-wrap');
            var viewMode = $(this).data('target');

            $('.product-view-mode a').removeClass('active');
            $(this).addClass('active');
            if (viewMode == 'listview') {
                shopProductWrap.removeClass('grid');
            } else {
                if (shopProductWrap.not('.grid'))
                    shopProductWrap.addClass('grid');
            }
            shopProductWrap
                .removeClass(
                    'gridview-2 gridview-3 gridview-4 gridview-5 listview'
                )
                .addClass(viewMode);
        });
    }
    porductViewMode();

    /*----------------------------------------*/
    /*  Star Rating Js
/*----------------------------------------*/
    $(function () {
        $('.star-rating').barrating({
            theme: 'fontawesome-stars',
        });
    });

    /*-------------------------------------------------*/
    /* Hiraola's Sticky Sidebar
/*-------------------------------------------------*/
    $('#sticky-sidebar').theiaStickySidebar({
        // Settings
        additionalMarginTop: 80,
    });

    /*-------------------------------------------------*/
    /* Hiraola's Bootstraps 4 Tooltip
/*-------------------------------------------------*/
    // $(function () {
    //     $('[data-bs-toggle="tooltip"]').tooltip();
    // });
    /*--------------------------------
    Price Slider Active
-------------------------------- */
    var sliderrange = $('#slider-range');
    var amountprice = $('#amount');
    $(function () {
        sliderrange.slider({
            range: true,
            min: 20,
            max: 100,
            values: [0, 100],
            slide: function (event, ui) {
                amountprice.val('$' + ui.values[0] + ' - $' + ui.values[1]);
            },
        });
        amountprice.val(
            '$' +
                sliderrange.slider('values', 0) +
                ' - $' +
                sliderrange.slider('values', 1)
        );
    });
    /*----------------------------------------*/
    /*  Hiraola's Slick Carousel
 /*----------------------------------------*/
    var $html = $('html');
    var $body = $('body');
    var $elementCarousel = $('.hiraola-slick-slider');
    // Check if element exists
    $.fn.elExists = function () {
        return this.length > 0;
    };

    /*For RTL*/
    if ($html.attr('dir') == 'rtl' || $body.attr('dir') == 'rtl') {
        $elementCarousel.attr('dir', 'rtl');
    }

    if ($elementCarousel.elExists()) {
        var slickInstances = [];

        /*For RTL*/
        if ($html.attr('dir') == 'rtl' || $body.attr('dir') == 'rtl') {
            $elementCarousel.attr('dir', 'rtl');
        }

        $elementCarousel.each(function (index, element) {
            var $this = $(this);

            // Carousel Options

            var $options =
                typeof $this.data('slick-options') !== 'undefined'
                    ? $this.data('slick-options')
                    : '';

            var $spaceBetween = $options.spaceBetween
                    ? parseInt($options.spaceBetween, 10)
                    : 0,
                $spaceBetween_xl = $options.spaceBetween_xl
                    ? parseInt($options.spaceBetween_xl, 10)
                    : 0,
                $rowSpace = $options.rowSpace
                    ? parseInt($options.rowSpace, 10)
                    : 0,
                $vertical = $options.vertical ? $options.vertical : false,
                $focusOnSelect = $options.focusOnSelect
                    ? $options.focusOnSelect
                    : false,
                $asNavFor = $options.asNavFor ? $options.asNavFor : '',
                $fade = $options.fade ? $options.fade : false,
                $autoplay = $options.autoplay ? $options.autoplay : false,
                $autoplaySpeed = $options.autoplaySpeed
                    ? parseInt($options.autoplaySpeed, 10)
                    : 5000,
                $swipe = $options.swipe ? $options.swipe : true,
                $swipeToSlide = $options.swipeToSlide
                    ? $options.swipeToSlide
                    : true,
                $touchMove = $options.touchMove ? $options.touchMove : false,
                $verticalSwiping = $options.verticalSwiping
                    ? $options.verticalSwiping
                    : true,
                $draggable = $options.draggable ? $options.draggable : true,
                $arrows = $options.arrows ? $options.arrows : false,
                $dots = $options.dots ? $options.dots : false,
                $adaptiveHeight = $options.adaptiveHeight
                    ? $options.adaptiveHeight
                    : true,
                $infinite = $options.infinite ? $options.infinite : false,
                $centerMode = $options.centerMode ? $options.centerMode : false,
                $centerPadding = $options.centerPadding
                    ? $options.centerPadding
                    : '',
                $variableWidth = $options.variableWidth
                    ? $options.variableWidth
                    : false,
                $speed = $options.speed ? parseInt($options.speed, 10) : 500,
                $appendArrows = $options.appendArrows
                    ? $options.appendArrows
                    : $this,
                $prevArrow =
                    $arrows === true
                        ? $options.prevArrow
                            ? '<span class="' +
                              $options.prevArrow.buttonClass +
                              '"><i class="' +
                              $options.prevArrow.iconClass +
                              '"></i></span>'
                            : '<button class="tty-slick-text-btn tty-slick-text-prev"><i class="ion-ios-arrow-back"></i></span>'
                        : '',
                $nextArrow =
                    $arrows === true
                        ? $options.nextArrow
                            ? '<span class="' +
                              $options.nextArrow.buttonClass +
                              '"><i class="' +
                              $options.nextArrow.iconClass +
                              '"></i></span>'
                            : '<button class="tty-slick-text-btn tty-slick-text-next"><i class="ion-ios-arrow-forward"></i></span>'
                        : '',
                $rows = $options.rows ? parseInt($options.rows, 10) : 1,
                $rtl =
                    $options.rtl ||
                    $html.attr('dir="rtl"') ||
                    $body.attr('dir="rtl"')
                        ? true
                        : false,
                $slidesToShow = $options.slidesToShow
                    ? parseInt($options.slidesToShow, 10)
                    : 1,
                $slidesToScroll = $options.slidesToScroll
                    ? parseInt($options.slidesToScroll, 10)
                    : 1;

            /*Responsive Variable, Array & Loops*/
            var $responsiveSetting =
                    typeof $this.data('slick-responsive') !== 'undefined'
                        ? $this.data('slick-responsive')
                        : '',
                $responsiveSettingLength = $responsiveSetting.length,
                $responsiveArray = [];
            for (var i = 0; i < $responsiveSettingLength; i++) {
                $responsiveArray[i] = $responsiveSetting[i];
            }

            // Adding Class to instances
            $this.addClass('slick-carousel-' + index);
            $this
                .parent()
                .find('.slick-dots')
                .addClass('dots-' + index);
            $this
                .parent()
                .find('.slick-btn')
                .addClass('btn-' + index);

            if ($spaceBetween != 0) {
                $this.addClass('slick-gutter-' + $spaceBetween);
            }
            if ($spaceBetween_xl != 0) {
                $this.addClass('slick-gutter-xl-' + $spaceBetween_xl);
            }
            var $slideCount = null;
            $this.on('init', function (event, slick) {
                $this.find('.slick-active').first().addClass('first-active');
                $this.find('.slick-active').last().addClass('last-active');
                $slideCount = slick.slideCount;
                if ($slideCount <= $slidesToShow) {
                    $this.children('.slick-dots').hide();
                }
                var $firstAnimatingElements =
                    $('.slick-slide').find('[data-animation]');
                doAnimations($firstAnimatingElements);
            });

            // $this.slick({
            //     slidesToShow: $slidesToShow,
            //     slidesToScroll: $slidesToScroll,
            //     asNavFor: $asNavFor,
            //     autoplay: $autoplay,
            //     autoplaySpeed: $autoplaySpeed,
            //     speed: $speed,
            //     infinite: $infinite,
            //     arrows: $arrows,
            //     dots: $dots,
            //     adaptiveHeight: $adaptiveHeight,
            //     vertical: $vertical,
            //     focusOnSelect: $focusOnSelect,
            //     centerMode: $centerMode,
            //     centerPadding: $centerPadding,
            //     variableWidth: $variableWidth,
            //     swipe: $swipe,
            //     swipeToSlide: $swipeToSlide,
            //     touchMove: $touchMove,
            //     draggable: $draggable,
            //     fade: $fade,
            //     appendArrows: $appendArrows,
            //     prevArrow: $prevArrow,
            //     nextArrow: $nextArrow,
            //     rtl: $rtl,
            //     responsive: $responsiveArray,
            // });

            $this.on(
                'beforeChange',
                function (e, slick, currentSlide, nextSlide) {
                    $this
                        .find('.slick-active')
                        .first()
                        .removeClass('first-active');
                    $this
                        .find('.slick-active')
                        .last()
                        .removeClass('last-active');
                    var $animatingElements = $(
                        '.slick-slide[data-slick-index="' + nextSlide + '"]'
                    ).find('[data-animation]');
                    doAnimations($animatingElements);
                }
            );

            function doAnimations(elements) {
                var animationEndEvents =
                    'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                elements.each(function () {
                    var $el = $(this);
                    var $animationDelay = $el.data('delay');
                    var $animationDuration = $el.data('duration');
                    var $animationType = 'animated ' + $el.data('animation');
                    $el.css({
                        'animation-delay': $animationDelay,
                        'animation-duration': $animationDuration,
                    });
                    $el.addClass($animationType).one(
                        animationEndEvents,
                        function () {
                            $el.removeClass($animationType);
                        }
                    );
                });
            }

            $this.on('afterChange', function (e, slick) {
                $this.find('.slick-active').first().addClass('first-active');
                $this.find('.slick-active').last().addClass('last-active');
            });

            // Updating the sliders in tab
            $('body').on(
                'shown.bs.tab',
                'a[data-bs-toggle="tab"], a[data-bs-toggle="pill"]',
                function (e) {
                    // $this.slick('setPosition');
                }
            );
        });
    }
    /*----------------------------------------*/
    /*  Single Product Image Slider
 /*----------------------------------------*/
    // $('.sp-img_slider').slick({
    //     infinite: true,
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1199,
    //             settings: {
    //                 slidesToShow: 3,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 3,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 767,
    //             settings: {
    //                 slidesToShow: 3,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Latest Blog Slider
 /*----------------------------------------*/
    // $('.latest-blog_slider').slick({
    //     infinite: true,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1199,
    //             settings: {
    //                 slidesToShow: 3,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 1,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Brand Slider
 /*----------------------------------------*/
    // $('.brand-slider').slick({
    //     infinite: true,
    //     arrows: false,
    //     dots: false,
    //     speed: 2000,
    //     slidesToShow: 5,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1199,
    //             settings: {
    //                 slidesToShow: 3,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    /*----------------------------------------*/
    /*  Hiraola's Color List
 /*----------------------------------------*/

    // $('.color-list a').on('click', function (e) {
    //     e.preventDefault();
    //     var $this = $(this);
    //     $this.addClass('active');
    //     $this.siblings().removeClass('active');
    //     var $navs = document.querySelectorAll(
    //         '.slick-slider-nav .single-slide'
    //     );
    //     var $details = document.querySelectorAll(
    //         '.slick-img-slider .single-slide'
    //     );
    //     console.log($navs);
    //     var $btnColor = $this.data('swatch-color');
    //     for (var i = 0; i < $navs.length; i++) {
    //         $navs[i].classList.remove('slick-current');
    //         if ($navs[i].classList.contains($btnColor)) {
    //             $navs[i].classList.add('slick-current');
    //         }
    //     }
    //     for (var i = 0; i < $details.length; i++) {
    //         $details[i].classList.remove('slick-current');
    //         $details[i].style.opacity = 0;
    //         if ($details[i].classList.contains($btnColor)) {
    //             $details[i].classList.add('slick-current');
    //             $details[i].style.opacity = 1;
    //         }
    //     }
    // });
    /*----------------------------------------*/
    /*  Single Product Image Slider Three
 /*----------------------------------------*/
    // $('.sp-img_slider-3').slick({
    //     infinite: true,
    //     slidesToShow: 4,
    //     vertical: true,
    //     slidesToScroll: 1,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-up"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-down"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1200,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 1199,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 992,
    //             settings: {
    //                 slidesToShow: 5,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 767,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 321,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    /*--------------------------
        Hiraola's Product Zoom
	---------------------------- */
    // $('.zoompro').elevateZoom({
    //     gallery: 'gallery',
    //     galleryActiveClass: 'active',
    // });
    /*----------------------------------------*/
    /*  Single Product Slider
 /*----------------------------------------*/
    // $('.sp-slider').slick({
    //     infinite: true,
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     arrows: true,
    //     dots: false,
    //     prevArrow:
    //         '<button class="slick-prev"><i class="ion-ios-arrow-back"></i></button>',
    //     nextArrow:
    //         '<button class="slick-next"><i class="ion-ios-arrow-forward"></i></button>',
    //     responsive: [
    //         {
    //             breakpoint: 1199,
    //             settings: {
    //                 slidesToShow: 3,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 3,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 767,
    //             settings: {
    //                 slidesToShow: 4,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //         {
    //             breakpoint: 575,
    //             settings: {
    //                 slidesToShow: 2,
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    // });
    /*------------------------------------
	        DateCountdown active 1
	    ------------------------------------- */
    $('.DateCountdown').TimeCircles({
        direction: 'Counter-clockwise',
        fg_width: 0.009,
        bg_width: 0,
        use_background: false,
        animation: 'thick',
        time: {
            Days: {
                text: 'Days',
                color: '#fff',
            },
            Hours: {
                text: 'Hours',
                color: '#fff',
            },
            Minutes: {
                text: 'Mins',
                color: '#fff',
            },
            Seconds: {
                text: 'Secs',
                color: '#fff',
            },
        },
    });
    /*--------------------------------
    MailChimp
-------------------------------- */
    $('#mc-form').ajaxChimp({
        language: 'en',
        callback: mailChimpResponse,
        url: 'https://devitems.us11.list-manage.com/subscribe/post?u=6bbb9b6f5827bd842d9640c82&amp;id=05d85f18ef',
    });
    function mailChimpResponse(resp) {
        if (resp.result === 'success') {
            $('.mailchimp-success').addClass('active');
            $('.mailchimp-success')
                .html('' + resp.msg)
                .fadeIn(900);
            $('.mailchimp-error').fadeOut(400);
        } else if (resp.result === 'error') {
            $('.mailchimp-error')
                .html('' + resp.msg)
                .fadeIn(900);
        }
    }
    /*--------------------------------
    Ajax Contact Form
-------------------------------- */
$(function () {
    // Get the form.
    var form = $('#contact-form');
    // Get the messages div.
    var formMessages = $('.form-message');
    // Set up an event listener for the contact form.
    $(form).submit(function (e) {
        // Stop the browser from submitting the form.
        e.preventDefault();
        // Serialize the form data.
        var formData = $(form).serialize();
        // Submit the form using AJAX.
        $.ajax({
            type: 'POST',
            url: $(form).attr('action'),
            data: formData,
        })
            .done(function (response) {
                // Make sure that the formMessages div has the 'success' class.
                $(formMessages).removeClass('error');
                $(formMessages).addClass('success');

                // Set the message text.
                $(formMessages).text(response);

                // Clear the form.
                $('#contact-form input,#contact-form textarea').val('');
            })
            .fail(function (data) {
                // Make sure that the formMessages div has the 'error' class.
                $(formMessages).removeClass('success');
                $(formMessages).addClass('error');

                // Set the message text.
                if (data.responseText !== '') {
                    $(formMessages).text(data.responseText);
                } else {
                    $(formMessages).text(
                        'Oops! An error occured and your message could not be sent.'
                    );
                }
            });
    });
});

})(jQuery);
