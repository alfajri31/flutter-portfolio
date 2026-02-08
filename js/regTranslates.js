
var listKeywordName=[];
$(document).ready(function(){
    $('[id$="-translate-ind"], [id$="-translate-en"]').each(function() {
        // Get the full ID, e.g., 'astra-translate-ind'
        var fullId = $(this).attr('id'); 
        // Extract the company name before '-translate'
        var keywordName = fullId.split('-translate')[0]; 
        // Determine language from the full ID
        var language = fullId.includes('-ind') ? 'ind' : 'en';
        $(this).load('translation/' + language + '/' + keywordName + '.html');
        listKeywordName.push(keywordName);
    });
})

function clickAccordion(id) {
    if($("#"+id+" .fa-chevron-down").hasClass("transformChevronDown")) {
            $("#"+id+" .fa-chevron-down").removeClass("transformChevronDown") 
    }
    else {
            $("#"+id+" .fa-chevron-down").addClass("transformChevronDown") 
    }
}


function changeToEnglish(event) {
    $('[id^="show-"]').each(function() {
        var show = $(this).attr('id');
        listKeywordName.filter(function(result) {
            if(!result) {
                listKeywordName.push(show);
            }
        })
    });

    document.getElementById('show-historyExperience').scrollIntoView({
        behavior: 'smooth'
    });
  
    $("#en").css({
        "color": "grey"
    })
    $("#ind").css({
        "color": "white"
    })
    event.stopPropagation();
    event.listKeyword = listKeywordName;
    for(var i=0;i<=event.listKeyword.length-1;i++) {
        $("#"+event.listKeyword[i]+"-translate-ind").attr("id",event.listKeyword[i]+"-translate-en");
        $("#"+event.listKeyword[i]+"-translate-en").load("translation/en/"+event.listKeyword[i]+".html");
    }
}

function changeToIndonesia(event) {
    $('[id^="show-"]').each(function() {
        var show = $(this).attr('id');
        listKeywordName.filter(function(result) {
            if(!result) {
                listKeywordName.push(show);
            }
        })
    });
    document.getElementById('show-historyExperience').scrollIntoView({
        behavior: 'smooth'
    });
    $("#en").css({
        "color": "white"
    })
    $("#ind").css({
        "color": "grey"
    })
    event.stopPropagation();
    event.listKeyword = listKeywordName;
    console.log(listKeywordName);
    for(var i=0;i<=event.listKeyword.length-1;i++) {
        $("#"+event.listKeyword[i]+"-translate-en").attr("id",event.listKeyword[i]+"-translate-ind");
        $("#"+event.listKeyword[i]+"-translate-ind").load("translation/ind/"+event.listKeyword[i]+".html");
    }
}

