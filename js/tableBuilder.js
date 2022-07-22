import { dom_maker } from "./fn.js";

/* Table Builder */
export class TableMakerBuilder{
    get_data(data){
        this.data= data; 
        return this;}
    
    set_table_class(tableClass){
        this.tableClass = tableClass;
        return this;}

    set_colgroup(colG){
        this.colG = colG;
        return this;}

    set_thead_row(theadRowNum){
        this.theadRowNum = theadRowNum;
        return this;}

    set_tbody_th(tbodyTh){
        this.tbodyTh = tbodyTh;
        return this;}

    set_class_thtd(clssThTd){
        this.clssThTd = clssThTd;
        return this;}

    set_class_tr(clssTr){
        this.clssTr = clssTr;
        return this;
    }//set_class_tr

    has_total(bool = false){
        this.hasTotal = bool;
        return this;}

    /* 실행 */
    init(){
        const $result = new TableMaker(this);
        return $result.init();
    }
}//class-TableMakerBuilder

/* ---------------------------------------- */

class TableMaker{
    constructor(builder){
        this.data = builder.data ?? null;
        
        this.tableClass = builder.tableClass ?? null;
        this.colG = builder.colG ?? null;
        this.theadRowNum = builder.theadRowNum ?? null;
        this.tbodyTh = builder.tbodyTh ?? null;
        this.clssThTd = builder.clssThTd ?? null;
        this.clssTr = builder.clssTr ?? null;

        this.hasTotal = builder.hasTotal ?? false;
    }//constructor

    /* 실행 */
    init(){
        if(!this.data){return;}
        const $frag = document.createDocumentFragment();
        const $tbl = this.tableClass ? dom_maker("TABLE",[this.tableClass]) : dom_maker("TABLE");

        //전체 00건 추가
        const $total = this.make_total();

        //caption
        const $caption = dom_maker("CAPTION");
        $caption.textContent = this.data.title;

        //colgroup
        const $colgroup = dom_maker("COLGROUP");
        for(let col of this.colG){
            const $col = dom_maker("COL");
            if(col){$col.style.width = col;}
            $colgroup.appendChild($col);
        }//for

        //thead
        const $thead = this.make_thead();
        
        //tbody
        const $tbody = this.make_tbody();
        
        //최종
        $tbl.appendChild($caption);
        $tbl.appendChild($colgroup);
        $thead && $tbl.appendChild($thead);
        $tbl.appendChild($tbody);
        $total && $frag.appendChild($total);
        $frag.appendChild($tbl);
        return $frag;
    }//init

    /* 전체 00건 */
    make_total(){
        if(!this.hasTotal) return;

        const $div = dom_maker("DIV",['tbl-total']);
        const len = this.data.list.length - ((this.theadRowNum || 0) * this.colG.length);
        $div.innerHTML = `전체 <strong>${len}</strong>건`;
        return $div;
    }//make_total

    make_thead(){
        if(!this.theadRowNum){return;}
        const $thead = dom_maker("THEAD");
        const $$data = this.data.list.slice(0, this.theadRowNum * this.colG.length);
        const per = Math.floor(this.colG.length / 2);

        for(let r=0; r<this.theadRowNum; r++){
            const $tr = dom_maker("TR");
            for(let c=0; c<this.colG.length; c++){
                const $th = dom_maker("TH");
                $th.classList.add('f_center');
                const $span = dom_maker("SPAN");
                const dataIdx = (this.theadRowNum * r) + c + (r * per);
                $span.title = $$data[dataIdx].name;
                $span.textContent = $$data[dataIdx].value;
                $th.appendChild($span);
                $tr.appendChild($th);
            }//for-c
            $thead.appendChild($tr);
        }//for-r

        return $thead;
    }//make_thead
    
    make_tbody(){
        const $tbody = dom_maker("TBODY");
        let $$data;
        if(this.theadRowNum){
            $$data = this.data.list.slice(this.theadRowNum * this.colG.length);
        }else{
            $$data = this.data.list.slice();
        }
        const rowLen = Math.ceil($$data.length / this.colG.length);

        for(let r=0; r<rowLen; r++){
            const $tr = dom_maker("TR");
            //tr에 클래스 추가
            if(this.clssTr){
                for(let obj of this.clssTr){
                    if(obj.row === r){
                        obj.clss.forEach(clss => $tr.classList.add(clss));
                    }
                }//for
            }//if

            //th,td 추가
            for(let c=0; c<this.colG.length; c++){
                //th인지 td인지 판별
                const $thtd = this.is_th_td(r,c);
                const $span = dom_maker("SPAN");

                //클래스 있으면 클래스 추가
                this.add_class($thtd,r,c);

                const dataIdx = (r*this.colG.length) + c;
                if($$data[dataIdx]){
                    //내용 추가
                    const {name,value,id} = $$data[dataIdx];
                    $span.title = name ?? "";
                    $span.textContent = value ?? "";

                    //id가 있으면 id를 달고
                    if(id) $thtd.setAttribute('dataset-data-id',id);

                }
                $thtd.appendChild($span);
                $tr.appendChild($thtd);
            }//for-c
            
            $tbody.appendChild($tr);
        }//for-r

        return $tbody;
    }//make_tbody

    /* [th인지 td인지 판별] */
    is_th_td(r,c){
        if(!this.tbodyTh) return dom_maker("TD");

        for(let obj of this.tbodyTh){
            if(obj.row === true || obj.row === r){
                if(obj.col === true || obj.col.includes(c)){
                    return dom_maker("TH");
                }else{
                    return dom_maker("TD");
                }
            }
            return dom_maker("TD")
        }//for
    }//is_th_td

    /* [클래스 있으면 추가] */
    add_class($thtd,r,c){
        if(!this.clssThTd) return;
        for(let obj of this.clssThTd){
            const isR = obj.row === true || obj.row.includes(r); 
            const isC = obj.col === true || obj.col.includes(c);
            const {clss} = obj;
            if(isR && isC && clss.length > 0){
                clss.forEach(clssname => $thtd.classList.add(clssname));
            }
        }//for
    }//add_class
}//class-TableMaker