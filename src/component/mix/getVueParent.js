/**
 * Created by folgerfan on 2017/2/27.
 */
module.exports = {
    methods:{
        getParentByComponentName(componentName){
            var parent = this.$parent || this.$root;
            var name = parent.$options.componentName;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.componentName;
                }
            }
            return parent
        }
    }

};