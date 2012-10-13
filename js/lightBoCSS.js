/* 
 * JavaScript for progressive enhancement of lightbox.  Primarily to prevent
 * aggressive pre-loading of images (default non-JS behaviour).
 */
// wrap everything in an object, avoiding name clashes.
var lightBoCSS = {
    // boolean to denote whether we've attached the lightbox already so we don't do it twice
    lightBoCSSattached: false,
    // constructor
    initialize: function () {
        document.addEventListener('readystatechange', this.attachLightBoCSS, false);
    },
    
    /**
     * Find all our big lightbox "img" elements (.lightboximg > a img) . 
     * swap the img's "alt" and "src" attributes.  Attach the listener that swaps
     * them back (toggleDisplayLightBoCSSImage) to show it.  Attach the listener that 
     * hides it again.  
     */  
    attachLightBoCSS: function() {
        if (!lightBoCSS.lightBoCSSattached) { // only do all this stuff if we haven't already done it.
            var thislightboxdiv,    // refers to a lightbox div within a loop
            thumbnailAnchor,        // refers to an "a" element containing a thumbnail img
            lightboxContainerDiv = document.getElementById("lightbox"), // the conainer div for our lightbox
            thumbnaildivs = this.getElementsByClassName("thumbnails","DIV",lightboxContainerDiv), // array of thumbnail divs.
            lightboxdivs = this.getElementsByClassName("lightboximg","DIV",lightboxContainerDiv); // array of lightboximg (big) divs.
            
            // loop through all the thumbnails, adding the action to swap 
            for (var lbti = 0; lbti < thumbnaildivs.length; lbti++) {
                thislightboxdiv = thumbnaildivs[lbti];
                // loop through child anchor elems.
                var bigAnchorElems = thislightboxdiv.getElementsByTagName("A");
                for (var lbta = 0; lbta < bigAnchorElems.length; lbta++) {
                    thumbnailAnchor = bigAnchorElems[lbta];
                    // swap image back again (to hide) when clicked on
                    lightBoCSS.attachSmallImageClickEvent(thumbnailAnchor);
                }
                
            }


            for (var lbi = 0; lbi < lightboxdivs.length; lbi++) {
                thislightboxdiv = lightboxdivs[lbi];
                // loop through child anchor elems.
                var anchorElems = thislightboxdiv.getElementsByTagName("A");
                for (var lbimg = 0; lbimg < anchorElems.length; lbimg++) {
                    // swap image back again (to hide) when clicked on
                    lightBoCSS.attachBigImageClickEvent(anchorElems[lbimg]);
                }
            }
            // flick the switch so it doesn't happen again
            lightBoCSS.lightBoCSSattached = true;
        }
        
    },
    /**
     * attach a click event to a click on a small-image "a" container.
     * @param {HTMLAnchorElement} thumbnailAnchor - the "a" element that 
     *                              contains the thumbnail.
     */
    attachSmallImageClickEvent: function(thumbnailAnchor) {
        this.attachEvent(thumbnailAnchor,'click', lightBoCSS.smallImageClickHandler);
        
    },
    /**
     * attach a click event to a click on a large-image "a" container.
     * @param {HTMLAnchorElement} anchor - the "a" element that contains the
     *                                      big image.
     */
    attachBigImageClickEvent: function(anchor) {
        this.attachEvent(anchor, 'click', lightBoCSS.bigImageClickHandler);
        
    },
    /**
     * handle a click event on a large image
     * Note that the target may be the large image itself, or the
     * wrapping "a" element.
     */
    bigImageClickHandler: function(event) {
        var bigImgElem; // a reference to the big image element.
        event = event || window.event;  
        var target = event.target || event.srcElement;  
        if (target.nodeName === "A") {
            // OK so target refers to the big image's containing "A" elem.  User
            //   has presumably clicked on the area just outside of the big image. 
            // Get the big img element
            bigImgElem = target.getElementsByTagName("IMG")[0];
        } else if (target.nodeName === "IMG") {
            // user has clicked directly on the big image.
            bigImgElem = target;
        }
        // swap the data-lightbox and src attributes to display the big image.
        lightBoCSS.toggleDisplayLightBoCSSImage(bigImgElem);
    },
    /**
     * handle a click event on a small image.
     * Note that the target may be the small image itself, or on the
     * wrapping "a" element.
     */
    smallImageClickHandler: function(event) {
        // a small image has been clicked on.  Find out which one.
        event = event || window.event;  
        var target = event.target || event.srcElement;  
        if (target.nodeName === "IMG") {
            // OK so target refers to the small image itself.
            // get its parent "A" element
            var aElem = target.parentElement;
            // find the ID of the target big image's parent "A" element.
            var bigImgAnchorID = aElem.href.replace(/^[^#]+#/,"");
            var bigImgAnchorElem = document.getElementById(bigImgAnchorID);
            // get the big img element
            var bigImgElem = bigImgAnchorElem.getElementsByTagName("IMG")[0];
            // swap the data-lightbox and src attributes to display the big image.
            lightBoCSS.toggleDisplayLightBoCSSImage(bigImgElem);
        }
    },
    /**
     * Event listener, invoked when a lightbox image is to be loaded.  Swap the "alt"
     * and "src" attributes back (because we swapped them before).
     * @param {HTMLImageElement} imgElement - the DOM element for the img to be loaded. 
     */
    toggleDisplayLightBoCSSImage: function(imgElement) {
        try {
            if (!imgElement.lightbox)
                throw new Error('dummy');
        } catch (e) {
            imgElement.lightbox = imgElement.getAttribute("data-lightbox");
        }
        var temp = imgElement.src;
        imgElement.src = imgElement.lightbox;
        imgElement.lightbox = temp;
    },
    /**
     * Cross-browser event-handler registration.
     * From: http://www.sitepoint.com/javascript-this-event-handlers/
     * 
     */
    attachEvent: function (element, type, handler) {  
        if (element.addEventListener) element.addEventListener(type, handler, false);  
        else element.attachEvent("on"+type, handler);  
    } ,
  
    /*
	Developed by Robert Nyman, http://www.robertnyman.com
	Code/licensing: http://code.google.com/p/getelementsbyclassname/
     */	
    getElementsByClassName : function (className, tag, elm){
        if (document.getElementsByClassName) {
            getElementsByClassName = function (className, tag, elm) {
                elm = elm || document;
                var elements = elm.getElementsByClassName(className),
                nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
                returnElements = [],
                current;
                for(var i=0, il=elements.length; i<il; i+=1){
                    current = elements[i];
                    if(!nodeName || nodeName.test(current.nodeName)) {
                        returnElements.push(current);
                    }
                }
                return returnElements;
            };
        }
        else if (document.evaluate) {
            getElementsByClassName = function (className, tag, elm) {
                tag = tag || "*";
                elm = elm || document;
                var classes = className.split(" "),
                classesToCheck = "",
                xhtmlNamespace = "http://www.w3.org/1999/xhtml",
                namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
                returnElements = [],
                elements,
                node;
                for(var j=0, jl=classes.length; j<jl; j+=1){
                    classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
                }
                try	{
                    elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
                }
                catch (e) {
                    elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
                }
                while ((node = elements.iterateNext())) {
                    returnElements.push(node);
                }
                return returnElements;
            };
        }
        else {
            getElementsByClassName = function (className, tag, elm) {
                tag = tag || "*";
                elm = elm || document;
                var classes = className.split(" "),
                classesToCheck = [],
                elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
                current,
                returnElements = [],
                match;
                for(var k=0, kl=classes.length; k<kl; k+=1){
                    classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
                }
                for(var l=0, ll=elements.length; l<ll; l+=1){
                    current = elements[l];
                    match = false;
                    for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
                        match = classesToCheck[m].test(current.className);
                        if (!match) {
                            break;
                        }
                    }
                    if (match) {
                        returnElements.push(current);
                    }
                }
                return returnElements;
            };
        }
        return getElementsByClassName(className, tag, elm);
    }
}
// now we've set it all up.  Make it all happen.
lightBoCSS.initialize();
