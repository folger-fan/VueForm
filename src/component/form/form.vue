<template>
    <form class="v-form">
        <slot></slot>
    </form>
</template>
<script>
    export default {
        name: 'VForm',
        componentName: 'VForm',
        props: {
            model: Object,
            rules: Object,
            labelWidth: {
                type:String,
                default:80
            },
            showMessage: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                fields: []
            };
        },
        created() {
            this.$on('form.addField', function (field) {
                if (field) {
                    this.fields.push(field);
                }
            });
            this.$on('form.removeField', function (field) {
                if (field.prop) {
                    this.fields.splice(this.fields.indexOf(field), 1);
                }
            });
        },
        methods: {
            resetFields() {
                this.fields.forEach(function (field) {
                    field.resetField();
                });
                
            },
            validate(callback) {
                let valid = true;
                let count = 0;
                this.fields.forEach(function (field, index) {
                    field.validate('', function (errors) {
                        if (errors) {
                            valid = false;
                        }
                        if (typeof callback === 'function' && ++count === this.fields.length
                        ) {
                            callback(valid,this.model);
                        }
                    }.bind(this))
                }.bind(this))
            },
            validateField(prop, cb) {
                var field = this.fields.filter(function (field) {
                            field.prop === prop
                        }
                )[0];
                if (!field) {
                    throw new Error(`字段${prop}未配置rule`);
                }
                field.validate('', cb);
            }
        }
    };
</script>
