let isPhantomJS = (window as any).top.callPhantom != null;


export function getBaselineCorrelationHeaderRanges(guid:String){
    switch (guid){
        case "7a0e1f54-ee21-42a7-ac0e-0770ec84984a":
            return [[{"start":0,"end":1},{"start":0,"end":1},{"start":2,"end":3},{"start":2,"end":3},{"start":4,"end":5},{"start":4,"end":5},{"start":6,"end":7},{"start":6,"end":7},{"start":8,"end":9},{"start":8,"end":9},{"start":10,"end":11},{"start":10,"end":11},{"start":12,"end":13},{"start":12,"end":13},{"start":14,"end":15},{"start":14,"end":15},{"start":16,"end":17},{"start":16,"end":17},{"start":18,"end":19},{"start":18,"end":19},{"start":20,"end":21},{"start":20,"end":21},{"start":22,"end":23},{"start":22,"end":23},{"start":24,"end":25},{"start":24,"end":25},{"start":26,"end":27},{"start":26,"end":27}],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null]]
    }
}


export function getBaselineCorrelationRotations(guid:String)
{
    let baseline = null;

    switch(guid)
    {
        case "7a0e1f54-ee21-42a7-ac0e-0770ec84984a":
            if (isPhantomJS)
                baseline = [{"shouldRotate":false,"width":62},{"shouldRotate":true,"width":76},{"shouldRotate":true,"width":22},{"shouldRotate":true,"width":41},{"shouldRotate":true,"width":117},{"shouldRotate":true,"width":39},{"shouldRotate":true,"width":52},{"shouldRotate":true,"width":72},{"shouldRotate":true,"width":97},{"shouldRotate":true,"width":61}];
            else
                baseline = [{"shouldRotate":false,"width":62},{"shouldRotate":true,"width":84},{"shouldRotate":true,"width":23},{"shouldRotate":true,"width":46},{"shouldRotate":true,"width":123},{"shouldRotate":true,"width":40},{"shouldRotate":true,"width":57},{"shouldRotate":true,"width":80},{"shouldRotate":true,"width":102},{"shouldRotate":true,"width":66}];

    }

    return baseline;
}
