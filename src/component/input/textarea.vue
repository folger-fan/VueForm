<template>
    <div>
        <textarea
                :name="name"
                :placeholder="placeholder"
                :readonly="readonly"
                :rows="rows"
                :maxlength="maxlength"
                :minlength="minlength"
                :autofocus="autofocus"
                :value="currentValue"
                ref="textarea"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
        ></textarea>
    </div>
</template>
<script>
    import emitter from '../mix/emitter';

    export default {
        name: 'VTextarea',
        componentName: 'VTextarea',
        mixins: [emitter],
        data() {
            return {
                currentValue: this.value
            };
        },
        props: {
            value: [String],
            placeholder: String,
            size: String,
            readonly: Boolean,
            autofocus: Boolean,
            name: String,
            maxlength: Number,
            minlength: Number,
            validateEvent: {
                type: Boolean,
                default: true
            },
            rows: {
                type: Number,
                default: 3
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
            }
        },
        created() {
        },
        mounted() {
        }
    };
</script>
<style scoped>
    textarea {
        -webkit-appearance: none;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        display: block;
        font-size: 14px;
        line-height: 1.5;
        outline: none;
        padding: 2px 5px;
        width: 100%;
    }

    textarea:hover {
        border: 1px solid #49a9ee;
    }

    textarea::-webkit-input-placeholder {
        font-family: 微软雅黑, Verdana, Geneva, sans-serif;
        color: #999;
        font-size: 14px;
    }

    textarea[readonly=readonly] {
        background: #f1f2f3;
    }

    textarea[readonly=readonly]:hover {
        border: 1px solid #bfcbd9;
    }

    .is-error textarea {
        border-color: #f46e65;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(240, 65, 52, .2);
    }
</style>