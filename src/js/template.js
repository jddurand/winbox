/**
 * @type {null|Element}
 */
let template = null;
function templateHTML(self) {
    return `<div class="${self.header_cls}" style="${self.header_style}">
              <div class="${self.control_cls}" style="${self.control_style}">
                <span class="${self.min_cls}" style="${self.min_style}"></span>
                <span class="${self.max_cls}" style="${self.max_style}"></span>
                <span class="${self.full_cls}" style="${self.full_style}"></span>
                <span class="${self.close_cls}" style="${self.close_style}"></span>
              </div>
              <div class="${self.drag_cls}" style="${self.drag_style}">
                <div class="${self.icon_cls}" style="${self.icon_style}"></div>
                <div class="${self.title_cls}" style="${self.title_style}"></div>
              </div>
            </div>
            <div class="${self.body_cls}" style="${self.body_style}"></div>
            <div class="${self.n_cls}" style="${self.n_style}"></div>
            <div class="${self.s_cls}" style="${self.s_style}"></div>
            <div class="${self.w_cls}" style="${self.w_style}"></div>
            <div class="${self.e_cls}" style="${self.e_style}"></div>
            <div class="${self.nw_cls}" style="${self.nw_style}"></div>
            <div class="${self.ne_cls}" style="${self.ne_style}"></div>
            <div class="${self.se_cls}" style="${self.se_style}"></div>
            <div class="${self.sw_cls}" style="${self.sw_style}"></div>`;

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
        template.style = self.windowStyle;
    }

    return (tpl || template).cloneNode(true);
}
