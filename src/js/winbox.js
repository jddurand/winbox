/**
 * WinBox.js
 * Author and Copyright: Thomas Wilkerling
 * Licence: Apache-2.0
 * Hosted by Nextapps GmbH
 * https://github.com/nextapps-de/winbox
 */

import template from "./template.js";
import { addListener, removeListener, setStyle, setText, getByClass, addClass, removeClass, hasClass, preventEvent } from "./helper.js";

// C.f. https://github.com/uditalias/async-raf
function asyncRaf(fn) {
	return new Promise((resolve, reject) => {
		window.requestAnimationFrame(async () => {
			if (fn.length >= 1) {
				fn(resolve, reject);
			} else {
				try {
					resolve(
						await fn()
					);
				} catch (e) {
					reject(e);
				}
			}
		});
	});
}

//const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window["MSStream"];

const use_raf = false;
const stack_min = [];
const stack_win = [];
// use passive for touch and mouse wheel
const eventOptions = { "capture": true, "passive": false };
const eventOptionsPassive = { "capture": true, "passive": true };
let body;
let id_counter = 0;
let index_counter = 10;
let is_fullscreen;
let prefix_request;
let prefix_exit;
let root_w, root_h;
let window_clicked;

/**
 * @param {string|Object=} params
 * @param {Object=} _title
 * @constructor
 * @this WinBox
 */

function WinBox(params, _title){

    if(!(this instanceof WinBox)) {

        return new WinBox(params);
    }

    this.init = {};
    this.init.params = params;
    this.init._title = _title;
}

WinBox["new"] = function(params){

    return new WinBox(params);
};

WinBox["stack"] = function(){

    return stack_win;
};

export default WinBox;

/**
 * @param {number|string} num
 * @param {number} base
 * @param {number=} center
 * @return number
 */

function parse(num, base, center){

    if(typeof num === "string"){

        if(num === "center"){

            num = ((base - center) / 2 + 0.5) | 0;
        }
        else if(num === "right" || num === "bottom"){

            num = (base - center);
        }
        else{

            const value = parseFloat(num);
            const unit = (("" + value) !== num) && num.substring(("" + value).length);

            if(unit === "%"){

                num = (base / 100 * value + 0.5) | 0;
            }
            else{

                num = value;
            }
        }
    }

    return num;
}

async function setup(){

    body = document.body;

    body[prefix_request = "requestFullscreen"] ||
    body[prefix_request = "msRequestFullscreen"] ||
    body[prefix_request = "webkitRequestFullscreen"] ||
    body[prefix_request = "mozRequestFullscreen"] ||
    (prefix_request = "");

    prefix_exit = prefix_request && (

        prefix_request.replace("request", "exit")
                      .replace("mozRequest", "mozCancel")
                      .replace("Request", "Exit")
    );

    addListener(window, "resize", async function(){

        init();
        await update_min_stack();

        // TODO adjust window sizes #151

        // for(let i = 0; i < stack_win.length; i++){
        //
        //     stack_win[i].resize().move();
        // }
    });

    addListener(body, "mousedown", async function(event){

        window_clicked = false;

    }, true);

    addListener(body, "mousedown", async function(event){

        if(!window_clicked){

            const stack_length = stack_win.length;

            if(stack_length){

                for(let i = stack_length - 1; i >= 0; i--){

                    const last_focus = stack_win[i];

                    if(last_focus.focused){

                        await last_focus.blur();
                        break;
                    }
                }
            }
        }
    });

    init();
}

/**
 * @param {WinBox} self
 */

