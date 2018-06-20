(function (Truelab) {
    'use strict';

    Truelab.YouTubeHelper
        .initIFrameApi()
        .onIFrameAPIReady(function (YT) {

            var STATES = {
                INITIATED: 'initiated',
                PAUSED: 'paused',
                ENDED: 'ended',
                PLAYING: 'playing'
            };


            function EmotionalVideoBox($element) {
                var self = this;

                this.$element = $element;
                this.$playButton = this.$element.find('.emotional-video-play-button');
                this.$previewImage = this.$element.find('.emotional-video-thumbnail');
                this.$videoContainer = this.$element.find('.emotional-video-container');
                this.$caption = this.$element.find('.emotional-video-caption');

                this.$videoId = this.$element.data('emotionalVideoBox');
                this.$player  = null;
                this.$state   = null;

                this.$element.hover(function () {
                    self.$element.addClass('hover');
                    if (self.$state === STATES.PAUSED) {
                        self.$caption.fadeIn(200);
                    }
                }, function () {
                    self.$element.removeClass('hover');
                    if (self.$state === STATES.PAUSED) {
                        self.$caption.fadeOut(200);
                    }
                });
            }

            EmotionalVideoBox.prototype.findPlayerElement = function () {
                return this.$element.find('.emotional-video-player');
            };

            EmotionalVideoBox.prototype.onPlayerStateChange = function (e) {
                if (e.data === YT.PlayerState.PAUSED) {
                    this.onPlayerPause(e);
                    return;
                }

                if (e.data === YT.PlayerState.ENDED) {
                    this.onPlayerEnded(e);
                    return;
                }

                if (e.data === YT.PlayerState.PLAYING) {
                    this.onPlayerPlay(e);
                }
            };

            EmotionalVideoBox.prototype.onPlayerReady = function () {
                var self = this;

                this.$playButton.fadeIn();

                this.$playButton.on('click', function (e) {

                    e.preventDefault();
                    self.$previewImage.fadeOut(800);
                    self.$playButton.fadeOut(800);

                    self
                        .$player
                        .playVideo();

                    self.$element.addClass(STATES.INITIATED);
                    self.$state = STATES.INITIATED;
                });
            };

            EmotionalVideoBox.prototype.onPlayerPlay = function () {

                this.$previewImage.fadeOut();
                this.$playButton.fadeOut();
                this.$caption.fadeOut();

                this.$element
                    .removeClass(STATES.ENDED)
                    .removeClass(STATES.PAUSED);

                this.$state = STATES.PLAYING;
                this.$element.addClass(STATES.PLAYING);
            };

            EmotionalVideoBox.prototype.onPlayerEnded = function () {

                this.$playButton.fadeIn();
                this.$caption.fadeIn(200);

                this.$element
                    .removeClass(STATES.PLAYING)
                    .removeClass(STATES.PAUSED);

                this.$state = STATES.ENDED;
                this.$element.addClass(STATES.ENDED);
            };

            EmotionalVideoBox.prototype.onPlayerPause = function () {
                this.$playButton.fadeIn(200);
                this.$caption.fadeIn(200);

                this.$element
                    .removeClass(STATES.PLAYING)
                    .removeClass(STATES.ENDED);

                this.$state = STATES.PAUSED;
                this.$element.addClass(STATES.PAUSED);
            };

            EmotionalVideoBox.prototype.destroy = function () {
                console.log(this.$player);
            };

            $('*[data-emotional-video-box]').each(function () {

                var $element = $(this), player;
                var videoBox = new EmotionalVideoBox($element);
                

                function onPlayerReady() {
                    videoBox.$player = player;
                    videoBox
                        .onPlayerReady();
                }

                function onPlayerStateChange(e) {
                    videoBox
                        .onPlayerStateChange(e);
                }

                player = new YT.Player(videoBox.findPlayerElement().attr('id'), {
                    height: '390',
                    width: '640',
                    videoId: videoBox.$videoId,
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    },
                    playerVars: {
                        'autoplay': 0,
                        'controls': 1,
                        'showinfo': 0,
                        'autohide': 1,
                        'rel': 0,
                        'wmode': 'transparent',
                        'hd': 1
                    }
                });

            });
        });

})(window.Truelab);

