import EventBus from "./fluids/utils/EventBus";
window.EventBus = EventBus;
import WebGL from "./fluids/modules/WebGL";


if(!window.isDev) window.isDev = false;

const webglMng = new WebGL({
    $wrapper: document.body
});
