import { append_all, fetch_json } from "./fn.js";
import { TableMakerBuilder } from "./tableBuilder.js";

const urlList = [
    "./data/tbl-1.json",
    "./data/tbl-2.json"
];

init();

async function init(){
    const $$wrap = document.getElementsByClassName('wrapper');
    const data1 = await fetch_json(urlList[0]).then(json=>json.main);
    const data2 = await fetch_json(urlList[1]).then(json=>json.main);

    const $tbl_1 = new TableMakerBuilder()
    .get_data(data1)
    .set_table_class('tbl-read')
    .set_colgroup(["15%","15%","15%",null])
    .set_class_thtd([
        {row:true, col:[0,1,2], clss:["f_center"]}
    ])
    .set_class_tr([{
        row:0, clss:["on"]
    }])
    .set_thead_row(1)
    .has_total(true)
    .init();

    const $tbl_2 = new TableMakerBuilder()
    .get_data(data2)
    .set_table_class('tbl-read')
    .set_colgroup(["24%",null,"24%",null])
    .set_tbody_th([{
        row: true,
        col : [0,2]
    }])
    .set_class_thtd([
        {row:[4], col:[1], clss:["data-unit-m"]},
        {row:[4,10,12,14,15,16], col:[3], clss:["data-unit-m2"]},
        {row:[5], col:[1,3], clss:["data-unit-m2"]},
        {row:[7], col:[1], clss:["data-unit-m2"]},
        {row:[6], col:[1,3], clss:["data-unit-percent"]},
        {row:[14,15,16], col:[1], clss:["data-unit-dasu"]},

    ])
    .init();

    append_all($$wrap[0], $tbl_1);
    append_all($$wrap[1], $tbl_2);
}//init