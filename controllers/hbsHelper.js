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
    firstToNum: (context, num, options) => {
        let item = ""
        for (let i = 0; i < num-1; i++){
            item = item + options.fn(context[i])
        }
        return item
    },
    fromNum: (context, num, options) =>{
        let item = ""
        for (let i = num-1; i < context.length; i++){
            item = item + options.fn(context[i])
        }
        return item
    }
}


module.exports = helper