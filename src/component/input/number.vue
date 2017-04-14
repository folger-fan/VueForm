<template>
    <div>
        <input type="text"
               :name="name"
               :placeholder="placeholder"
               :readonly="readonly"
               :maxlength="maxlength"
               :minlength="minlength"
               :autofocus="autofocus"
               :value="currentValue"
               ref="input"
               @input="handleInput"
               @focus="handleFocus"
               @blur="handleBlur"
               onkeyup="value=value.replace(/[^\d]/g,'')"
               onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\d]/g, ''))"
        >
    </div>
</template>
<script>
    import emitter from '../mix/emitter';
    /**
     * 一般情况下 input的input事件中可以更改value，直接控制input的显示
     * 这里input中，如果将非数字过滤掉，可能value一直不会改变,不会出发vue更新，但input中显示的值还是输入后的，上面onkeyup的处理是必须的
     */
    export default {
        name: 'VInputNum',
        componentName: 'VInputNum',
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
            minlength: Number,
            max: Number,
            min: Number,
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
                value = value.replace(/[^\d]/g, '');//这里对更改外围form中的数据有效，对自己没效，因为每次过滤后value值没发生变化不会出发input的显示更新
                this.setCurrentValue(value);
            },
            setCurrentValue(value) {
                this.$emit('input', value);
                this.$emit('change', value);
                if (value === this.currentValue) return;
                this.currentValue = value;
                if (this.validateEvent) {
                    this.dispatch('VFormItem', 'form.change');
                }
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