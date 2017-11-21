// Compiled using marko@4.5.6 - DO NOT EDIT
"use strict";

var marko_template = module.exports = require("marko/src/html").t(__filename),
    components_helpers = require("marko/src/components/helpers"),
    marko_registerComponent = components_helpers.rc,
    marko_componentType = marko_registerComponent("/bloggrid$1.0.0/page.marko", function() {
      return module.exports;
    }),
    marko_renderer = components_helpers.r,
    marko_defineComponent = components_helpers.c,
    marko_helpers = require("marko/src/runtime/html/helpers"),
    marko_escapeXmlAttr = marko_helpers.xa,
    marko_escapeXml = marko_helpers.x,
    marko_escapeScript = marko_helpers.xs,
    marko_attr = marko_helpers.a,
    marko_escapeStyle = marko_helpers.xc,
    marko_loadTag = marko_helpers.t,
    component_globals_tag = marko_loadTag(require("marko/src/components/taglib/component-globals-tag")),
    marko_forEach = marko_helpers.f,
    init_components_tag = marko_loadTag(require("marko/src/components/taglib/init-components-tag")),
    await_reorderer_tag = marko_loadTag(require("marko/src/taglibs/async/await-reorderer-tag"));

function render(input, out, __component, component, state) {
  var data = input;

  out.w("<!doctype html><html class=\"no-js\" lang=\"en-us\"><head><script async src=\"https://www.googletagmanager.com/gtag/js?id=" +
    marko_escapeXmlAttr(input.pageData.googleID) +
    "\"></script><script>function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag(\"js\",new Date),gtag(\"config\",\"" +
    marko_escapeScript(input.pageData.googleID) +
    "\");</script><meta charset=\"utf-8\"><meta name=\"HandheldFriendly\" content=\"True\"><meta http-equiv=\"x-ua-compatible\" content=\"ie=edge\"><link rel=\"shortcut icon\" href=\"favicon.ico\" type=\"image/x-icon\"><title>" +
    marko_escapeXml(input.pageData.pageTitle) +
    "</title><meta name=\"description\"" +
    marko_attr("content", input.pageData.pageDescription) +
    "><meta name=\"viewport\" content=\"width=device-width, initial-scale=1, user-scalable=no\"><style>.dir::before{content:\"Click Photo for Story\"}.ft{height:30px}.sh{display:none}.cr img,.cr img:focus,a{-webkit-tap-highlight-color:transparent}.gd,.hd,.loader{text-align:center}body{font-family:Montserrat,sans-serif;font-size:10px;margin:0}.gd{overflow:auto;max-width:960px;margin:30px auto auto;padding-left:2px}.cp,.cp span,.cr img,.hd::after,.loader{display:block}.tb{vertical-align:top;position:relative;float:left;width:32.66%;min-width:32.66%;margin:2px;-webkit-transition:all .1s ease-in}.cp,.cp span,.cr,.cr img{position:absolute}.tb::before{content:\"\";display:block;padding-top:100%}.cr{height:100%;overflow:hidden;top:0;left:0;bottom:0;right:0}.cr img{min-width:100%;min-height:100%;margin:auto;top:-100%;right:-100%;bottom:-100%;left:-100%}.tb:hover{z-index:900}.hd{margin-top:-35px;width:100%}.hd img{padding-bottom:10px}.hd::after{margin-top:10px;content:\" \";width:100%;height:1px;background-color:#000}.ib img{width:35px;height:35px;margin:10px}.loader{padding:1em;margin:auto}.loader svg{width:330px;height:330px;fill:#000}@media (max-width:640px){.tb{width:49.3%;margin:.3%}.gd{padding-left:0}.cr img{min-width:0;max-width:50vw}}.cp{pointer-events:none;box-sizing:border-box;font-weight:700;font-size:2em;text-align:left;top:0;color:#fff;height:100%;width:100%}.cp span{bottom:-50%;padding:5px;transition:all .4s;opacity:0;background-color:#000;background-color:rgba(0,0,0,.7)}.tb:hover .cp span{bottom:0;opacity:1}h2{font-weight:400;font-size:14px}@media print{.ib,h2{display:none}.gd{max-width:20cm;margin:auto;padding-top:1cm}.tb{width:1cm;margin:.05cm;page-break-before:auto;page-break-after:auto;page-break-inside:avoid}.tb:hover{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;transition:none!important;transform:scale(1)}.cp,.sh{display:block;font-size:36pt}.cp{bottom:0;height:auto;padding:0;font-size:1em}.cp span{-webkit-print-color-adjust:exact;bottom:0;opacity:1;color:#fff;background-color:#000;background-color:rgba(0,0,0,.5)}}.sw{display:none}@media (hover:none){.dir::before{content:\"Tap Photo for Story\"} .tb:hover .cp span{bottom:-50%;opacity:0}.sw,.sw div{height:1em;border-radius:1em}.tb{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;transition:none!important;transform:scale(1)!important}.sw input{position:absolute;opacity:0}.sw{display:block;position:absolute;top:10px;right:10px;font-size:25px;width:2em;background:#d8d8d8}.sw div{width:1em;background:#FFF;box-shadow:0 .1em .3em rgba(0,0,0,.3);-webkit-transition:all .3s;-moz-transition:all .3s;transition:all .3s}.sw input:checked+div{background:" +
    marko_escapeStyle(input.pageData.switchOnColor) +
    ";-webkit-transform:translate3d(100%,0,0);-moz-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.ms{opacity:1!important;bottom:0!important}}@media (max-width:960px){body{font-size:1.15vw}.gd{padding-left:0}.cr img{max-width:0;max-height:0}}@media (max-width:640px){body{font-size:1.55vw}.cr img{min-width:0;max-width:50vw}}</style></head><body>");

  component_globals_tag({}, out);

  out.w("<div class=\"ib\"><a" +
    marko_attr("href", input.pageData.instagramURL) +
    "><img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAQAAADbJyoPAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfhCwoSBBaGu7S5AAADaElEQVRo3tWa7VnbMBDH/+The7RBwwbeADNBywQ1E2AmwEyQhwkME4ROYHcCtEHoBHYmSD+EFN3p7ZREedzLF8uRdD/f6eST5AuEpUSJOQoAQAGFdBmhAQAaG/ToD+gBChVW2Gb4rVClPJRCiyELyP43oJUB1ZlBvoDqmE3yuMbvMuVHeT8ryhZbvJs4FwZK9xk1/oj4wJ/EQPiGBYBQJGrcYOQ3XQ5aY4nyoIB22b3EEmuns5jUDpDqJBBcKgdQTal5BAlD70AbtVZkGdpaCyW3eDVyu+RHsXH+2aZiY0Udo8MjFd6xxdpwv2Jjp9rd7lw3s1nha2ahRviMKWqX00vpHZHUNpihJA3fMsD8ZOUfHm0lh/mVAWbBysqjrZxhTm7oBCUFGnRGJA7o0DheKb9ZWTuuAGBOh+8gxFBonBP7ftw1JCIXgfnWnFQ6CtOJUCQZD81WzLihs1h3DIxiE0Ho1xn2WaBBh5aNUEv7kABTJGaBgzcpccEMM+LdjwhKlzg7h3IkW6O6JH+FUiflQemhsQEwR2E5Ydfqyk6efBpNszZCg+6jpmZ4CrUjykLOb+gcLIOxk6+lx2UKS6tufUoYO/mqEJKK1R68Y43AzCAR7o47vATrv+DOcp9IJJZZMwdJhDrLlw0ku6lg3fpMToUnT0UcRuKmH6T0HAhUU0Y8B3pxigTmmpReRCh2zet4AwlMYVz3QrvsbNN7ejkCRhnXWozCa6t4dVlof8kmY+1kmKySCjPPWFsEMxrXRVLvhaeXI2C0cZ2yQaJISqHjDSQwNLuvxDBVoJeDYd5I6V78OrgP9HIwjCbJ4QKPIphHsnj7OJWbgFdSqgWuqljS8BptAeA/TK5GPLE7bTDt5NtNT9I32oQS8ktI5dZKqxZYYhlZqgAjbsU6yDOEd/NS15OSNWVL085JLW+13IjQuEo4vupxldZ76lt7xA0eBLEx4sF1JhATYihhm7TNopCwQULXN9JOAPk2WuihyHrskqWGRcKY0IkZsetxTNnMmPLvR3afJlRbD+TflPYLHXcAzrFd7xb6Ou1cN/McZNjiOciY1BHPFA6/GtNkg4WjDtUTlcix4KQOTIFJHCVP9JB9Ap8fcJzVWVFWsSEwmU9W9vbJ/zGPPOPB7jOnLgtI5//M6SICddYPwP4C7UB7qrFIcA0AAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMTEtMTBUMTg6MDQ6MjIrMDA6MDAx3pXnAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTExLTEwVDE4OjA0OjIyKzAwOjAwQIMtWwAAAABJRU5ErkJggg==\" alt=\"Instagram Logo\"></a></div><div class=\"hd\"><a" +
    marko_attr("href", input.pageData.instagramURL) +
    "><img" +
    marko_attr("src", input.pageData.logoImage) +
    " alt=\"Logo\" height=40></a><h1 class=\"sh\">" +
    marko_escapeXml(input.pageData.header) +
    "</h1><h2 class=\"dir\"></h2></div><label class=\"sw\"><input onchange=\"toggleCaptions()\" type=\"checkbox\"><div></div></label><div class=\"ct\"><div class=\"gd\">");

  marko_forEach(input.items, function(item) {
    out.w("<div class=\"tb\"><div class=\"cr\"><a href=\"" +
      marko_escapeXmlAttr(item.link) +
      "?xrs=_s.newsGrid\" target=\"_blank\"><img" +
      marko_attr("src", item["media:content"].url) +
      marko_attr("alt", item.title) +
      " width=\"315\" height=\"315\"></a><div class=\"cp\"><span>" +
      marko_escapeXml(item.title) +
      "</span></div></div></div>");
  });

  out.w("</div><div class=\"ft\"></div></div><script src=\"https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js\"></script><script>function toggleCaptions(){document.querySelectorAll(\".cp span\").forEach(function(o){o.classList.toggle(\"ms\")})}WebFont.load({google:{families:[\"Montserrat:400,700\"]}});</script>");

  if (input.items.length < 1) {
    out.w("<script>location.reload();</script>");
  }

  init_components_tag({}, out);

  await_reorderer_tag({}, out, __component, "36");

  out.w("</body></html>");
}

marko_template._ = marko_renderer(render, {
    ___implicit: true,
    ___type: marko_componentType
  });

marko_template.Component = marko_defineComponent({}, marko_template._);

marko_template.meta = {
    tags: [
      "marko/src/components/taglib/component-globals-tag",
      "marko/src/components/taglib/init-components-tag",
      "marko/src/taglibs/async/await-reorderer-tag"
    ]
  };
