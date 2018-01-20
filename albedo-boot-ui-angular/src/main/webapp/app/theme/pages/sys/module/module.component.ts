import {AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ScriptLoaderService} from "../../../../shared/base/service/script-loader.service";
import {CTX, DATA_STATUS} from "../../../../app.constants";
import {ActivatedRoute} from "@angular/router";
import {Principal} from "../../../../auth/_services/principal.service";

declare let datatable: any;
@Component({
    selector: ".sys-module-list.page-list",
    templateUrl: "./module.component.html",
    encapsulation: ViewEncapsulation.None,
})
export class ModuleComponent implements OnInit,OnDestroy, AfterViewInit {


    ctx: any;
    routerSub: any;
    nodeId: any;
    constructor(private _script: ScriptLoaderService,
                private principal: Principal,
        private router: ActivatedRoute) {
        this.ctx = CTX;
        this.nodeId = albedo.getUserCookie("tree_module_select_node_id"), this.nodeId = (this.nodeId) ? this.nodeId : 1;
    }



    ngOnInit() {
        this.routerSub = this.router.url.subscribe((urlSegment) => {
            // console.log(urlSegment)
        });
    }

    ngOnDestroy() {
        this.routerSub.unsubscribe();
    }

    ngAfterViewInit() {
        // this._script.load('.sys-module-list',
        //     'assets/demo/default/custom/components/datatables/base/data-ajax.js');
        this.initTable()
        // Helpers.setBreadcrumbs();
    }

    initTable() {
        var thisPrincipal = this.principal;
        var options = {
            data: {
                source: {
                    read: {
                        // sample GET method
                        method: 'GET',
                        url: CTX + '/sys/module/',
                    },
                },
                pageSize: 10,
            },
            // columns definition
            columns: [{
                    field: 'name',
                    title: '名称',
                    sortable: 'asc',
                }, {
                    field: 'type',
                    title: '类型',
                }, {
                    field: 'permission',
                    title: '权限',
                }, {
                    field: 'requestMethod',
                    title: '请求方法',
                }, {
                    field: 'url',
                    title: '链接',
                }, {
                    field: 'sort',
                    title: '序号',
                }, {
                    field: 'status',
                    title: '状态',
                    // callback function support for column rendering
                    template: function(row) {
                        return '<span class="m-badge ' + DATA_STATUS[row.status].class + ' m-badge--wide">' + row.status + '</span>';
                    },
                }, {
                    field: 'lastModifiedDate',
                    title: '修改时间',
                }, {
                    field: 'Actions',
                    width: 110,
                    title: '操作',
                    sortable: false,
                    overflow: 'visible',
                    template: function(row) {
                        var template = '';
                        if (thisPrincipal.hasAuthority("sys_module_edit"))
                            template += '<a href="#/sys/module/form/' + row.id + '" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="编辑">\
                                \<i class="la la-edit"></i>\
                                \</a>';
                        if (thisPrincipal.hasAuthority("sys_module_lock"))
                            template += '<a href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-warning m-btn--icon m-btn--icon-only m-btn--pill confirm" title="' + (row.status == "正常" ? "锁定" : "解锁") + '模块"\
						 data-table-id="#data-table-module" data-method="put"  data-title="你确认要操作【' + row.name + '】模块吗？" data-url="' + CTX + '/sys/module/' + row.id + '">\
                                \<i class="la la-'+ (row.status == "正常" ? "unlock-alt" : "unlock") + '"></i>\
                                \</a>';
                        if (thisPrincipal.hasAuthority("sys_module_delete"))
                            template += '<a  href="javascript:void(0)" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill confirm" title="删除"\
                                   data-table-id="#data-table-module" data-method="delete"  data-title="你确认要删除【' + row.name + '】模块吗？" data-url="'+ CTX +'/sys/module/'+ row.id+ '">\
                                \<i class="la la-trash"></i>\
                                \</a>';
                        return template;
                    },
                }],
        };

        albedoList.initTable($('#data-table-module'), $('#table-form-search-module'), options);
        albedoList.init();
        albedoForm.initTree();
    }

    cancelClickNodeModule(event, treeId, treeNode) {
        // console.log(event)
        albedo.setUserCookie("tree_module_select_node_id", '');
        $("#parentId").val('');
        $(".filter-submit-table-module").trigger("click");
    }
    refreshTreeModule(re) {
        $(".tree-refresh").trigger("click");
    }
    clickTreeNodeModule(event, treeId, treeNode) {
        // console.log(event)
        var addUrl = $("#add-module").attr("data-url-temp");
        if (addUrl) $("#add-module").attr("data-url", addUrl + (addUrl.indexOf("?") == -1 ? "?" : "&") + "parentId=" + treeNode.id);
        this.nodeId = treeNode.id;
        albedo.setUserCookie("tree_module_select_node_id", this.nodeId);
        $("#parentId").val(treeNode.id);
        $(".filter-submit-table-module").trigger("click");
    }

}