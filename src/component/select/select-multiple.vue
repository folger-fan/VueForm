/**
* Created by folgerfan on 2017/2/28.
*/
<template>
    <div class="select-wrapper" @click.prevent.stop>
        <div class="select-tag-wrapper" @click="selectOpen" ref="selectTagWrapper" :readonly="readonly">
            <ul v-if="currentValue.length>0">
                <li class="select-tag" v-for="(item,index) in currentValue">{{item}},{{index}}
                    <span class="close-tag" @click.prevent.stop="removeTag(index)">&times;</span>
                </li>
            </ul>
            <div v-else class="placeholder">
                {{placeholder}}
            </div>
        </div>
        <div v-if="optionTop" class="option-wrapper" :class="{cascade:cascadeLevel>1}"
             :style="{top:optionTop+'px',minWidth:optionWrapperWidth+'px'}">
            <ul v-for="(list,index) in cascadeList" class="option-list">
                <li v-for="item in list" class="option"
                    :class="{chose:currentValue.indexOf(item.value)>-1,active:cascadeValue[index]==item.value}"
                    @click="chooseOption(item.value,index)">{{item.value}},{{item.label}}
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import emitter from '../mix/emitter';
    var activeInstance;
    $(document).click(function () {
        activeInstance && activeInstance.$options.methods.closeOptions.call(activeInstance);
    });
    /**
     * 多重级联选择器，需要指定 cascadeLevel 深度,options中用children表示下一级列表s
     * @type {{data: (function()), props: {options: {type: Array}, cascadeLevel: {type: Number}}, methods: {closeOptions: (function()), chooseOption: (function(*=, *)), selectOpen: (function()), removeTag: (function(*))}}}
     */
    export default {
        name: 'VSelectMultiple',
        componentName: 'VSelectMultiple',
        mixins: [emitter],
        data(){
            return {
                currentValue: this.value,
                optionTop: 0,
                optionWrapperWidth: 0,
                cascadeValue: [],
                cascadeList: [this.options]
            }
        },
        props: {
            readonly: Boolean,
            options: {
                type: Array
            },
            cascadeLevel: {
                type: Number
            },
            value:{
                type:Array,
                default:[]
            },
            placeholder:{
                type:String,
                default:''
            },
            validateEvent:{
                type:Boolean,
                default:true
            }
        },
        watch: {
            'value'(val, oldValue) {
                this.setCurrentValue(val);
            }
        },
        methods: {
            setCurrentValue(value) {
                if (value === this.currentValue) return;
                this.currentValue = value;
                this.$emit('input', this.currentValue);
                this.$emit('change', this.currentValue);
                if (this.validateEvent) {
                    this.dispatch('VFormItem', 'form.change');
                }
            },
            closeOptions(){
                this.optionTop = 0;
                activeInstance = null;
                this.$emit('input', this.currentValue);
                this.$emit('change', this.currentValue);
                if (this.validateEvent) {
                    this.dispatch('VFormItem', 'form.change');
                }
            },
            chooseOption(value, index){

                if (index + 1 == this.cascadeLevel) {//最后一层
                    var newValue = [], isContain = false;
                    for (var i = 0; i < this.currentValue.length; i++) {
                        if (this.currentValue[i] == value) {
                            isContain = true
                        } else {
                            newValue.push(this.currentValue[i])
                        }
                    }
                    if (!isContain) {
                        newValue.push(value)
                    }
                    this.setCurrentValue(newValue);
                    if (this.optionTop) {
                        setTimeout(function () {
                            this.selectOpen()
                        }.bind(this), 10)
                    }
                }

                var newCascadeValue = [];
                for (var i = 0; i < index; i++) {
                    newCascadeValue.push(this.cascadeValue[i])
                }
                if (index + 1 < this.cascadeLevel) {
                    newCascadeValue[index] = value;
                }

                this.cascadeValue = newCascadeValue;
                var list = this.cascadeList, newList = [list[0]];
                for (var i = 0; i < this.cascadeValue.length; i++) {
                    var currentValue = this.cascadeValue[i];
                    for (var j = 0; j < list[i].length; j++) {
                        if (list[i][j].value == currentValue && list[i][j].children) {
                            newList[i + 1] = list[i][j].children
                        }
                    }
                }
                this.cascadeList = newList;
            },

            removeTag(index){
                if(this.readonly){
                    return
                }
                var list = [];
                for (var i = 0; i < this.currentValue.length; i++) {
                    if (i == index) {
                        continue
                    }
                    list.push(this.currentValue[i])
                }
                this.setCurrentValue(list);
                if (this.optionTop) {
                    setTimeout(function () {
                        this.selectOpen()
                    }.bind(this), 10)
                }
            },
            selectOpen(){
                if(this.readonly){
                    return
                }
                var $wrapper = $(this.$refs['selectTagWrapper']);
                this.optionTop = $wrapper.height() + 6;
                this.optionWrapperWidth = $wrapper.width()+4;
                activeInstance = this;
            }
        }
    }
</script>
<style scoped>
    .select-wrapper {
        width: 100%;

        /*max-width: 300px;*/
        /*margin: 3px 5px;*/
    }

    ul {
        list-style: none;
        color: #333;
        display: inline-block;
    }

    .select-tag-wrapper {
        min-height: 34px;
        border: 1px solid #bfcbd9;
        background-color: #fff;
        box-sizing: border-box;
        padding:2px;
    }

    .select-tag-wrapper:hover {
        border: 1px solid #49a9ee;
    }

    .select-tag-wrapper[readonly=readonly]{
        background: #f1f2f3;
    }
    .select-tag-wrapper[readonly=readonly]:hover{
        border: 1px solid #bfcbd9;
    }

    .is-error .select-tag-wrapper {
        border-color: #f46e65;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(240, 65, 52, .2);
    }

    .select-tag-wrapper li.select-tag {
        display: inline-block;
        padding: 0 4px;
        background: #f1f2f3;
        border: 1px solid #ddd;
        line-height: 16px;
        height: 20px;
        font-size: 12px;
        margin: 4px;
    }

    .select-tag-wrapper li.select-tag .close-tag {
        display: inline-block;
        font-size: 16px;
        cursor: pointer;
        color: #777;
        margin-left: 5px;
    }

    .select-wrapper {
        position: relative;
    }

    .option-wrapper {
        position: absolute;
        border: 1px solid #bfcbd9;
        z-index: 100;
        padding: 0;
        overflow-y: auto;
        white-space: nowrap;
        background-color: #fff;
    }

    .option-list {
        display: inline-block;
        padding: 0;
        overflow-x: auto;
        width: 100%
    }

    .cascade .option-list {
        width: auto;
        min-width: 111px;
    }

    .option-wrapper .option {
        position: relative;
        display: block;
        padding: 7px 16px;
        font-weight: 400;
        color: rgba(0, 0, 0, .65);
        white-space: nowrap;
        cursor: pointer;
        overflow: hidden;
        transition: background .3s ease;
    }

    .option-wrapper .option:hover {
        background-color: #e4e8f1;
    }

    .option-wrapper .chose {
        color: #20a0ff;
        font-weight: bold;
    }

    .option-wrapper .active {
        background: #e0e0e0;
    }
    .placeholder{
        height:26px;
        line-height: 26px;
        padding:0 2px;
        font-family:微软雅黑,Verdana,Geneva,sans-serif;
        color:#999;
        font-size: 14px;
    }
</style>