function register(self){

    addWindowListener(self, "drag", self.drag_cls);
    addWindowListener(self, "n", self.n_cls);
    addWindowListener(self, "s", self.s_cls);
    addWindowListener(self, "w", self.w_cls);
    addWindowListener(self, "e", self.e_cls);
    addWindowListener(self, "nw", self.nw_cls);
    addWindowListener(self, "ne", self.ne_cls);
    addWindowListener(self, "se", self.se_cls);
    addWindowListener(self, "sw", self.sw_cls);

    addListener(getByClass(self.dom, self.min_cls), "click", async function(event){

        preventEvent(event);
        if (self.min) {
	    await self.restore();
	    await self.focus();
	} else {
	    await self.minimize();
	}
    });

    addListener(getByClass(self.dom, self.max_cls), "click", async function(event){

        preventEvent(event);
        if (self.max) {
	    await self.restore();
	    await self.focus();
	} else {
	    await self.maximize();
	    await self.focus();
	}
    });

    if(prefix_request){

        addListener(getByClass(self.dom, self.full_cls), "click", async function(event){

            preventEvent(event);
            await self.fullscreen();
            await self.focus();
        });
    }
    else{

        self.addClass(self.no_full_cls);
    }

    addListener(getByClass(self.dom, self.close_cls), "click", async function(event){

        preventEvent(event);
        (await self.close()) || (self = null);
    });

    addListener(self.dom, "mousedown", async function(event){

        window_clicked = true;

    }, true);

    addListener(self.body, "mousedown", async function(event){

        // stop propagation would disable global listeners used inside window contents
        // use event bubbling for this listener to skip this handler by the other click listeners
        self.focus();

    }, true);
}

/**
 * @param {WinBox} self
 */

async function remove_min_stack(self){

    stack_min.splice(stack_min.indexOf(self), 1);
    await update_min_stack();
    self.removeClass(self.minimized_cls);
    self.min = false;
    self.dom.title = "";
}

async function update_min_stack(){

    const length = stack_min.length;
    const splitscreen_index = {};
    const splitscreen_length = {};

    for(let i = 0, self, key; i < length; i++){

        self = stack_min[i];
        key = self.left + ":" + self.top;

        if(splitscreen_length[key]){

            splitscreen_length[key]++;
        }
        else{

            splitscreen_index[key] = 0;
            splitscreen_length[key] = 1;
        }
    }

    for(let i = 0, self, key, width; i < length; i++){

        self = stack_min[i]
        key = self.left + ":" + self.top;
        width = Math.min((root_w - self.left - self.right) / splitscreen_length[key], 250);
        await self.resize((width + 1) | 0, self.header, true);
        await self.move((self.left + splitscreen_index[key] * width) | 0, root_h - self.bottom - self.header, true);
        splitscreen_index[key]++;
    }
}

/**
 * @param {WinBox} self
 * @param {string} dir
 */

