const helper = {
    firstToNum: (context, num, options) => {
        let item = ""
        let iteration = Math.min(context.length, num)
        for (let i = 0; i < iteration; i++){
            item = item + options.fn(context[i])
        }
        return item
    },
    fromNum: (context, num, options) =>{
        let item = ""
        for (let i = num; i < context.length; i++){
            item = item + options.fn(context[i])
        }
        return item
    },
   
}

helper.paginate = require("handlebars-paginate")



module.exports = helper