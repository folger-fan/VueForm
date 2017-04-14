<template>
    <div class="form-item" :class="{
    'is-error': validateState === 'error',
    'is-validating': validateState === 'validating',
    'is-required': isRequired || required
  }">
        <span v-if="label" class="form-label"
              :style="labelStyle">{{label}}:</span>
        <div :style="contentStyle">
            <slot></slot>
            <div class="validate-error-msg" v-if="validateState === 'error' && showMessage && form.showMessage">
                {{validateMessage}}
            </div>
        </div>
    </div>
</template>
<script>
    import emitter from '../mix/emitter'
    import validate from '../../utils/validate'
    module.exports = {
        name: 'VFormItem',
        componentName: 'VFormItem',
        mixins: [emitter],
        props: {
            label: String,
            labelWidth: String,
            prop: String,
            required: Boolean,
            rules: [Object, Array],
            error: String,
            validateStatus: String,
            showMessage: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            error(value) {
                this.validateMessage = value;
                this.validateState = value ? 'error' : '';
            },
            validateStatus(value) {
                this.validateState = value;
            }
        },
        computed: {
            labelStyle() {
                return {
                    width: this.labelWidth || this.form.labelWidth
                };
            },
            contentStyle() {
                return {
                    marginLeft: this.labelWidth || this.form.labelWidth
                };
            },
            form() {
                var parent = this.$parent;
                while (parent.$options.componentName !== 'VForm') {
                    parent = parent.$parent;
                }
                return parent;
            },
            fieldValue: {
                cache: false,
                get() {
                    var model = this.form.model;
                    if (!model || !this.prop) {
                        return;
                    }
                    return model[this.prop];
                }
            }
        },
        data() {
            return {
                validateState: '',
                validateMessage: '',
                validateDisabled: false,
                validator: {},
                isRequired: false
            };
        },
        methods: {
            validate(trigger, callback) {
                var rules = this.getFilteredRule(trigger);
                callback = callback || function () {
                    };
                if (!rules || rules.length === 0) {
                    callback();
                    return true;
                }
                this.validateState = 'validating';
                var descriptor = {};
                descriptor[this.prop] = rules;
                var model = {};
                model[this.prop] = this.fieldValue;
                validate.verify(descriptor, model, function (errors) {
                    this.validateState = errors.length == 0 ? 'success' : 'error';
                    this.validateMessage = errors.length > 0 ? errors[0].message : '';
                    callback(this.validateMessage);
                }.bind(this))
            },
            resetField() {
                if (!this.prop) {
                    return
                }
                this.validateState = '';
                this.validateMessage = '';
                let model = this.form.model;
                model[this.prop] = this.initialValue;
            },
            getRules() {
                var formRules = this.form.rules;
                formRules = formRules ? formRules[this.prop] : [];
                return [].concat(formRules || []);
            },
            getFilteredRule(trigger) {
                var rules = this.getRules();
                return rules.filter(function (rule) {
                    return !rule.trigger || rule.trigger.indexOf(trigger) !== -1;
                })
            },
            onFieldBlur() {
                this.validate('blur');
            },
            onFieldChange() {
                this.validate('change');
            }
        },
        mounted() {
            if (this.prop) {
                this.dispatch('VForm', 'form.addField', [this]);

                Object.defineProperty(this, 'initialValue', {
                    value: this.fieldValue
                });
                let rules = this.getRules();
                if (rules.length) {
                    rules.every(function (rule) {
                        if (rule.required) {
                            this.isRequired = true;
                            return false;
                        }
                    }.bind(this));
                    this.$on('form.blur', this.onFieldBlur);
                    this.$on('form.change', this.onFieldChange);
                }
            }
        },
        beforeDestroy() {
            this.dispatch('VForm', 'form.removeField', [this]);
        }
    }
</script>
<style scoped>
    .form-item {
        position: relative;
        margin-bottom: 22px;
        padding-top: 3px;
    }

    .form-label {
        position: absolute;
        top: 0;
        left: 0;
        text-align: right;
        padding: 11px 12px 11px 0;
        vertical-align: middle;
        line-height: 1;
        box-sizing: border-box;
        color: #333;
    }

    .is-required .form-label:before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
    }

    .validate-error-msg {
        color: #ff4949;
        font-size: 12px;
        line-height: 1;
        position: absolute;
        z-index: 10;
        padding-top: 4px;
        padding-left: 6px;
        white-space: nowrap;
    }
</style>