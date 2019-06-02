// Handlebars.registerHelper('if', function(conditional, options) {
//     if(conditional) {
//       return options.fn(this);
//     } else {
//       return options.inverse(this);
//     }
//   });


// Handlebars.registerHelper('listItem', function (from, to, context, options){
//     var item = "";
//     for (var i = from, j = to; i < j; i++) {
//         item = item + options.fn(context[i]);
//     }
//     return item;
// });  

const helper = {
    ifFirstThree: (context, options) => {
        let item = ""
        for (let i = 0; i < 3; i++){
            item = item + options.fn(context[i])
        }
        return item
    },
    fromFourth: (context, options) =>{
        let item = ""
        for (let i = 3; i < context.length; i++){
            item = item + options.fn(context[i])
        }
        return item
    }
}


module.exports = helper