function addWindowListener(self, dir, cls){

    const node = getByClass(self.dom, cls);
    if(!node) {
	return;
    }

    let touch, x, y;
    let raf_timer, raf_move, raf_resize;
    let dblclick_timer = 0;

    addListener(node, "mousedown", mousedown, eventOptions);
    addListener(node, "touchstart", mousedown, eventOptions);

    async function rafCallback(){

        if(raf_resize){

            await self.resize();
            raf_resize = false;
        }

        if(raf_move){

            await self.move();
            raf_move = false;
        }
    }

    async function mousedown(event){

        // prevent the full iteration through the fallback chain of a touch event (touch > mouse > click)
        preventEvent(event, true);
        //window_clicked = true;
        await self.focus();

        if(dir === "drag"){

            if(self.min){

                await self.restore();
                return;
            }

            if(!self.hasClass(self.no_max_cls)){

                const now = Date.now();
                const diff = now - dblclick_timer;

                dblclick_timer = now;

                if(diff < 300){

                    self.max ? await self.restore() : await self.maximize();
                    return;
                }
            }
        }

        if(/*!self.max &&*/ !self.min){

            addClass(body, self.lock_cls);
            use_raf && asyncRaf(async() => { await rafCallback(); });

            if((touch = event.touches) && (touch = touch[0])){

                event = touch;

                // TODO: fix when touch events bubbles up to the document body
                //addListener(self.dom, "touchmove", preventEvent);
                addListener(window, "touchmove", handler_mousemove, eventOptionsPassive);
                addListener(window, "touchend", handler_mouseup, eventOptionsPassive);
            }
            else{

                //addListener(this, "mouseleave", handler_mouseup);
                addListener(window, "mousemove", handler_mousemove, eventOptionsPassive);
                addListener(window, "mouseup", handler_mouseup, eventOptionsPassive);
            }

            x = event.pageX;
            y = event.pageY;

            // appearing scrollbars on the root element does not trigger "window.onresize",
            // force refresh window size via init(), also force layout recalculation (layout trashing)
            // it is probably very rare that the body overflow changes between window open and close

            //init();
        }
    }

    async function handler_mousemove(event){

        preventEvent(event);

        if(touch){

            event = event.touches[0];
        }

        const pageX = event.pageX;
        const pageY = event.pageY;
        const offsetX = pageX - x;
        const offsetY = pageY - y;

        const old_w = self.width;
        const old_h = self.height;
        const old_x = self.x;
        const old_y = self.y;

        let resize_w, resize_h, move_x, move_y;

        if(dir === "drag"){

            if(self.hasClass(self.no_move_cls)) return;

            self.x += offsetX;
            self.y += offsetY;
            move_x = move_y = 1;
        }
        else{

            if(dir === "e" || dir === "se" || dir === "ne"){

                self.width += offsetX;
                resize_w = 1;
            }
            else if(dir === "w" || dir === "sw" || dir === "nw"){

                self.x += offsetX;
                self.width -= offsetX;
                resize_w = 1;
                move_x = 1;
            }

            if(dir === "s" || dir === "se" || dir === "sw"){

                self.height += offsetY;
                resize_h = 1;
            }
            else if(dir === "n" || dir === "ne" || dir === "nw"){

                self.y += offsetY;
                self.height -= offsetY;
                resize_h = 1;
                move_y = 1;
            }
        }

        if(resize_w){

            self.width = Math.max(Math.min(self.width, self.maxwidth, root_w - self.x - self.right), self.minwidth);
            resize_w = self.width !== old_w;
        }

        if(resize_h){

            self.height = Math.max(Math.min(self.height, self.maxheight, root_h - self.y - self.bottom), self.minheight);
            resize_h = self.height !== old_h;
        }

        if(resize_w || resize_h){

            use_raf ? raf_resize = true : await self.resize();
        }

        if(move_x){

            if(self.max){

                self.x = (

                    pageX < root_w / 3 ?

                        self.left
                    :
                        pageX > root_w / 3 * 2 ?

                            root_w - self.width - self.right
                        :
                            root_w / 2 - self.width / 2

                ) + offsetX;
            }

            self.x = Math.max(Math.min(self.x, self.overflow ? root_w - 30 : root_w - self.width - self.right), self.overflow ? 30 - self.width : self.left);
            move_x = self.x !== old_x;
        }

        if(move_y){

            if(self.max){

                self.y = self.top + offsetY;
            }

            self.y = Math.max(Math.min(self.y, self.overflow ? root_h - self.header : root_h - self.height - self.bottom), self.top);
            move_y = self.y !== old_y;
        }

        if(move_x || move_y){

            if(self.max){

                await self.restore();
            }

            use_raf ? raf_move = true : await self.move();
        }

        if(resize_w || move_x){

            x = pageX;
        }

        if(resize_h || move_y){

            y = pageY;
        }
    }

    async function handler_mouseup(event){

        preventEvent(event);
        removeClass(body, self.lock_cls);
        use_raf && cancelAnimationFrame(raf_timer);

        if(touch){

            //removeListener(self.dom, "touchmove", preventEvent);
            removeListener(window, "touchmove", handler_mousemove, eventOptionsPassive);
            removeListener(window, "touchend", handler_mouseup, eventOptionsPassive);
        }
        else{

            //removeListener(this, "mouseleave", handler_mouseup);
            removeListener(window, "mousemove", handler_mousemove, eventOptionsPassive);
            removeListener(window, "mouseup", handler_mouseup, eventOptionsPassive);
        }
    }
}

function init(){

    // TODO: the window height of iOS isn't determined correctly when the bottom toolbar disappears

    // the bounding rect provides more precise dimensions (float values)
    // //const rect = doc.getBoundingClientRect();
    // this.root_w = doc.clientWidth; //rect.width || (rect.right - rect.left);
    // this.root_h = doc.clientHeight; //rect.height || (rect.top - rect.bottom);

    // if(ios){
    //     this.root_h = window.innerHeight * (this.root_w / window.innerWidth);
    // }

    // root_w = doc.clientWidth;
    // root_h = doc.clientHeight;

    // root_w = body.clientWidth;
    // root_h = body.clientHeight;

    const doc = document.documentElement;
    root_w = doc.clientWidth;
    root_h = doc.clientHeight;
}

/**
 * @param {Element=} src
 * @this WinBox
 */

