import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/add';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/eq';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/prependTo';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeClass';
import { isUndefined } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import '../../global/mutation';
class Table {
    constructor(selector) {
        /**
         * 表头 tr 元素
         */
        this.$thRow = $();
        /**
         * 表格 body 中的 tr 元素
         */
        this.$tdRows = $();
        /**
         * 表头的 checkbox 元素
         */
        this.$thCheckbox = $();
        /**
         * 表格 body 中的 checkbox 元素
         */
        this.$tdCheckboxs = $();
        /**
         * 表格行是否可选择
         */
        this.selectable = false;
        /**
         * 已选中的行数
         */
        this.selectedRow = 0;
        this.$element = $(selector).first();
        this.init();
    }
    /**
     * 初始化表格
     */
    init() {
        this.$thRow = this.$element.find('thead tr');
        this.$tdRows = this.$element.find('tbody tr');
        this.selectable = this.$element.hasClass('mdui-table-selectable');
        this.updateThCheckbox();
        this.updateTdCheckbox();
        this.updateNumericCol();
    }
    /**
     * 生成 checkbox 的 HTML 结构
     * @param tag 标签名
     */
    createCheckboxHTML(tag) {
        return (`<${tag} class="mdui-table-cell-checkbox">` +
            '<label class="mdui-checkbox">' +
            '<input type="checkbox"/>' +
            '<i class="mdui-checkbox-icon"></i>' +
            '</label>' +
            `</${tag}>`);
    }
    /**
     * 更新表头 checkbox 的状态
     */
    updateThCheckboxStatus() {
        const checkbox = this.$thCheckbox[0];
        const selectedRow = this.selectedRow;
        const tdRowsLength = this.$tdRows.length;
        checkbox.checked = selectedRow === tdRowsLength;
        checkbox.indeterminate = !!selectedRow && selectedRow !== tdRowsLength;
    }
    /**
     * 更新表格行的 checkbox
     */
    updateTdCheckbox() {
        const rowSelectedClass = 'mdui-table-row-selected';
        this.$tdRows.each((_, row) => {
            const $row = $(row);
            // 移除旧的 checkbox
            $row.find('.mdui-table-cell-checkbox').remove();
            if (!this.selectable) {
                return;
            }
            // 创建 DOM
            const $checkbox = $(this.createCheckboxHTML('td'))
                .prependTo($row)
                .find('input[type="checkbox"]');
            // 默认选中的行
            if ($row.hasClass(rowSelectedClass)) {
                $checkbox[0].checked = true;
                this.selectedRow++;
            }
            this.updateThCheckboxStatus();
            // 绑定事件
            $checkbox.on('change', () => {
                if ($checkbox[0].checked) {
                    $row.addClass(rowSelectedClass);
                    this.selectedRow++;
                }
                else {
                    $row.removeClass(rowSelectedClass);
                    this.selectedRow--;
                }
                this.updateThCheckboxStatus();
            });
            this.$tdCheckboxs = this.$tdCheckboxs.add($checkbox);
        });
    }
    /**
     * 更新表头的 checkbox
     */
    updateThCheckbox() {
        // 移除旧的 checkbox
        this.$thRow.find('.mdui-table-cell-checkbox').remove();
        if (!this.selectable) {
            return;
        }
        this.$thCheckbox = $(this.createCheckboxHTML('th'))
            .prependTo(this.$thRow)
            .find('input[type="checkbox"]')
            .on('change', () => {
            const isCheckedAll = this.$thCheckbox[0].checked;
            this.selectedRow = isCheckedAll ? this.$tdRows.length : 0;
            this.$tdCheckboxs.each((_, checkbox) => {
                checkbox.checked = isCheckedAll;
            });
            this.$tdRows.each((_, row) => {
                isCheckedAll
                    ? $(row).addClass('mdui-table-row-selected')
                    : $(row).removeClass('mdui-table-row-selected');
            });
        });
    }
    /**
     * 更新数值列
     */
    updateNumericCol() {
        const numericClass = 'mdui-table-col-numeric';
        this.$thRow.find('th').each((i, th) => {
            const isNumericCol = $(th).hasClass(numericClass);
            this.$tdRows.each((_, row) => {
                const $td = $(row).find('td').eq(i);
                isNumericCol
                    ? $td.addClass(numericClass)
                    : $td.removeClass(numericClass);
            });
        });
    }
}
const dataName = '_mdui_table';
$(() => {
    mdui.mutation('.mdui-table', function () {
        const $element = $(this);
        if (!$element.data(dataName)) {
            $element.data(dataName, new Table($element));
        }
    });
});
mdui.updateTables = function (selector) {
    const $elements = isUndefined(selector) ? $('.mdui-table') : $(selector);
    $elements.each((_, element) => {
        const $element = $(element);
        const instance = $element.data(dataName);
        if (instance) {
            instance.init();
        }
        else {
            $element.data(dataName, new Table($element));
        }
    });
};
