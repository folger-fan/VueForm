<template>
    <div>
        <input type="text"
               :name="name"
               :placeholder="placeholder"
               :readonly="readonly"
               :maxlength="maxlength"
               :autofocus="autofocus"
               :value="currentValue"
               ref="input"
               @input="handleInput"
               @focus="handleFocus"
               @blur="handleBlur"
               @keyup.13="confirm"
        >
            <!--新增keyup.13事件, 用于回车触发 roy-2017.03.16-->
    </div>
</template>
<script>
    import emitter from '../mix/emitter';

    export default {
        name: 'VInput',

        componentName: 'VInput',

        mixins: [emitter],

        data() {
            return {
                currentValue: this.value
            };
        },
        props: {
            value: [Number, String],
            placeholder: String,
            size: String,
            readonly: Boolean,
            autofocus: Boolean,
            name: String,
            maxlength: Number,
            validateEvent: {
                type: Boolean,
                default: true
            }
        },

        computed: {
            validating() {
                return this.$parent.validateState === 'validating';
            }
        },

        watch: {
            'value'(val, oldValue) {
                this.setCurrentValue(val);
            }
        },

        methods: {
            handleBlur(event) {
                this.$emit('blur', event);
                if (this.validateEvent) {
                    this.dispatch('VFormItem', 'form.blur');
                }
            },
            handleFocus(event) {
                this.$emit('focus', event);
            },
            handleInput(event) {
                var value = event.target.value;
                this.$emit('input', value);
                this.setCurrentValue(value);
                this.$emit('change', value);
            },
            setCurrentValue(value) {
                if (value === this.currentValue) return;
                this.currentValue = value;
                if (this.validateEvent) {
                    this.dispatch('VFormItem', 'form.change');
                }
            },
            confirm(value) {
//            新增keyup.13事件, 用于回车触发 roy-2017.03.16
                this.$emit('enter', value);
            }
        }
    };
</script>
<style scoped>
    input {
        background-color: #fff;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        display: block;
        font-size: 14px;
        height: 32px;
        line-height: 1;
        outline: none;
        padding: 2px 5px;
        width: 100%;
    }

    input:hover {
        border: 1px solid #49a9ee;
    }

    input::-webkit-input-placeholder {
        font-family: 微软雅黑, Verdana, Geneva, sans-serif;
        color: #999;
        font-size: 14px;
    }

    input[readonly=readonly] {
        background: #f1f2f3;
    }

    input[readonly=readonly]:hover {
        border: 1px solid #bfcbd9;
    }

    .is-error input {
        border-color: #f46e65;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(240, 65, 52, .2);
    }
</style>