WinBox.prototype.mount = function(src){

    // handles mounting over:
    this.unmount();

    src._backstore || (src._backstore = src.parentNode);
    this.body.textContent = "";
    this.body.appendChild(src);

    return this;
};

/**
 * @param {Element=} dest
 * @this WinBox
 */

WinBox.prototype.unmount = function(dest){

    const node = this.body.firstChild;

    if(node){

        const root = dest || node._backstore;

        root && root.appendChild(node);
        node._backstore = dest;
    }

    return this;
};

/**
 * @this WinBox
 */

WinBox.prototype.setTitle = function(title){

    const node = getByClass(this.dom, this.title_cls);
    if (node) {
        setText(node, this.title = title);
    }
    return this;
};

/**
 * @this WinBox
 */

WinBox.prototype.setIcon = function(src){

    const img = getByClass(this.dom, this.icon_cls);
    if (img) {
        setStyle(img, "background-image", "url(" + src + ")");
        setStyle(img, "display", "inline-block");
    }

    return this;
};

/**
 * @this WinBox
 */

WinBox.prototype.setBackground = function(background){

    setStyle(this.window, "background", background);
    return this;
};

/**
 * @this WinBox
 */

WinBox.prototype.setUrl = function(url, onload){

    const node = this.body.firstChild;

    if(node && (node.tagName.toLowerCase() === "iframe")){

        node.src = url;
    }
    else{

        this.body.innerHTML = '<iframe src="' + url + '"></iframe>';
        onload && (this.body.firstChild.onload = onload);
    }

    return this;
};

/**
 * @param {boolean=} state
 * @this WinBox
 */

WinBox.prototype.focus = async function(state){

    if(state === false){

        return await this.blur();
    }

    if(!this.focused){

        const stack_length = stack_win.length;

        if(stack_length > 1){

            for(let i = 1; i <= stack_length; i++){

                const last_focus = stack_win[stack_length - i];

                if(last_focus.focused /*&& last_focus !== this*/){

                    await last_focus.blur();
                    stack_win.push(stack_win.splice(stack_win.indexOf(this), 1)[0]);

                    break;
                }
            }
        }

        setStyle(this.dom, "z-index", ++index_counter);
        this.index = index_counter;
        this.addClass(this.focus_cls);
        this.focused = true;
        this.onfocus && await this.onfocus();
    }

    return this;
};

/**
 * @param {boolean=} state
 * @this WinBox
 */

WinBox.prototype.blur = async function(state){

    if(state === false){

        return await this.focus();
    }

    if(this.focused){

        this.removeClass(this.focus_cls);
        this.focused = false;
        this.onblur && await this.onblur();
    }

    return this;
};

/**
 * @param {boolean=} state
 * @this WinBox
 */

WinBox.prototype.hide = async function(state){

    if(state === false){

        return await this.show();
    }

    if(!this.hidden){

        this.onhide && await this.onhide();
        this.hidden = true;
        return this.addClass(this.hidden_cls);
    }
};

/**
 * @param {boolean=} state
 * @this WinBox
 */

WinBox.prototype.show = async function(state){

    if(state === false){

        return await this.hide();
    }

    if(this.hidden){

        this.onshow && await this.onshow();
        this.hidden = false;
        return this.removeClass(this.hidden_cls);
    }
};

/**
 * @param {boolean=} state
 * @this WinBox
 */

WinBox.prototype.minimize = async function(state){

    if(state === false){

        return await this.restore();
    }

    if(is_fullscreen){

        await cancel_fullscreen();
    }

    if(this.max){

        this.removeClass(this.maximized_cls);
        this.max = false;
    }

    if(!this.min){

        stack_min.push(this);
        await update_min_stack();
        this.dom.title = this.title;
        this.addClass(this.minimized_cls);
        this.min = true;

        if(this.focused){

            await this.blur();
            await focus_next();
        }

        this.onminimize && await this.onminimize();
    }

    return this;
};

async function focus_next(){

    const stack_length = stack_win.length;

    if(stack_length){

        for(let i = stack_length - 1; i >= 0; i--){

            const last_focus = stack_win[i];

            if(!last_focus.min /*&& last_focus !== this*/){

                await last_focus.focus();
                break;
            }
        }
    }
}

/**
 * @this WinBox
 */

