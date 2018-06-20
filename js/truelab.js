(function (window, $) {

    var Truelab = {};

    /**
     *
     * Truelab.googleMapManager
     *
     **/
    Truelab.googleMapManager = {
        _initialized : 'nope',
        /**
         * @param {function} fn
         **/
        ready : function (fn) {

            if(!this._initialized === 'nope') {
                this._onLoad();
            }

            this._readyFns.push(fn);
            return this;
        },
        /**
         * @rvar {array}
         */
        _readyFns : [],
        /**
         * @returns {void}
         */
        _onLoad : function () {
            var self = this;
            $(document).ready(function () {
                self._initialized = 'initializing';

                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&' +
                    'callback=Truelab.googleMapManager._initialize';
                document.body.appendChild(script);
            });
        },
        /**
         * @returns {void}
         */
        _initialize: function () {
            this._initialized = true;

            for(var i = 0; i < this._readyFns.length; i++) {
                this._readyFns[i].apply(this._readyFns[i], [window.google.maps]);
            }
        }
    };


    /**
     * Truelab.GoogleMap
     *
     * @param id
     * @constructor
     */
    Truelab.GoogleMap = function(id) {
        this.id = id;
    };

    /**
     * @returns {jQuery|HTMLElement}
     */
    Truelab.GoogleMap.prototype.$map = function () {
        return  $('#' + this.id);
    };

    /**
     * @returns {HTMLElement}
     */
    Truelab.GoogleMap.prototype.getElement = function () {
        return document.getElementById(this.id);
    };

    /**
     * @returns {object}
     */
    Truelab.GoogleMap.prototype.getOptions = function () {
        return {
            center: { lat:  this.$map().data('google-map-lat'), lng:  this.$map().data('google-map-lng')},
            zoom: this.$map().data('google-map-zoom') || 8,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: false
        }
    };



    /**
     * Truelab YouTubeHelper
     */
    Truelab.YouTubeHelper = {
        _fnsOnIFrameAPIReady: [],
        _loadedIFrameApi : false,
        loadIFrameApi : function () {
            // 2. This code loads the IFrame Player API code asynchronously.
            var tag = document.createElement('script');

            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            return this;
        },
        onIFrameAPIReady : function (fn) {
            this._fnsOnIFrameAPIReady.push(fn);
            return this;
        },
        initIFrameApi : function () {
            var self = this;

            if(self._loadedIFrameApi) { return; }

            self.loadIFrameApi();

            self._loadedIFrameApi = true;

            window.onYouTubeIframeAPIReady = function () {
                for(var i = 0; i < self._fnsOnIFrameAPIReady.length; i++) {
                    self._fnsOnIFrameAPIReady[i](window.YT);
                }
            }

            return this;
        }
    };


    /*** Color Applier **/
    function ColorApplier(_items, _options) {
        this.options = $.extend({
            color    : '#0d7854',
            selector : '.panel-center-colored'
        }, _options || {});
        this.items    = _items;
    }

    ColorApplier.prototype.colors = function(_element, _color) {
        var self   = this;
        var $panel = $(_element).parents(self.options.selector);
        var color  = _color || $panel.data('color');

        $.each(self.items, function (index, item) {
            if(item.selector === self.options.selector) {
                $panel.css(item.property, color);
            }else{
                $panel.find(item.selector).css(item.property, color);
            }
        });

        return this;
    };

    ColorApplier.prototype.reset = function (_element) {
        return this.colors(_element, this.options.color);
    };

    ColorApplier.prototype.callbackFn = function (_method, _check) {
        var self = this;
        return function(){
            var $panel = $($(this).attr('href'));

            if(_check && ($panel.hasClass('in') || $panel.hasClass('collapsing'))) { return; }

            self[_method](this);
        }
    };

    Truelab.ColorApplier = ColorApplier;

    window.Truelab = Truelab;

    /**
     *
     * Truelab jQuery plugins namespace
     *
     * @usage
     * .truelab()
     *     .plugin({
     *         optionName : 'optionValue'
     *     });
     */
    $.fn.truelab = function () {
        var jq = this;
        return {
            /**
             * Scroll to element with jquery animation
             *
             * @param {object} options
             * @returns {$(this)}
             */
            goTo: function(options){

                var opt = $.extend({
                    offset : 0,
                    animation : {
                        duration : 'fast',
                        easing : 'swing',
                        complete: function (){}
                    }
                }, options)

                return jq.each(function() {

                    var offset =  $(this).offset().top - opt.offset;

                    $('html, body').animate({
                        scrollTop: offset + 'px'
                    }, opt.animation.duration, opt.animation.easing, opt.animation.complete);

                    return this;
                });
            },
            appendAnchor : function (options) {
                var opt = $.extend({
                    anchor : 'anchor'
                }, options || {});

                function appendAnchor(string) {
                    if( (string.indexOf('#' + opt.anchor) > -1) === false ){
                        return string + '#' + opt.anchor;
                    }else{
                        return string;
                    }
                }

                return jq.each(function() {

                    var $this = $(this);

                    // is form
                    if($this.is('form')) {
                        $this.submit(function () {
                            $this.attr('action', appendAnchor($this.attr('action')));
                        });
                    }

                    // is link
                    if($this.is('a')) {
                        $this.attr('href', appendAnchor($this.attr('href')));
                    }

                    return this;
                });
            },
            /**
             * menuToSelect
             *
             * @param {object} options
             * @returns {$(this)}
             *
             * @examples
             *
             * $('.nav').truelab()
             *     .menuToSelect();
             *
             *
             * $('#nav').truelab()
             *     .menuToSelect({
             *         // append select to selector
             *         appendTo : '#header',
             *
             *         // default option
             *         default : {
             *            selected: 'selected',
                          value   : '',
                          text    : 'Go to...'
             *         }
             *     });
             *
             * $('nav').truelab()
             *     .menuToSelect({
             *         // append select to the element returned by the function
             *         appendTo : function () {
             *              return $(this).parent('header');
             *         },
             *         // no default option
             *         default : false
             *     });
             */
            menuToSelect : function (options) {

                var opt = $.extend({
                    appendTo : null, // {Selector|Function} - A string containing a selector expression, default : this
                    checkSelected : function ($link, i, options) {
                        var href = $link.attr('href');
                        if(options.ignoreHash) {
                            href = href.substring(0, href.indexOf('#'));
                        }
                       return window.location.href.indexOf(href) > -1
                    },
                    'select' : {
                        attrs : {'class' : 'tl-menu-to-select'}
                    },
                    'wrap' : null,
                    'default' : {
                        value   : '',
                        text    : 'Go to...'
                    },
                    ignoreHash : true
                }, options || {});

                return jq.each(function() {
                    var $this = $(this),
                        self  = this,
                        $select,
                        $defaultOption,
                        $appendTo,
                        $links;

                    $links = $this.find('a');

                    if($links.size() === 0) {
                        return this;
                    }

                    if(opt.appendTo) {

                        if($.isFunction(opt.appendTo)) {
                            $appendTo = opt.appendTo.apply(self, []);
                        }else{
                            $appendTo = $(opt.appendTo);
                        }

                        if($appendTo.size() === 0) {
                            throw 'appendTo element not found';
                        }

                    }else{

                        $appendTo = $this;
                    }

                    $select   = $('<select></select>')
                        .attr(opt.select.attrs)
                        .appendTo($appendTo);

                    if(opt.wrap) {
                        $select.wrap(opt.wrap);
                    }

                    // Create default option "Go to..."
                    if(opt['default']) {
                        $defaultOption = $('<option></option>')
                            .attr(opt['default'])
                            .text(opt['default'].text || '');

                        $select.append($defaultOption);
                    }

                    // Populate select with menu items
                    $links.each(function($l, i) {
                        var $a = $(this);
                        var $option = $('<option></option>', {
                            "value"    : $a.attr('href'),
                            "text"     : $a.text()
                        }).appendTo($select);

                        if($.isFunction(opt.checkSelected) && opt.checkSelected($a, i, opt) ) {
                            $option.attr('selected', 'selected');
                        }
                    });

                    $select.change(function() {
                        var href =  $(this).find("option:selected").val();
                        if(href) {
                            window.location = href;
                        }
                    });
                });
            }
        }
    };

    /**
     * INIT
     */
    Truelab.googleMapManager._onLoad();

})(window, jQuery);
