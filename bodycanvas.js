// JavaScript Document
//Fake nodes class
(function ($) {
    $.fn.nodemaxtrix = function (options) {
        //------------------------------
        return this.each(function () {
            //---------------------------------------------------------------------------
            //default settings
            var settings = {
                'fadealpha': '0.1',
                'nodeslimit': '100',
                'minsatellite': '1',
                'maxsatellite': '15',
                'effectiveRadius': '100',
                'color': 'black',
                'dotcolor': 'black',
                'repeat': 'false'
            };
            // If options exist, merge them with default settings
            if (options) {
                $.extend(settings, options);
            }
            //----------------------------------------------------------------------------
            //set the canvas dimension                    
            //                    this.width = $("body").width();
            //                    this.height = $(window).height() - 20;
            //-----------------------------------------------------------------------------
            //nodes tracking
            var nodesCollection;
            //nodes counting
            var nodesCounting = 0;
            //Canvas info
            var canvasWidth = this.width;
            var canvasHeigth = this.height;
            //Canvas context                    
            var canvasContext = this.getContext("2d");
            var currentNode;
            //Timeout-count
            var tmoCount = -1; ;
            //
            var ID = this.id;
            var doomDay = 0;
            //-------------------------------------------------------------------------------------  
            //clean timeout   
            main();
            function main() {
                //init function
                canvasContext.clearRect(0, 0, canvasWidth, canvasHeigth);
                nodesCollection = new Array();
                nodesCounting = 0;
                //cleantime out
                if (tmoCount != -1) {
                    for (i = 0; i < tmoCount; i++) {
                        clearTimeout($(ID).data(i.toString() + "d"));
                        clearTimeout($(ID).data(i.toString() + "clear"));
                        clearTimeout($(ID).data(i.toString() + "circle"));
                        //                                clearTimeout($("body").data(i.toString() + "save"));
                        //                                clearTimeout($("body").data(i.toString() + "restore"));
                    }
                    tmoCount = -1;
                }
                var n = 0;
                //perform genaration of node-system                    
                new node(null);
                nodesCounting++;
                var originOfTheTree = 0;
                while (nodesCounting < settings.nodeslimit) {
                    j = nodesCollection[originOfTheTree].satelliteNodeID.length;
                    for (k = 0; k < j; k++) {
                        if (nodesCounting < settings.nodeslimit) {
                            new node(originOfTheTree);
                            nodesCounting++;
                            originOfTheTree++;
                        }
                    }
                }
                //Drawing graphic
                n = 0;
                for (i = 0; i < nodesCollection.length; i++) {
                    for (j = 0; j < nodesCollection[i].satellite; j++) {
                        if (nodesCollection[i].satelliteNodeID[j] < settings.nodeslimit) {
                            x = setTimeout(draw, i * 41, i, j);
                            $(ID).data(n.toString() + "d", x);
                            if ((n % 5) == 0) {
                                x = setTimeout(clear, i * 120 + 200);
                                $(ID).data(n.toString() + "clear", x);
                            }
                        }
                        n++;
                    }
                }
                if (settings.repeat == "true") self.setTimeout(main, 41 * nodesCollection.length + 41);
                tmoCount = n;
            };
            //Draw function
            function clear() {
                canvasContext.fillStyle = "rgba(255,255,255," + settings.fadealpha + ")";
                canvasContext.fillRect(0, 0, canvasWidth, canvasHeigth);
            }
            function drawcircle(_x, _y, radius, rgba) {
                canvasContext.beginPath();
                canvasContext.arc(_x, _y, radius, 0, Math.PI * 2, true);
                canvasContext.closePath();
                canvasContext.fillStyle = rgba;
                canvasContext.fill();
            }
            function draw(nodeID, satelliteID) {
                //node glow
                for (i = 0; i < 10; i++) {
                    k = setTimeout(drawcircle, i * 40, nodesCollection[nodesCollection[nodeID].satelliteNodeID[satelliteID]].x, nodesCollection[nodesCollection[nodeID].satelliteNodeID[satelliteID]].y, Math.random() * Math.random() * Math.random() * 50, settings.dotcolor);
                    $(ID).data(i.toString() + "circle", k);
                }
                //----------------------------------------
                canvasContext.beginPath();
                canvasContext.moveTo(nodesCollection[nodeID].x, nodesCollection[nodeID].y);
                canvasContext.lineTo(nodesCollection[nodesCollection[nodeID].satelliteNodeID[satelliteID]].x, nodesCollection[nodesCollection[nodeID].satelliteNodeID[satelliteID]].y);
                canvasContext.lineWidth = 0.8;
                canvasContext.strokeStyle = settings.color;
                canvasContext.stroke();
            }
            function fade(nodeID, satelliteID) {
                canvasContext.beginPath();
                canvasContext.moveTo(nodesCollection[nodeID].x, nodesCollection[nodeID].y);
                canvasContext.lineTo(nodesCollection[nodesCollection[nodeID].satelliteNodeID[satelliteID]].x, nodesCollection[nodesCollection[nodeID].satelliteNodeID[satelliteID]].y);
                canvasContext.lineWidth = 0.5;
                canvasContext.strokeStyle = "white";
                canvasContext.stroke();
            }

            //-------------------------------------------------------------------------------------
            //node class
            function node(originNodeID) {
                //set the node origin
                this.originNodeID = originNodeID;
                //put this node into tracking array
                nodesCollection[nodesCounting] = this;
                //set this node's number of satellies
                this.satellite = parseInt(settings.minsatellite) + Math.floor(Math.random() * Math.random() * (settings.maxsatellite - settings.minsatellite));
                if (this.originNodeID == null) {

                    //if this is starting node, random its position inside canvas
                    this.x = Math.floor(Math.random() * canvasWidth);
                    this.y = Math.floor(Math.random() * canvasHeigth);
                } else {
                    //else random its position inside effectiveRadius
                    do {
                        this.x = (nodesCollection[originNodeID].x - settings.effectiveRadius) + Math.floor(Math.random() * settings.effectiveRadius * 2);
                        this.y = (nodesCollection[originNodeID].y - settings.effectiveRadius) + Math.floor(Math.random() * settings.effectiveRadius * 2);
                    } while ((this.y < 0) || (this.x < 0) || (this.x > canvasWidth) || (this.y > canvasHeigth));
                }
                //genarate satellite nodes,therefore create the nodes system.
                this.satelliteNodeID = new Array(this.satellite);
                for (i = 0; i < this.satellite; i++) {
                    this.satelliteNodeID[i] = nodesCounting + i + 1;
                }
            }
            //------------------------------------------------------------------------------------
        });
    };
})(jQuery);
//
