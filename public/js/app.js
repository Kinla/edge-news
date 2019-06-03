$(document).ready(()=>{
    //init some MDB JS
    new WOW().init();

    //Post notes to articles    
    $("#submitComment").on("click", function (e){
        e.preventDefault()
        let id = $(this).attr("data-id")

        let comment = {
            name: $("#name").val(),
            body: $("#comment").val()
        }
    
        if (isValid(comment)){
            $.post("/articles/"+id, comment, (data) =>{
                console.log(`${data} posted to server`)
                location.reload()
            })
        }

        $("#name").val("")
        $("#comment").val("")
    })

    //Check valid
    const isValid = (data) => {
        let valid = true
        let dataValues = Object.values(data)
        for(var i = 0; i < dataValues.length; i++){
          if (dataValues[i] === ""){
            valid = false
          }
        }
        return valid
      };

    //Save article
    $(".saveArticle").on("click", function(e){
        e.preventDefault()

        let id = $(this).attr("data-id")

        $.post("/saved/"+id, {id: id}, (data)=>{
            console.log(`${data} saved`)
            location.reload()
        })
    })

    //Unsave article
    $(".unsave").on("click", function (e){
        e.preventDefault()

        let id = $(this).attr("data-id")

        $.post("/unsave/"+id, id, (data) =>{
            console.log(`${data} posted to server`)
            location.reload()      
        })
    })
    
    //Remove specific entry
    $("#removeItem").on("submit", function (e){
        event.preventDefault()
        let id = $("#selectedIdForRemoval").val()
        let collection = $("input[name=collection]:checked").val()

        let data = {
            id: id,
            collection: collection
        }
        let valid = isValid(data)

        if (isValid(data)){
            $.post("/removeDoc", data, (success) =>{
                $("#selectedIdForRemoval").val("")
                $('input[name=collection]').attr('checked', false);
                alert(success)
            })
        }

    })
})