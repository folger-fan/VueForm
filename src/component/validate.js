/**
 * Created by folgerfan on 2017/3/6.
 */
var ruleMap = {
    /**暂时不考虑负数情况，负数另外单独写规则*/
    'integer': {
        test: /^\d*$/,
        message: '请输入整数'
    },
    'int': {
        test: /^\d*$/,
        message: '请输入整数'
    },
    'number': {
        test: /^\d+(.\d+)?$/,
        message: '请输入数字'
    },
    'array': {
        test(value, model, cb){
            cb(Array.isArray(value));
        },
        message: '该字段为数组'
    },
    'url': {
        test(value, model, cb){
            var regex = new RegExp("^((https?|ftp|file)://)?([-A-Za-z0-9]+\\.){1,5}[a-zA-Z]{2,5}[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$", "gi");
            cb(regex.test(value))
        },
        message: '请输入Url'
    }
};
function isFunction(func) {
    return (typeof func) === 'function'
}
function isArray(arr) {
    return arr instanceof Array
}
module.exports = {
    addRule(map){
        ruleMap = Object.assign(ruleMap, map);
    },
    verify(rules, model, cb){
        if (!rules || !model || !cb) {
            console.error(rules, model, cb);
            throw new Error('请检查验证参数')
        }
        var errors = [], needNum = 0, checkedNum = 0;

        function afterCheckRule() {
            checkedNum++;
            if (checkedNum >= needNum) {
                cb(errors)
            }
        }
        for (var ruleName in rules) {
            var ruleItem = rules[ruleName];
            var value = model[ruleName];
            if (!ruleItem) {
                console.error(ruleName, ruleItem);
                throw new Error('请检查验证规则')
            }
            if (!isArray(ruleItem)) {
                ruleItem = [ruleItem]
            }
            ruleItem.forEach(function ({test, required, message}) {
                needNum++;
                if (required && !value) {
                    errors.push(new Error(message || '该字段为必输项'));
                    afterCheckRule();
                    return
                }
                if (!test) {
                    afterCheckRule();
                    return
                }
                if (isFunction(test)) {//业务自定义的test函数
                    test(value, model, function (isPass) {
                        if (!isPass) {
                            errors.push(new Error(message))
                        }
                        afterCheckRule();
                    })
                } else if (isFunction(test.test)) {//业务自定义的正则表达式
                    if (!test.test(value)) {
                        errors.push(new Error(message))
                    }
                    afterCheckRule();
                } else {//系统配置的处理规则名字
                    var matchedRule = ruleMap[test];
                    if(!matchedRule){
                        throw new Error('不存在的验证规则:'+test)
                    }
                    message = message||matchedRule.message;
                    if (isFunction(matchedRule.test)) {
                        matchedRule.test(value, model, function (isPass) {
                            if (!isPass) {
                                errors.push(new Error(message || matchedRule.message))
                            }
                            afterCheckRule();
                        })
                    } else {
                        if (!matchedRule.test.test(value)) {
                            errors.push(new Error(message))
                        }
                        afterCheckRule();
                    }
                }
            })
        }
    }
};