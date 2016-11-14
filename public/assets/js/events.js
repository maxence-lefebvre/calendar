'use strict';

// module pattern
(function (jQuery) {

    // onload alias
    jQuery($bindSendFileButton);

    // jquery init function
    function $bindSendFileButton() {
        jQuery('#sendFile').on('submit', handleSendFile);
    }

    ////

    function handleSendFile(event) {
        event.preventDefault();
        var formData = new FormData();
        var file     = jQuery('#file').get(0).files[0];
        formData.append('file', file);
        jQuery.ajax({
            type: 'POST',
            url: '/calendarEvent',
            data: formData,
            cache: false,
            contentType: false,
            processData: false
        }).then((res) => {
            console.log('done');
        }).catch((err) => {
            console.error(err);
        });
    }

}(jQuery));