WinBox.prototype.restore = async function(){

    if(is_fullscreen){

        await cancel_fullscreen();
    }

    if(this.min){

        await remove_min_stack(this);
        await this.resize();
        await this.move();
        this.onrestore && await this.onrestore();
    }

    if(this.max){

        this.max = false;
        this.removeClass(this.maximized_cls);
        await this.resize();
        await this.move();
        this.onrestore && await this.onrestore();
    }

    return this;
};

/**
 * @param {boolean=} state
 * @this WinBox
 */

WinBox.prototype.maximize = async function(state){

    if(state === false){

        return await this.restore();
    }

    if(is_fullscreen){

        await cancel_fullscreen();
    }

    if(this.min){

        await remove_min_stack(this);
    }

    if(!this.max){

        this.addClass(this.maximized_cls);
        await this.resize(
            root_w - this.left - this.right,
            root_h - this.top - this.bottom /* - 1 */,
            true);
        await this.move(
            this.left,
            this.top,
            true
        );

        this.max = true;
        this.onmaximize && await this.onmaximize();
    }

    return this;
};

/**
 * @param {boolean=} state
 * @this WinBox
 */

WinBox.prototype.fullscreen = async function(state){

    if(this.min){

        await remove_min_stack(this);
        await this.resize();
        await this.move();
    }

    // fullscreen could be changed by user manually!

    if(!is_fullscreen || !(await cancel_fullscreen())){

        // requestFullscreen is executed as async and returns promise.
        // in this case it is better to set the state to "this.full" after the requestFullscreen was fired,
        // because it may break when browser does not support fullscreen properly and bypass it silently.

        await this.body[prefix_request]();
        is_fullscreen = this;
        this.full = true;
        this.onfullscreen && await this.onfullscreen();
    }
    else if(state === false){

        return await this.restore();
    }

    return this;
};

function has_fullscreen(){

    return (

        document["fullscreen"] ||
        document["fullscreenElement"] ||
        document["webkitFullscreenElement"] ||
        document["mozFullScreenElement"]
    );
}

/**
 * @return {Promise<boolean>|Promise<void>}
 */

async function cancel_fullscreen(){

    is_fullscreen.full = false;

    if(has_fullscreen()){

        // exitFullscreen is executed as async and returns promise.
        // the important part is that the promise callback runs before the event "onresize" was fired!

        await document[prefix_exit]();
        return true;
    }
}

/**
 * @param {boolean=} force
 * @this WinBox
 */

WinBox.prototype.close = async function(force) {

    if(this.onclose && await this.onclose(force)){

        return true;
    }

    if(this.min){

        await remove_min_stack(this);
    }

    stack_win.splice(stack_win.indexOf(this), 1);

    this.unmount();
    this.dom.remove();
    this.dom.textContent = "";
    this.dom[this.window_cls] = null;
    this.body = null;
    this.dom = null;
    this.focused && await focus_next();
};

/**
 * @param {number|string=} x
 * @param {number|string=} y
 * @param {boolean=} _skip_update
 * @this WinBox
 */

WinBox.prototype.move = async function(x, y, _skip_update){

    if(!x && (x !== 0)){

        x = this.x;
        y = this.y;
    }
    else if(!_skip_update){

        this.x = x ? x = parse(x, root_w - this.left - this.right, this.width) : 0;
        this.y = y ? y = parse(y, root_h - this.top - this.bottom, this.height) : 0;
    }

    //setStyle(this.dom, "transform", "translate(" + x + "px," + y + "px)");
    setStyle(this.dom, "left", x + "px");
    setStyle(this.dom, "top", y + "px");

    this.onmove && await this.onmove(x, y);
    return this;
};

/**
 * @param {number|string=} w
 * @param {number|string=} h
 * @param {boolean=} _skip_update
 * @this WinBox
 */

WinBox.prototype.resize = async function(w, h, _skip_update){

    if(!w && (w !== 0)){

        w = this.width;
        h = this.height;
    }
    else if(!_skip_update){

        this.width = w ? w = parse(w, this.maxwidth /*- this.left - this.right*/) : 0;
        this.height = h ? h = parse(h, this.maxheight /*- this.top - this.bottom*/) : 0;

        w = Math.max(w, this.minwidth);
        h = Math.max(h, this.minheight);
    }

    setStyle(this.dom, "width", w + "px");
    setStyle(this.dom, "height", h + "px");

    this.onresize && await this.onresize(w, h);
    return this;
};

