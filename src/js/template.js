/**
 * @type {null|Element}
 */
function templateHTML(self) {
    let output = "";
    if (! self.no_header) {
        output      = `<div class="${self.header_cls}" style="${self.header_style}">`;
        if (! self.no_control) {
            output += `  <div class="${self.control_cls}" style="${self.control_style}">`;
            output += `    <span class="${self.min_cls}" style="${self.min_style}"></span>`;
            output += `    <span class="${self.max_cls}" style="${self.max_style}"></span>`;
            output += `    <span class="${self.full_cls}" style="${self.full_style}"></span>`;
            output += `    <span class="${self.close_cls}" style="${self.close_style}"></span>`;
            output += "  </div>";
        }
        if (! self.no_drag) {
            output += `  <div class="${self.drag_cls}" style="${self.drag_style}">`;
        }
        if (! self.no_icon) {
            output += `    <div class="${self.icon_cls}" style="${self.icon_style}"></div>`;
        }
        if (! self.no_title) {
            output += `    <div class="${self.title_cls}" style="${self.title_style}"></div>`;
        }
        if (! self.no_drag) {
            output += "  </div>";
        }
        output     += "</div>";
    }
    if (! self.no_body) {
        output     += `<div class="${self.body_cls}" style="${self.body_style}"></div>`;
    }
    if (! self.no_resize) {
        output     += `<div class="${self.n_cls}" style="${self.n_style}"></div>`;
        output     += `<div class="${self.s_cls}" style="${self.s_style}"></div>`;
        output     += `<div class="${self.w_cls}" style="${self.w_style}"></div>`;
        output     += `<div class="${self.e_cls}" style="${self.e_style}"></div>`;
        output     += `<div class="${self.nw_cls}" style="${self.nw_style}"></div>`;
        output     += `<div class="${self.ne_cls}" style="${self.ne_style}"></div>`;
        output     += `<div class="${self.se_cls}" style="${self.se_style}"></div>`;
        output     += `<div class="${self.sw_cls}" style="${self.sw_style}"></div>`;
    }

    return output;
}

/**
 * @return {Element}
 */
export default function(tpl, self){
    let output;

    if (tpl) {
        output = tpl.cloneNode(true);
    } else {
	output = document.createElement('div');
        output.innerHTML = templateHTML(self);
    }

    output.id = self.windowId;
    output.className = self.windowClassName;
    output.style = self.windowStyle;

    return output;
}
