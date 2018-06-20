$(document).ready(function(){

    var promise = $.getJSON( '/' + TRUELAB.lang + '/labels/validator');

    promise.done(function(labels){
        setValidatorLabels(labels);
        addValidationMethods(labels);
        validateContactForm();
    });

    function setValidatorLabels(labels){
        jQuery.extend(jQuery.validator.messages, {
            required: labels['validator.required'],
            remote: labels['validator.remote'],
            email: labels['validator.email'],
            url: labels['validator.url'],
            date: labels['validator.date'],
            dateISO: labels['validator.dateISO'],
            number: labels['validator.number'],
            digits: labels['validator.digits'],
            creditcard: labels['validator.creditcard'],
            equalTo: labels['validator.equalTo'],
            accept: labels['validator.accept'],
            maxlength: jQuery.validator.format(labels['validator.maxlength']),
            minlength: jQuery.validator.format(labels['validator.minlength']),
            rangelength: jQuery.validator.format(labels['validator.rangelength']),
            range: jQuery.validator.format(labels['validator.range']),
            max: jQuery.validator.format(labels['validator.max']),
            min: jQuery.validator.format(labels['validator.min'])
        });
    }

    function addValidationMethods(labels){
        $.validator.addMethod("phone", function(value, element) {
            return this.optional(element) || /^[0-9 \+]{8,17}$/.test(value);
        }, labels['validator.phone']);
    }

    function validateContactForm(){
        $('#contact-form form').validate({
            'rules': {
                'contact[firstName]': {
                    required: true
                },
                'contact[lastName]': {
                    required: true
                },
                'contact[phone]': {
                    required: false,
                    phone: true
                },
                'contact[email]': {
                    required: true,
                    email: true
                },
                'contact[message]': {
                    required: false
                }
            }
        });
    }

});