/**
 * @param {{ class:string?, image:string?, click:Function?, index:number? }} control
 * @this WinBox
 */

WinBox.prototype.addControl = function(control){

    const classname = control["class"];
    const image = control.image;
    const click = control.click;
    const index = control.index;
    const node = document.createElement("span");
    const icons = getByClass(this.dom, this.control_cls);
    const self = this;

    if(classname) node.className = classname;
    if(image) setStyle(node, "background-image", "url(" + image + ")");
    if(click) node.onclick = async function(event){ await click.call(this, event, self) };

    icons.insertBefore(node, icons.childNodes[index || 0]);

    return this;
};

/**
 * @param {string} control
 * @this WinBox
 */

WinBox.prototype.removeControl = function(control){

    control = getByClass(this.dom, control);
    control && control.remove();
    return this;
};

/**
 * @param {string} classname
 * @this WinBox
 */

WinBox.prototype.addClass = function(classname){

    addClass(this.dom, classname);
    return this;
};

/**
 * @param {string} classname
 * @this WinBox
 */

WinBox.prototype.removeClass = function(classname){

    removeClass(this.dom, classname);
    return this;
};


/**
 * @param {string} classname
 * @this WinBox
 */

WinBox.prototype.hasClass = function(classname){

    return hasClass(this.dom, classname);
};

/**
 * @param {string} classname
 * @this WinBox
 */

WinBox.prototype.toggleClass = function(classname){

    return this.hasClass(classname) ? this.removeClass(classname) : this.addClass(classname);
};


/**
 * @this WinBox
 */

