/* [dom을 만든다] */
export function dom_maker(type, clssList = []){
    const $el = document.createElement(type);
    for(let clss of clssList){$el.classList.add(clss);}
    return $el;
}//dom_maker

/* [json을 fetch해서 return 한다] */
export function fetch_json(url){
    return fetch(url).then(res=>res.json());
}//fetch_json

/* [부모 요소(첫 parameter)에 자식들(rest)을 추가한다] */
export function append_all($parent,...rest){
    for(const item of rest){
        $parent.appendChild(item);
    }
    return $parent;
}//append_all