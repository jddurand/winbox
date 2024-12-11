/**
 * @type {null|Element}
 */
let template = null;
function templateHTML(self) {
    return `<div class=${self.header_cls}>
              <div class=${self.control_cls}>
                <span class=${self.min_cls}></span>
                <span class=${self.max_cls}></span>
                <span class=${self.full_cls}></span>
                <span class=${self.close_cls}></span>
              </div>
              <div class=${self.drag_cls}>
                <div class=${self.icon_cls}></div>
                <div class=${self.title_cls}></div>
              </div>
            </div>
            <div class=${self.body_cls}></div>
            <div class=${self.n_cls}></div>
            <div class=${self.s_cls}></div>
            <div class=${self.w_cls}></div>
            <div class=${self.e_cls}></div>
            <div class=${self.nw_cls}></div>
            <div class=${self.ne_cls}></div>
            <div class=${self.se_cls}></div>
            <div class=${self.sw_cls}></div>`;

    //'</div>'
}

/**
 * @return {Element}
 */
export default function(tpl, self){
    if (!template) {
        template = document.createElement('div');
        template.innerHTML = templateHTML(self);
        template.id = self.windowId;
        template.className = self.windowClassName;
    }

    return (tpl || template).cloneNode(true);
}