WinBox.prototype.initialize = async function(){

    let params = this.init.params;
    let _title = this.init._title;

    body || await setup();

    let id,
        index,
        root,
        tpl,
        title,
        icon,
        mount,
        html,
        url,

        width,
        height,
        minwidth,
        minheight,
        maxwidth,
        maxheight,
        autosize,
        overflow,

        x,
        y,

        top,
        left,
        bottom,
        right,

        min,
        max,
        hidden,
        modal,

        background,
        border,
        header,
        classname,

        oncreate,
        onclose,
        onfocus,
        onblur,
        onmove,
        onresize,
        onfullscreen,
        onmaximize,
        onminimize,
        onrestore,
        onhide,
        onshow,
        onload,

        window_cls,
        window_style,
        modal_cls,
        header_cls,
        header_style,
        control_cls,
        control_style,
        icon_cls,
        icon_style,
        title_cls,
        title_style,
        body_cls,
        body_style,
        min_cls,
        min_style,
        minimized_cls,
        max_cls,
        max_style,
        maximized_cls,
        no_max_cls,
        full_cls,
        full_style,
        no_full_cls,
        no_move_cls,
        lock_cls,
        focus_cls,
        hidden_cls,
        drag_cls,
        drag_style,
        n_cls,
        n_style,
        s_cls,
        s_style,
        w_cls,
        w_style,
        e_cls,
        e_style,
        nw_cls,
        nw_style,
        ne_cls,
        ne_style,
        se_cls,
        se_style,
        sw_cls,
        sw_style,
        close_cls,
        close_style;

    if(params){

        if(_title){

            title = params;
            params = _title;
        }

        if(typeof params === "string"){

            title = params;
        }
        else{

            id = params["id"];
            index = params["index"];
            root = params["root"];
            tpl = params["template"];
            title = title || params["title"];
            icon = params["icon"];
            mount = params["mount"];
            html = params["html"];
            url = params["url"];

            width = params["width"];
            height = params["height"];
            minwidth = params["minwidth"];
            minheight = params["minheight"];
            maxwidth = params["maxwidth"];
            maxheight = params["maxheight"];
            autosize = params["autosize"];
            overflow = params["overflow"];

            min = params["min"];
            max = params["max"];
            hidden = params["hidden"];
            modal = params["modal"];

            x = params["x"] || (modal ? "center" : 0);
            y = params["y"] || (modal ? "center" : 0);

            top = params["top"];
            left = params["left"];
            bottom = params["bottom"];
            right = params["right"];

            background = params["background"];
            border = params["border"];
            header = params["header"];
            classname = params["class"];

            oncreate = params["oncreate"];
            onclose = params["onclose"];
            onfocus = params["onfocus"];
            onblur = params["onblur"];
            onmove = params["onmove"];
            onresize = params["onresize"];
            onfullscreen = params["onfullscreen"];
            onmaximize = params["onmaximize"];
            onminimize = params["onminimize"];
            onrestore = params["onrestore"];
            onhide = params["onhide"];
            onshow = params["onshow"];
            onload = params["onload"];

	    window_cls = params["window_cls"];
	    window_style = params["window_style"];
	    modal_cls = params["modal_cls"];
	    header_cls = params["header_cls"];
	    header_style = params["header_style"];
	    control_cls = params["control_cls"];
	    control_style = params["control_style"];
	    icon_cls = params["icon_cls"];
	    icon_style = params["icon_style"];
	    title_cls = params["title_cls"];
	    title_style = params["title_style"];
	    body_cls = params["body_cls"];
	    body_style = params["body_style"];
	    min_cls = params["min_cls"];
	    min_style = params["min_style"];
	    minimized_cls = params["minimized_cls"];
	    max_cls = params["max_cls"];
	    max_style = params["max_style"];
	    maximized_cls = params["maximized_cls"];
	    no_max_cls = params["no_max_cls"];
	    full_cls = params["full_cls"];
	    full_style = params["full_style"];
	    no_full_cls = params["no_full_cls"];
	    no_move_cls = params["no_move_cls"];
	    lock_cls = params["lock_cls"];
	    focus_cls = params["focus_cls"];
	    hidden_cls = params["hidden_cls"];
	    drag_cls = params["drag_cls"];
	    drag_style = params["drag_style"];
	    n_cls = params["n_cls"];
	    n_style = params["n_style"];
	    s_cls = params["s_cls"];
	    s_style = params["s_style"];
	    w_cls = params["w_cls"];
	    w_style = params["w_style"];
	    e_cls = params["e_cls"];
	    e_style = params["e_style"];
	    nw_cls = params["nw_cls"];
	    nw_style = params["nw_style"];
	    ne_cls = params["ne_cls"];
	    ne_style = params["ne_style"];
	    se_cls = params["se_cls"];
	    se_style = params["se_style"];
	    sw_cls = params["sw_cls"];
	    sw_style = params["sw_style"];
	    close_cls = params["close_cls"];
	    close_style = params["close_style"];
        }
    }

    this.modal = modal;
    this.window_cls = window_cls || "wb-window";
    this.window_style = window_style || "";
    this.modal_cls = modal_cls || "wb-modal";
    this.header_cls = header_cls || "wb-header";
    this.header_style = header_style || "";
    this.control_cls = control_cls || "wb-control";
    this.control_style = control_style || "";
    this.icon_cls = icon_cls || "wb-icon";
    this.icon_style = icon_style || "";
    this.title_cls = title_cls || "wb-title";
    this.title_style = title_style || "";
    this.body_cls = body_cls || "wb-body";
    this.body_style = body_style || "";
    this.min_cls = min_cls || "wb-min";
    this.min_style = min_style || "";
    this.minimized_cls = minimized_cls || "wb-minimized";
    this.max_cls = max_cls || "wb-max";
    this.max_style = max_style || "";
    this.maximized_cls = maximized_cls || "wb-maximized";
    this.no_max_cls = no_max_cls || "wb-no-max";
    this.full_cls = full_cls || "wb-full";
    this.full_style = full_style || "";
    this.no_full_cls = no_full_cls || "wb-no-full";
    this.no_move_cls = no_move_cls || "wb-no-move";
    this.lock_cls = lock_cls || "wb-lock";
    this.focus_cls = focus_cls || "wb-focus";
    this.hidden_cls = hidden_cls || "wb-hidden";
    this.drag_cls = drag_cls || "wb-drag";
    this.drag_style = drag_style || "";
    this.n_cls = n_cls || "wb-n";
    this.n_style = n_style || "";
    this.s_cls = s_cls || "wb-s";
    this.s_style = s_style || "";
    this.w_cls = w_cls || "wb-w";
    this.w_style = w_style || "";
    this.e_cls = e_cls || "wb-e";
    this.e_style = e_style || "";
    this.nw_cls = nw_cls || "wb-nw";
    this.nw_style = nw_cls || "";
    this.ne_cls = ne_cls || "wb-ne";
    this.ne_style = ne_style || "";
    this.se_cls = se_cls || "wb-se";
    this.se_style = se_style || "";
    this.sw_cls = sw_cls || "wb-sw";
    this.sw_style = sw_style || "";
    this.close_cls = close_cls || "wb-close";
    this.close_style = close_style || "";

    this.windowId = this.id = id || (this.window_cls + "-" + (++id_counter));
    this.windowClassName = this.window_cls + (classname ? " " + (typeof classname === "string" ? classname : classname.join(" ")) : "") + (modal ? " " + this.modal_cls : "");
    this.windowStyle = this.window_style;
    this.dom = template(tpl, this);
    this.dom[this.window_cls] = this;
    this.window = this.dom;
    this.body = getByClass(this.dom, this.body_cls);
    this.header = header || 35;
    //this.plugins = [];

    stack_win.push(this);

    if(background){

        this.setBackground(background);
    }

    if(border){

        setStyle(this.body, "margin", border + (isNaN(border) ? "" : "px"));
    }
    else{

        border = 0;
    }

    if(header){

        const node = getByClass(this.dom, this.header_cls);
        setStyle(node, "height", header + "px");
        setStyle(node, "line-height", header + "px");
        setStyle(this.body, "top", header + "px");
    }

    if(title){

        this.setTitle(title);
    }

    if(icon){

        this.setIcon(icon);
    }

    if(mount){

        this.mount(mount);
    }
    else if(html){

        this.body.innerHTML = html;
    }
    else if(url){

        this.setUrl(url, onload);
    }

    top = top ? parse(top, root_h) : 0;
    bottom = bottom ? parse(bottom, root_h) : 0;
    left = left ? parse(left, root_w) : 0;
    right = right ? parse(right, root_w) : 0;

    const viewport_w = root_w - left - right;
    const viewport_h = root_h - top - bottom;

    maxwidth = maxwidth ? parse(maxwidth, viewport_w) : viewport_w;
    maxheight = maxheight ? parse(maxheight, viewport_h) : viewport_h;
    minwidth = minwidth ? parse(minwidth, maxwidth) : 150;
    minheight = minheight ? parse(minheight, maxheight) : this.header;

    if(autosize){

        (root || body).appendChild(this.body);

        width = Math.max(Math.min(this.body.clientWidth + border * 2 + 1, maxwidth), minwidth);
        height = Math.max(Math.min(this.body.clientHeight + this.header + border + 1, maxheight), minheight);

        this.dom.appendChild(this.body);
    }
    else{

        width = width ? parse(width, maxwidth) : Math.max(maxwidth / 2, minwidth) | 0;
        height = height ? parse(height, maxheight) : Math.max(maxheight / 2, minheight) | 0;
    }

    x = x ? parse(x, viewport_w, width) : left;
    y = y ? parse(y, viewport_h, height) : top;

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.minwidth = minwidth;
    this.minheight = minheight;
    this.maxwidth = maxwidth;
    this.maxheight = maxheight;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
    this.left = left;
    this.index = index;
    this.overflow = overflow;
    //this.border = border;
    this.min = false;
    this.max = false;
    this.full = false;
    this.hidden = false;
    this.focused = false;

    this.onclose = onclose;
    this.onfocus = onfocus;
    this.onblur = onblur;
    this.onmove = onmove;
    this.onresize = onresize;
    this.onfullscreen = onfullscreen;
    this.onmaximize = onmaximize;
    this.onminimize = onminimize;
    this.onrestore = onrestore;
    this.onhide = onhide;
    this.onshow = onshow;

    if(hidden){

        await this.hide();
    }
    else{

        await this.focus();
    }

    if(index || (index === 0)){

        this.index = index;
        setStyle(this.dom, "z-index", index);
        if(index > index_counter) index_counter = index;
    }

    if(max){

        await this.maximize();
    }
    else if(min){

        await this.minimize();
    }
    else{

        await this.resize();
        await this.move();
    }

    await register(this);
    (root || body).appendChild(this.dom);
    oncreate && await oncreate.call(this, params);

    return this;
};

/*
WinBox.prototype.use = function(plugin){

    this.plugins.push(plugin);
    return this;
};
*/
