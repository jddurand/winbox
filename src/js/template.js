/**
 * @type {null|Element}
 */
let template = null;
const templateHTML = (

    //'<div class=winbox>' +

        '<div class=wb-header>' +
            '<div class=wb-control>' +
                '<span class=wb-min></span>' +
                '<span class=wb-max></span>' +
                '<span class=wb-full></span>' +
                '<span class=wb-close></span>' +
            '</div>' +
            '<div class=wb-drag>'+
                '<div class=wb-icon></div>' +
                '<div class=wb-title></div>' +
            '</div>' +
        '</div>' +

        '<div class=wb-body></div>' +

        '<div class=wb-n></div>' +
        '<div class=wb-s></div>' +
        '<div class=wb-w></div>' +
        '<div class=wb-e></div>' +
        '<div class=wb-nw></div>' +
        '<div class=wb-ne></div>' +
        '<div class=wb-se></div>' +
        '<div class=wb-sw></div>'

    //'</div>'
);

/**
 * @return {Element}
 */
export default function(tpl){
    if (!template) {
        template = document.createElement('div');
        template.innerHTML = templateHTML;
    }

    return (tpl || template).cloneNode(true);
}
