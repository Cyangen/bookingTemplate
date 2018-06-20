/**
 * Anchors
 *
 * @description adds html5 anchor segment to links or form actions
 */
jQuery(document).ready(function ($) {
    var selectors = [
        '.pagination-anchor-on-links a',
        'form.anchor-on-submit',
        '.anchor-link',
        '.anchor-links a'
    ];

    $(selectors.join(',')).truelab().appendAnchor({
        anchor : 'anchor-content'
    });
});

/**
 * Menu to select
 *
 * @description
 * Appends a select starting from menu/nav links
 */
jQuery(document).ready(function ($) {
    $('.menu-to-select').truelab()
        .menuToSelect({
            appendTo : function () {
                return $(this).parent('.col-xs-12');
            },
            wrap : '<div class="menu-to-select-wrap"></div>'
        });
});


/**
 * Search input on mobile
 *
 * @description
 *  - "open/focus" text input on first click on submit button,
 *  - "close" text input when click outside
 */
jQuery(document).ready(function ($) {

    var $wrap   = $('.navbar-search-input');
    var options = {
        openClass : 'open'
    };

    $wrap.each(function () {

        var $textInput    = $(this).find('input[type="text"]');
        var $submitButton = $(this).find('*[type="submit"]');

        // click on search button
        $submitButton.on('click', function (e) {
            if(!$textInput.hasClass(options.openClass)) {

                e.preventDefault();
                $textInput
                    .focus();
            }
        });

        // focus on search text input
        $textInput.on('focusin', function () {
            if(!$textInput.hasClass(options.openClass)) {
                $(this)
                    .addClass(options.openClass);
            }
        });
    });


    // click outside
    $('html').click(function (e) {
        var $target = $(e.target),
            $textInputs = [];

        if(!$target.closest('.navbar-search-input').length) {
            $textInputs = $('.navbar-search-input').find('input[type="text"]');
            $textInputs.each(function () {
                if($(this).hasClass(options.openClass)) {
                    $(this).removeClass(options.openClass);
                };
            });
        }
    });
});

/**
 * Hack to remove prev/next text from bootstrap pagination
 */
jQuery(document).ready(function ($) {
    var $paginationNextPrevLinks = $('.pagination li.next, .pagination li.prev');

    $paginationNextPrevLinks.find('span, a').each(function () {
        if ( $(this).parents('li').hasClass('prev') ) {
           $(this).html('←');
        }else{
           $(this).html('→');
        }
    });
});