const helper = {
    firstToNum: (context, num, options) => {
        let item = ""
        for (let i = 0; i < num; i++){
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
    }
}


module.exports = helper