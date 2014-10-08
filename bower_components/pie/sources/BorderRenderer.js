/**
 * Renderer for element borders.
 * @constructor
 * @param {Element} el The target element
 * @param {Object} styleInfos The StyleInfo objects
 * @param {PIE.RootRenderer} parent
 */
PIE.BorderRenderer = PIE.RendererBase.newRenderer( {

    boxZIndex: 4,
    boxName: 'border',

    needsUpdate: function() {
        var si = this.styleInfos;
        return si.borderInfo.changed() || si.borderRadiusInfo.changed();
    },

    isActive: function() {
        var si = this.styleInfos;
        return si.borderRadiusInfo.isActive() &&
               !si.borderImageInfo.isActive() &&
               si.borderInfo.isActive(); //check BorderStyleInfo last because it's the most expensive
    },

    /**
     * Draw the border shape(s)
     */
    draw: function() {
        var el = this.targetElement,
            props = this.styleInfos.borderInfo.getProps(),
            bounds = this.boundsInfo.getBounds(),
            w = bounds.w,
            h = bounds.h,
            shape, stroke, s,
            segments, seg, i, len;

        if( props ) {
            this.hideBorder();

            segments = this.getBorderSegments( 2 );
            for( i = 0, len = segments.length; i < len; i++) {
                seg = segments[i];
                shape = this.getShape( 'borderPiece' + i, seg.stroke ? 'stroke' : 'fill', this.getBox() );
                shape.coordsize = w * 2 + ',' + h * 2;
                shape.coordorigin = '1,1';
                shape.path = seg.path;
                s = shape.style;
                s.width = w;
                s.height = h;

                shape.filled = !!seg.fill;
                shape.stroked = !!seg.stroke;
                if( seg.stroke ) {
                    stroke = shape.stroke;
                    stroke['weight'] = seg.weight + 'px';
                    stroke.color = seg.color.colorValue( el );
                    stroke['dashstyle'] = seg.stroke === 'dashed' ? '2 2' : seg.stroke === 'dotted' ? '1 1' : 'solid';
                    stroke['linestyle'] = seg.stroke === 'double' && seg.weight > 2 ? 'ThinThin' : 'Single';
                } else {
                    shape.fill.color = seg.fill.colorValue( el );
                }
            }

            // remove any previously-created border shapes which didn't get used above
            while( this.deleteShape( 'borderPiece' + i++ ) ) {}
        }
    },


    /**
     * Get the VML path definitions for the border segment(s).
     * @param {number=} mult If specified, all coordinates will be multiplied by this number
     * @return {Array.<string>}
     */
    getBorderSegments: function( mult ) {
        var el = this.targetElement,
            bounds, elW, elH,
            borderInfo = this.styleInfos.borderInfo,
            segments = [],
            floor, ceil, wT, wR, wB, wL,
            round = Math.round,
            borderProps, radiusInfo, radii, widths, styles, colors;

        if( borderInfo.isActive() ) {
            borderProps = borderInfo.getProps();

            widths = borderProps.widths;
            styles = borderProps.styles;
            colors = borderProps.colors;

            if( borderProps.widthsSame && borderProps.stylesSame && borderProps.colorsSame ) {
                if( colors['t'].alpha() > 0 ) {
                    // shortcut for identical border on all sides - only need 1 stroked shape
                    wT = widths['t'].pixels( el ); //thickness
                    wR = wT / 2; //shrink
                    segments.push( {
                        path: this.getBoxPath( { t: wR, r: wR, b: wR, l: wR }, mult ),
                        stroke: styles['t'],
                        color: colors['t'],
                        weight: wT
                    } );
                }
            }
            else {
                mult = mult || 1;
                bounds = this.boundsInfo.getBounds();
                elW = bounds.w;
                elH = bounds.h;

                wT = round( widths['t'].pixels( el ) );
                wR = round( widths['r'].pixels( el ) );
                wB = round( widths['b'].pixels( el ) );
                wL = round( widths['l'].pixels( el ) );
                var pxWidths = {
                    't': wT,
                    'r': wR,
                    'b': wB,
                    'l': wL
                };

                radiusInfo = this.styleInfos.borderRadiusInfo;
                if( radiusInfo.isActive() ) {
                    radii = this.getRadiiPixels( radiusInfo.getProps() );
                }

                floor = Math.floor;
                ceil = Math.ceil;

                function radius( xy, corner ) {
                    return radii ? radii[ xy ][ corner ] : 0;
                }

                function curve( corner, shrinkX, shrinkY, startAngle, ccw, doMove ) {
                    var rx = radius( 'x', corner),
                        ry = radius( 'y', corner),
                        deg = 65535,
                        isRight = corner.charAt( 1 ) === 'r',
                        isBottom = corner.charAt( 0 ) === 'b';
                    return ( rx > 0 && ry > 0 ) ?
                                ( doMove ? 'al' : 'ae' ) +
                                ( isRight ? ceil( elW - rx ) : floor( rx ) ) * mult + ',' + // center x
                                ( isBottom ? ceil( elH - ry ) : floor( ry ) ) * mult + ',' + // center y
                                ( floor( rx ) - shrinkX ) * mult + ',' + // width
                                ( floor( ry ) - shrinkY ) * mult + ',' + // height
                                ( startAngle * deg ) + ',' + // start angle
                                ( 45 * deg * ( ccw ? 1 : -1 ) // angle change
                            ) : (
                                ( doMove ? 'm' : 'l' ) +
                                ( isRight ? elW - shrinkX : shrinkX ) * mult + ',' +
                                ( isBottom ? elH - shrinkY : shrinkY ) * mult
                            );
                }

                function line( side, shrink, ccw, doMove ) {
                    var
                        start = (
                            side === 't' ?
                                floor( radius( 'x', 'tl') ) * mult + ',' + ceil( shrink ) * mult :
                            side === 'r' ?
                                ceil( elW - shrink ) * mult + ',' + floor( radius( 'y', 'tr') ) * mult :
                            side === 'b' ?
                                ceil( elW - radius( 'x', 'br') ) * mult + ',' + floor( elH - shrink ) * mult :
                            // side === 'l' ?
                                floor( shrink ) * mult + ',' + ceil( elH - radius( 'y', 'bl') ) * mult
                        ),
                        end = (
                            side === 't' ?
                                ceil( elW - radius( 'x', 'tr') ) * mult + ',' + ceil( shrink ) * mult :
                            side === 'r' ?
                                ceil( elW - shrink ) * mult + ',' + ceil( elH - radius( 'y', 'br') ) * mult :
                            side === 'b' ?
                                floor( radius( 'x', 'bl') ) * mult + ',' + floor( elH - shrink ) * mult :
                            // side === 'l' ?
                                floor( shrink ) * mult + ',' + floor( radius( 'y', 'tl') ) * mult
                        );
                    return ccw ? ( doMove ? 'm' + end : '' ) + 'l' + start :
                                 ( doMove ? 'm' + start : '' ) + 'l' + end;
                }


                function addSide( side, sideBefore, sideAfter, cornerBefore, cornerAfter, baseAngle ) {
                    var vert = side === 'l' || side === 'r',
                        sideW = pxWidths[ side ],
                        beforeX, beforeY, afterX, afterY;

                    if( sideW > 0 && styles[ side ] !== 'none' && colors[ side ].alpha() > 0 ) {
                        beforeX = pxWidths[ vert ? side : sideBefore ];
                        beforeY = pxWidths[ vert ? sideBefore : side ];
                        afterX = pxWidths[ vert ? side : sideAfter ];
                        afterY = pxWidths[ vert ? sideAfter : side ];

                        if( styles[ side ] === 'dashed' || styles[ side ] === 'dotted' ) {
                            segments.push( {
                                path: curve( cornerBefore, beforeX, beforeY, baseAngle + 45, 0, 1 ) +
                                      curve( cornerBefore, 0, 0, baseAngle, 1, 0 ),
                                fill: colors[ side ]
                            } );
                            segments.push( {
                                path: line( side, sideW / 2, 0, 1 ),
                                stroke: styles[ side ],
                                weight: sideW,
                                color: colors[ side ]
                            } );
                            segments.push( {
                                path: curve( cornerAfter, afterX, afterY, baseAngle, 0, 1 ) +
                                      curve( cornerAfter, 0, 0, baseAngle - 45, 1, 0 ),
                                fill: colors[ side ]
                            } );
                        }
                        else {
                            segments.push( {
                                path: curve( cornerBefore, beforeX, beforeY, baseAngle + 45, 0, 1 ) +
                                      line( side, sideW, 0, 0 ) +
                                      curve( cornerAfter, afterX, afterY, baseAngle, 0, 0 ) +

                                      ( styles[ side ] === 'double' && sideW > 2 ?
                                              curve( cornerAfter, afterX - floor( afterX / 3 ), afterY - floor( afterY / 3 ), baseAngle - 45, 1, 0 ) +
                                              line( side, ceil( sideW / 3 * 2 ), 1, 0 ) +
                                              curve( cornerBefore, beforeX - floor( beforeX / 3 ), beforeY - floor( beforeY / 3 ), baseAngle, 1, 0 ) +
                                              'x ' +
                                              curve( cornerBefore, floor( beforeX / 3 ), floor( beforeY / 3 ), baseAngle + 45, 0, 1 ) +
                                              line( side, floor( sideW / 3 ), 1, 0 ) +
                                              curve( cornerAfter, floor( afterX / 3 ), floor( afterY / 3 ), baseAngle, 0, 0 )
                                          : '' ) +

                                      curve( cornerAfter, 0, 0, baseAngle - 45, 1, 0 ) +
                                      line( side, 0, 1, 0 ) +
                                      curve( cornerBefore, 0, 0, baseAngle, 1, 0 ),
                                fill: colors[ side ]
                            } );
                        }
                    }
                }

                addSide( 't', 'l', 'r', 'tl', 'tr', 90 );
                addSide( 'r', 't', 'b', 'tr', 'br', 0 );
                addSide( 'b', 'r', 'l', 'br', 'bl', -90 );
                addSide( 'l', 'b', 't', 'bl', 'tl', -180 );
            }
        }

        return segments;
    },

    destroy: function() {
        var me = this;
        if (me.finalized || !me.styleInfos.borderImageInfo.isActive()) {
            me.targetElement.runtimeStyle.borderColor = '';
        }
        PIE.RendererBase.destroy.call( me );
    }


} );
