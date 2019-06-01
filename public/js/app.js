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
                window.location = data.redirect
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
    $("#saveArticle").on("click", function(e){
        e.preventDefault()

        let id = $(this).attr("data-id")

        $.post("/saved/"+id, {id: id}, (data)=>{
            console.log(`${data} saved`)
    })
    })

})