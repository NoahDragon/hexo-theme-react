/*!
 * React
 * Project Website: http://react.pimmey.com
 * @version 1.0
 * @author Yegor Borisenco <pimmey@pimmey.com>
 */

'use strict';

var App = {};

App = {
    /*
     Elements used throughout the app
     */
    GLOBAL: {
        activeToasts: 0,
        isTouch: function isTouch () {
            return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
        },
        progress: $('#progress')
    },

    /*
     Injecting the global CONFIG object from /assets/config/config.js
     */
    CONFIG: CONFIG === 'undefined' ? console.error('Missing config file') : CONFIG,

    /*
     Materialize modal
     Documentation: http://materializecss.com/modals.html
     */
    modal: function modal () {
        $('.modal-trigger').leanModal();
    },

    /*
     Materialize collapsible
     Documentation: http://materializecss.com/collapsible.html
     */
    collapsible: function collapsible () {
        $('.collapsible').collapsible();
    },

    /*
     Materialize ыcrollspy
     Documentation: http://materializecss.com/scrollspy.html
     */
    scrollspy: function scrollspy () {
        $('.scrollspy').scrollSpy();
    },

    /*
     Materialize side nav
     Documentation: http://materializecss.com/side-nav.html
     */
    sideNav: function sideNav () {
        $('.button-collapse').sideNav({
            closeOnClick: true
        });
    },

    /*
     Owl gallery
     Documentation: http://www.owlcarousel.owlgraphic.com/docs/started-welcome.html
     */
    owl: function owl () {
        $('.owl-carousel').owlCarousel({
            items: 1,
            dots: true
        });
    },

    /*
     Google map
     Documentation: https://developers.google.com/maps/documentation/javascript/

     Also using Snazzy Maps to style the map
     Documentation: https://snazzymaps.com/about
     */
    map: function map () {
        if ($('#map').length > 0) {
            // Fetching the styles from the config dir
            $.ajax({
                url: './assets/config/' + App.CONFIG.googleMaps.stylesConfigFile,
                type: 'GET'
            }).done(function (mapStyle) {
                // Initializing the styled map
                initMap(mapStyle);
            }).error(function (err) {
                // Initializing the map without styles and letting know why that happened
                console.error('Map style configuration is missing:', err.statusText);
                console.warn('Loading map with default style');
                initMap();
            });
        }

        function initMap (mapStyle) {
            var mapOptions = {
                zoom: App.CONFIG.googleMaps.zoom,
                center: new google.maps.LatLng(App.CONFIG.googleMaps.lat, App.CONFIG.googleMaps.lng),
                scrollwheel: false,
                draggable: App.GLOBAL.isTouch() ? false : true
            };

            if (mapStyle !== 'undefined') {
                mapOptions.styles = mapStyle;
            }

            var mapElement = document.getElementById('map');

            var map = new google.maps.Map(mapElement, mapOptions);

            if (App.CONFIG.googleMaps.marker) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(App.CONFIG.googleMaps.lat, App.CONFIG.googleMaps.lng),
                    map: map,
                    title: App.CONFIG.googleMaps.markerTitle
                });
            }
        }
    },

    /*
     Contact form handling
     @param String suffix helps differentiate between human and classic form modes
     Constricted to human and classic
     */
    contactForm: function contactForm (suffix) {
        var $name = $('#name-' + suffix);
        var $contact = $('#contact-' + suffix);
        var $message = $('#message-' + suffix);
        var $sendButton = $('#send-message-' + suffix);
        var initialMessage = $message.html();

        $sendButton.on('click', function (e) {
            console.log('click');
            e.preventDefault();
            App._sendMessage($name, $contact, $message, initialMessage, $sendButton);
        });
    },

    /*
     A private function that sends the message, once everything is cool
     @param Obj $name the object that contains name value
            Obj $contact the object that contains contact value
            Obj $message the object that contains message value
            String initialMessage initial message value
            Obj $sendButton the button that submits the form
     */
    _sendMessage: function _sendMessage ($name, $contact, $message, initialMessage, $sendButton) {
        // Creating the conditions of the form's validity
        var isNameValid = App._verifyField($name, App.CONFIG.toastMessages.nameMissing);
        var isEmailValid = App._verifyField($contact, App.CONFIG.toastMessages.contactMissing);
        var isMessageValid = App._verifyField($message, App.CONFIG.toastMessages.messageMissing, initialMessage);

        if (isNameValid && isEmailValid && isMessageValid) {
            App.GLOBAL.progress.show();
            // Disabling the button while we're waiting for the response
            $sendButton.attr('disabled', true);
            $.ajax({
                url: '/mailer/mailer.php',
                type: 'POST',
                data: {
                    name: $name.html() || $name.val(),
                    contact: $contact.html() || $contact.val(),
                    message: $message.html() || $message.val()
                }
            }).done(function (res) {
                // res should return 1, if PHPMailer has done its job right
                if (res == true) {
                    Materialize.toast(App.CONFIG.toastMessages.messageSent, App.CONFIG.toastSpeed, 'success');
                    // Resetting the form
                    $name.html('') && $name.val('');
                    $contact.html('') && $contact.val('');
                    $message.html(initialMessage) && $message.val(initialMessage);
                    // Removing active class from label
                    $name.next().removeClass('active');
                    $contact.next().removeClass('active');
                    $message.next().removeClass('active');
                } else {
                    Materialize.toast(App.CONFIG.toastMessages.somethingWrong + res, App.CONFIG.toastSpeed, 'error');
                }
            }).error(function (error) {
                Materialize.toast(App.CONFIG.toastMessages.somethingWrong + error, App.CONFIG.toastSpeed, 'error');
            }).complete(function () {
                App.GLOBAL.progress.hide();
                // Re-enabling the button on request complete
                $sendButton.attr('disabled', false);
            });
        }
    },

    /*
     A private function that handles field verifying
     @param Obj $field the object that contains selected field
            String errorMessage error message relevant to the selected field
            String initialMessage initial message value
     */
    _verifyField: function _verifyField ($field, errorMessage, initialMessage) {
        var fieldValue = $field.html() || $field.val();
        var isFieldInvalid;
        var isFieldLengthInvalid = fieldValue.length === 0;

        if (initialMessage !== 'undefined') {
            isFieldInvalid = isFieldLengthInvalid || (fieldValue === initialMessage);
        } else {
            isFieldInvalid = isFieldLengthInvalid;
        }

        if ($field.attr('type') === 'email' && ! /.+\@.+\..+/.test(fieldValue)) {
            Materialize.toast(App.CONFIG.toastMessages.enterValidEmail, App.CONFIG.toastSpeed, 'error', function () {
                App.GLOBAL.activeToasts--;
            });
            App.GLOBAL.activeToasts++;
            return false;
        }

        if (isFieldInvalid) {
            Materialize.toast(errorMessage, App.CONFIG.toastSpeed, 'error', function () {
                App.GLOBAL.activeToasts--;
            });
            App.GLOBAL.activeToasts++;
            return false;
        } else {
            return true;
        }
    },

    /*
     Mailchimp subscription via Ajax
     Documentation: https://github.com/scdoshi/jquery-ajaxchimp
     */
    ajaxChimp: function ajaxChimp () {
        var mcForm = $('#mc-embedded-subscribe-form');

        mcForm.ajaxChimp({
            url: $(this).attr('action'),
            callback: function (resp) {
                var message = resp.msg;
                var result = resp.result;
                var dissmissTime = result === 'success' ? 10000 : 5000;

                Materialize.toast(message.replace(/\d - /, ''), dissmissTime, result);
                if (result === 'success') {
                    mcForm.find('input[type=email]').val('');
                    mcForm.find('label').removeClass('active');
                }
            }
        });
    },

    /*
     Removing the spinner and its container on load
     */
    loaded: function loaded () {
        var $body = $('body');
        var spinnerContainer = $('.spinner-container');

        // Locking body's scrolling
        $body.addClass('locked');
        $(window).on('load', function () {
            // Unlocking body's scrolling and hiding the spinner
            $body.removeClass('locked');
            spinnerContainer.addClass('hide-spinner');
            setTimeout(function () {
                spinnerContainer.hide();
            }, 400);
        });
    }
};

$(document).ready(function () {
    App.modal();
    App.collapsible();
    App.scrollspy();
    App.sideNav();
    App.owl();
    App.map();

    if ($('#human-form').length) {
        App.contactForm('human');
    } else if ($('#classic-form').length) {
        App.contactForm('classic');
    }

    App.ajaxChimp();
    App.loaded();
});
