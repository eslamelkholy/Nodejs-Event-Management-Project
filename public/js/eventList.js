function deleteEvent(mySpeakerId,obj)
{
    $.ajax({
        url:"http://localhost:8080/event/delete",
        method:"post",
        dataType:"json",
        contentType : "application/json",
        data : JSON.stringify({speakerId : mySpeakerId}),
        success:function(data){
            $(obj).parents("tr").remove();
        },
        error:function(error){
            console.log(error);
        }
    })
}
function cancelEvent(_speakerId,_eventId,_isMainSpeaker,obj)
{
    $.ajax({
        url:"http://localhost:8080/event/cancel",
        method:"post",
        dataType:"json",
        contentType:"application/json",
        data : JSON.stringify({speakerId : _speakerId, eventId: _eventId, isMainSpeaker : _isMainSpeaker}),
        success:function(data){
            $(obj).parents("tr").remove();
        },
        error:function(error){
            console.log(error);
        }
    });
}
function deleteOtherSpeaker(obj){
    $("#otherSpeaker option").each(function(){
        $(this).show();
    });
    $("#otherSpeaker").find("option[value='" + obj.value + "']").hide();
}