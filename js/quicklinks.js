(function (window, $) {

    /** * * * * * * * * * * *
     *
     * Functions & Objects
     *
     ** * * * * * * * * * * */

    function appendOpacityLayers(e) {

        e.$slider
            .find('.quicklinks-widget-slick-opacity-layer').remove();

        e.$slider
            .append('<span class="quicklinks-widget-slick-opacity-layer quicklinks-widget-slick-opacity-layer-left"></span>')
            .append('<span class="quicklinks-widget-slick-opacity-layer quicklinks-widget-slick-opacity-layer-right"></span>');
    }


    function onInit(e) {
        appendOpacityLayers(e);
    }

    /**
     * SlidePanels
     * @param $panels
     * @param settings
     * @constructor
     */
    function SlidePanels($panels, settings) {

        this._$panels  = $panels;
        this._isMobile = false; // FIXME
        this._settings = $.extend({
            openClass : 'hover',
            event : 'hover',
            hoverDelay : 333,
            timeoutDataAttribute : 'slide-panel-hover-timeout',
            relatedTabClass : 'quicklinks-widget-related-tab'
        }, settings || {});

        this.attachHandlers();
    }

    SlidePanels.prototype.closeAll = function () {
        this._$panels.removeClass(this._settings.openClass);

        this
            .getRelatedTabs()
            .hide();
    };

    SlidePanels.prototype.close = function ($panel) {
        $panel.removeClass(this._settings.openClass);
        this
            .getRelatedTab($panel)
            .hide();
    };

    SlidePanels.prototype.getRelatedTab = function ($panel) {
        var tabId = $panel.data('relatedTab');
        return  $(tabId);
    };

    SlidePanels.prototype.getRelatedTabContainerId = function () {
        return this._$panels.data('relatedTabs');
    };

    SlidePanels.prototype.getRelatedTabContainer = function () {
        return  $(this.getRelatedTabContainerId());
    };

    SlidePanels.prototype.getRelatedTabs = function () {
        return  $(this.getRelatedTabContainerId() + ' .' + this._settings.relatedTabClass);
    };

    SlidePanels.prototype.open = function ($panel) {
        $panel
            .addClass(this._settings.openClass);

        this.getRelatedTabContainer()
            .show();

        this
            .getRelatedTab($panel)
            .show();
    };

    SlidePanels.prototype.canApplyDelay = function () {
        return this._isMobile !== true && this._settings.hoverDelay > 0;
    };

    SlidePanels.prototype.addTimeout = function ($panel, t) {
        $panel.data(this._settings.timeoutDataAttribute, t);
    };

    SlidePanels.prototype.getTimeout = function ($panel) {
        return $panel.data(this._settings.timeoutDataAttribute);
    };

    SlidePanels.prototype.attachHandlers = function () {
        var self = this;

        if(this._settings.event === 'click') {

            this._$panels.on('click', function () {
                var $panel = $(this);
                self.closeAll();
                self.open($panel);
            });

        }


        if(this._settings.event === 'hover') {

            this._$panels.hover(function () {

                var $panel = $(this);

                if(self.canApplyDelay()) {

                    var t = window.setTimeout(function () {
                        self.open($panel);
                    }, self._settings.hoverDelay);

                    self.addTimeout($panel, t);
                }

            }, function () {

                var $panel = $(this);
                if(self.canApplyDelay()) {
                    window.clearTimeout(self.getTimeout($panel));
                }

                self.close($panel);

            });
        }

    };

    /** * * * * * * * * *
     *
     * Document Ready
     *
     ** * * * * * * * * */
    $(document).ready(function(){

        $('.quicklinks-widget-slick').slick({
            centerMode: true,
            slidesToShow: 5,
            arrows: true,
            infinite: true,
            onInit : onInit,
            focusOnSelect : false,
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        //arrows: false,
                        centerMode: true,
                        centerPadding: '30px',
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 580,
                    settings: {
                        //arrows: false,
                        centerMode: true,
                        centerPadding: '60px',
                        slidesToShow: 1
                    }
                }
            ]
        });

        var slidePanels = new SlidePanels($('.quicklinks-widget-slick-slide-content'), {
            event : 'click'
        });

    });

})(window, $);