<template>
    <div>
        <select
                :name="name"
                :disabled="disabled"
                :readonly="readonly"
                :value="currentValue"
                ref="select"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
        >
            <option v-for="item in options" :value="item.value">{{item.label}}</option>
        </select>
    </div>
</template>
<script>
    import emitter from '../mix/emitter';

    export default {
        name: 'VSelect',

        componentName: 'VSelect',

        mixins: [emitter],

        data() {
            return {
                currentValue: this.value
            };
        },
        props: {
            value: [String, Number],
            options: Array,
            readonly: Boolean,
            disabled: Boolean,
            autofocus: Boolean,
            name: String,
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
            handleChange(event) {
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
    select {
        /*-webkit-appearance: none;*/
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

    option {
        color: #1f2d3d;
        padding: 2px 5px;
        font-size: 14px;
    }

    select:hover {
        border: 1px solid #49a9ee;
    }

    select[disabled=disabled]{
        background: #f1f2f3;
    }
    select[disabled=disabled]:hover{
        border: 1px solid #bfcbd9;
    }

    .is-error select {
        border-color: #f46e65;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(240, 65, 52, .2);
    }
</style>