 var retryCount = 3;
    $(document).ready(function() {
        getRSSFeed();
    });

    function getRSSFeed() {
        $.getJSON("./rssfeed", function(data) {
            if (data.error) {
                console.log("Error Loading RSS feed");
                retryCount--;
                if (retryCount > 0) {
                    setTimeout(getRSSFeed, 1000);
                    return;
                } else {
                    location.reload();
                }
            } else {
                $.each(data.items, function() {
                    var imgURL = $(this)[0]["media:content"].url;
                    var linkURL = $(this)[0]["link"];
                    var title = $(this)[0]["title"];
                    $(".grid").append("<div class='athumb'><div class='crop'><a href='" + linkURL + "?xrs=_s.photoGrid' target='_blank'><img src='" + imgURL + "' alt='" + title + "'></a></div></div>");
                });
                $(".loader").remove();
                $(".grid").fadeIn("fast");
            }
        })
    }