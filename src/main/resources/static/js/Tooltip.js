L.Tooltip = L.Layer.extend({
    options: {
        pane: "popupPane",
        nonBubblingEvents: ["mouseover", "mousemove"],
        position: "left",
        className: "tooltip",
        arrowClass: "tooltip-arrow",
        contentClass: "tooltip-inner",
        subtextClass: "tooltip-subtext",
        showClass: "in",
        noWrap: false,
        wrapScreen: true,
        offset: [10, 5]
    },
    statics: {POSITIONS: {TOP: "top", LEFT: "left", BOTTOM: "bottom", RIGHT: "right"}},
    initialize: function (t, i) {
        this._container = null;
        this._arrow = null;
        this._contentNode = null;
        this._subtext = null;
        L.Util.setOptions(this, t);
        this._source = i
    },
    _initLayout: function () {
        var t = this.options;
        if (t.noWrap) {
            t.className += " nowrap"
        }
        this._container = L.DomUtil.create("div", t.className + " " + t.position + " " + t.showClass);
        this._arrow = L.DomUtil.create("div", t.arrowClass, this._container);
        this._contentNode = L.DomUtil.create("div", t.contentClass, this._container);
        this._subtext = L.DomUtil.create("div", t.subtextClass, this._container)
    },
    onAdd: function (t) {
        this._map = t;
        this._initLayout();
        if (this.options.content) {
            this.setContent(this.options.content)
        }
        this.getPane().appendChild(this._container);
        this._map.on("zoomend", this.updatePosition, this);
        return this
    },
    show: function () {
        L.DomUtil.addClass(this._container, this.options.showClass);
        return this
    },
    hide: function () {
        L.DomUtil.removeClass(this._container, this.options.showClass);
        return this
    },
    onRemove: function (t) {
        L.Util.cancelAnimFrame(this._updateTimer);
        this.getPane().removeChild(this._container);
        this._map.off("zoomend", this.updatePosition, this);
        this._map = null;
        return this
    },
    setContent: function (t) {
        this.options.content = t;
        if (this._map) {
            this._contentNode.innerHTML = t;
            this.updatePosition()
        }
        return this
    },
    setSubtext: function (t) {
        this._subtext.innerHTML = t;
        this.updatePosition();
        return this
    },
    setLatLng: function (t) {
        this._latlng = t;
        this.updatePosition();
        return this
    },
    _getOffset: function (t, i) {
        var o = this._container;
        var n = this.options;
        var s = o.offsetWidth;
        var e = o.offsetHeight;
        var a = L.Tooltip.POSITIONS;
        if (this.options.wrapScreen) {
            var r = this._map.getSize();
            t = this._map.layerPointToContainerPoint(t);
            if (t.x + s / 2 > r.x) {
                i = a.LEFT
            }
            if (t.x - s < 0) {
                i = a.RIGHT
            }
            if (t.y - e < 0) {
                i = a.BOTTOM
            }
            if (t.y + e > r.y) {
                i = a.TOP
            }
        }
        this._container.className = n.className + " " + i + " " + n.showClass;
        var h = n.offset;
        if (i === a.LEFT) {
            return new L.Point(-s - h[0], -e / 2)._floor()
        } else if (i === a.RIGHT) {
            return new L.Point(0 + h[0], -e / 2)._floor()
        } else if (i === a.TOP) {
            return new L.Point(-s / 2, -e - h[1])._floor()
        } else if (i === a.BOTTOM) {
            return new L.Point(-s / 2, 0 + h[1])._floor()
        }
    },
    updatePosition: function (t) {
        this._updateTimer = L.Util.requestAnimFrame(function () {
            if (this._map) {
                t = t || this._map.latLngToLayerPoint(this._latlng);
                L.DomUtil.setPosition(this._container, t.add(this._getOffset(t, this.options.position))._floor())
            }
        }, this)
    }
});
L.tooltip = function (t, i) {
    return new L.Tooltip(t, i)
};