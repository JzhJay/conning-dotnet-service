/*!
    *
    * Wijmo Library 5.20212.812
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    *
    * Licensed under the GrapeCity Commercial License.
    * sales@wijmo.com
    * wijmo.com/products/wijmo-5/license/
    *
    */


    module wijmo.chart.webgl {
    'use strict';

// polygon triangulation from
// https://github.com/mapbox/earcut

export class _EarCut {
   
  earcut(data, holeIndices = null, dim = null) : number[] {

    dim = dim || 2;

    var hasHoles = holeIndices && holeIndices.length,
        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
        outerNode = this.linkedList(data, 0, outerLen, dim, true),
        triangles = [];

    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

    var minX, minY, maxX, maxY, x, y, invSize;

    if (hasHoles) outerNode = this.eliminateHoles(data, holeIndices, outerNode, dim);

    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
    if (data.length > 80 * dim) {
        minX = maxX = data[0];
        minY = maxY = data[1];

        for (var i = dim; i < outerLen; i += dim) {
            x = data[i];
            y = data[i + 1];
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }

        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
        invSize = Math.max(maxX - minX, maxY - minY);
        invSize = invSize !== 0 ? 1 / invSize : 0;
    }

    this.earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

    return triangles;
}

// create a circular doubly linked list from polygon points in the specified winding order
private linkedList(data, start, end, dim, clockwise) {
    var i, last;

    if (clockwise === (this.signedArea(data, start, end, dim) > 0)) {
        for (i = start; i < end; i += dim) last = this.insertNode(i, data[i], data[i + 1], last);
    } else {
        for (i = end - dim; i >= start; i -= dim) last = this.insertNode(i, data[i], data[i + 1], last);
    }

    if (last && this.equals(last, last.next)) {
        this.removeNode(last);
        last = last.next;
    }

    return last;
}

// eliminate colinear or duplicate points
private filterPoints(start, end=null) {
    if (!start) return start;
    if (!end) end = start;

    var p = start,
        again;
    do {
        again = false;

        if (!p.steiner && (this.equals(p, p.next) || this.area(p.prev, p, p.next) === 0)) {
            this.removeNode(p);
            p = end = p.prev;
            if (p === p.next) break;
            again = true;

        } else {
            p = p.next;
        }
    } while (again || p !== end);

    return end;
}

// main ear slicing loop which triangulates a polygon (given as a linked list)
private earcutLinked(ear, triangles, dim, minX, minY, invSize, pass = null) {
    if (!ear) return;

    // interlink polygon nodes in z-order
    if (!pass && invSize) this.indexCurve(ear, minX, minY, invSize);

    var stop = ear,
        prev, next;

    // iterate through ears, slicing them one by one
    while (ear.prev !== ear.next) {
        prev = ear.prev;
        next = ear.next;

        if (invSize ? this.isEarHashed(ear, minX, minY, invSize) : this.isEar(ear)) {
            // cut off the triangle
            triangles.push(prev.i / dim);
            triangles.push(ear.i / dim);
            triangles.push(next.i / dim);

            this.removeNode(ear);

            // skipping the next vertex leads to less sliver triangles
            ear = next.next;
            stop = next.next;

            continue;
        }

        ear = next;

        // if we looped through the whole remaining polygon and can't find any more ears
        if (ear === stop) {
            // try filtering points and slicing again
            if (!pass) {
                this.earcutLinked(this.filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

            // if this didn't work, try curing all small self-intersections locally
            } else if (pass === 1) {
                ear = this.cureLocalIntersections(this.filterPoints(ear), triangles, dim);
                this.earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

            // as a last resort, try splitting the remaining polygon into two
            } else if (pass === 2) {
                this.splitEarcut(ear, triangles, dim, minX, minY, invSize);
            }

            break;
        }
    }
}

// check whether a polygon node forms a valid ear with adjacent nodes
private isEar(ear) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (this.area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // now make sure we don't have other points inside the potential ear
    var p = ear.next.next;

    while (p !== ear.prev) {
        if (this.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
        this.area(p.prev, p, p.next) >= 0) return false;
        p = p.next;
    }

    return true;
}

private isEarHashed(ear, minX, minY, invSize) {
    var a = ear.prev,
        b = ear,
        c = ear.next;

    if (this.area(a, b, c) >= 0) return false; // reflex, can't be an ear

    // triangle bbox; min & max are calculated like this for speed
    var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
        minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
        maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
        maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

    // z-order range for the current triangle bbox;
    var minZ = this.zOrder(minTX, minTY, minX, minY, invSize),
        maxZ = this.zOrder(maxTX, maxTY, minX, minY, invSize);

    var p = ear.prevZ,
        n = ear.nextZ;

    // look for points inside the triangle in both directions
    while (p && p.z >= minZ && n && n.z <= maxZ) {
        if (p !== ear.prev && p !== ear.next &&
            this.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            this.area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;

        if (n !== ear.prev && n !== ear.next &&
            this.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            this.area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    // look for remaining points in decreasing z-order
    while (p && p.z >= minZ) {
        if (p !== ear.prev && p !== ear.next &&
            this.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
            this.area(p.prev, p, p.next) >= 0) return false;
        p = p.prevZ;
    }

    // look for remaining points in increasing z-order
    while (n && n.z <= maxZ) {
        if (n !== ear.prev && n !== ear.next &&
            this.pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
            this.area(n.prev, n, n.next) >= 0) return false;
        n = n.nextZ;
    }

    return true;
}

// go through all polygon nodes and cure small local self-intersections
private cureLocalIntersections(start, triangles, dim) {
    var p = start;
    do {
        var a = p.prev,
            b = p.next.next;

        if (!this.equals(a, b) && this.intersects(a, p, p.next, b) && this.locallyInside(a, b) && this.locallyInside(b, a)) {

            triangles.push(a.i / dim);
            triangles.push(p.i / dim);
            triangles.push(b.i / dim);

            // remove two nodes involved
            this.removeNode(p);
            this.removeNode(p.next);

            p = start = b;
        }
        p = p.next;
    } while (p !== start);

    return this.filterPoints(p);
}

// try splitting polygon into two and triangulate them independently
private splitEarcut(start, triangles, dim, minX, minY, invSize) {
    // look for a valid diagonal that divides the polygon into two
    var a = start;
    do {
        var b = a.next.next;
        while (b !== a.prev) {
            if (a.i !== b.i && this.isValidDiagonal(a, b)) {
                // split the polygon in two by the diagonal
                var c = this.splitPolygon(a, b);

                // filter colinear points around the cuts
                a = this.filterPoints(a, a.next);
                c = this.filterPoints(c, c.next);

                // run earcut on each half
                this.earcutLinked(a, triangles, dim, minX, minY, invSize);
                this.earcutLinked(c, triangles, dim, minX, minY, invSize);
                return;
            }
            b = b.next;
        }
        a = a.next;
    } while (a !== start);
}

// link every hole into the outer loop, producing a single-ring polygon without holes
private eliminateHoles(data, holeIndices, outerNode, dim) {
    var queue = [],
        i, len, start, end, list;

    for (i = 0, len = holeIndices.length; i < len; i++) {
        start = holeIndices[i] * dim;
        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
        list = this.linkedList(data, start, end, dim, false);
        if (list === list.next) list.steiner = true;
        queue.push(this.getLeftmost(list));
    }

    queue.sort(this.compareX);

    // process holes from left to right
    for (i = 0; i < queue.length; i++) {
        this.eliminateHole(queue[i], outerNode);
        outerNode = this.filterPoints(outerNode, outerNode.next);
    }

    return outerNode;
}

private compareX(a, b) {
    return a.x - b.x;
}

// find a bridge between vertices that connects hole with an outer ring and and link it
private eliminateHole(hole, outerNode) {
    outerNode = this.findHoleBridge(hole, outerNode);
    if (outerNode) {
        var b = this.splitPolygon(outerNode, hole);

        // filter collinear points around the cuts
        this.filterPoints(outerNode, outerNode.next);
        this.filterPoints(b, b.next);
    }
}

// David Eberly's algorithm for finding a bridge between hole and outer polygon
private findHoleBridge(hole, outerNode) {
    var p = outerNode,
        hx = hole.x,
        hy = hole.y,
        qx = -Infinity,
        m;

    // find a segment intersected by a ray from the hole's leftmost point to the left;
    // segment's endpoint with lesser x will be potential connection point
    do {
        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
            if (x <= hx && x > qx) {
                qx = x;
                if (x === hx) {
                    if (hy === p.y) return p;
                    if (hy === p.next.y) return p.next;
                }
                m = p.x < p.next.x ? p : p.next;
            }
        }
        p = p.next;
    } while (p !== outerNode);

    if (!m) return null;

    if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

    // look for points inside the triangle of hole point, segment intersection and endpoint;
    // if there are no points found, we have a valid connection;
    // otherwise choose the point of the minimum angle with the ray as connection point

    var stop = m,
        mx = m.x,
        my = m.y,
        tanMin = Infinity,
        tan;

    p = m;

    do {
        if (hx >= p.x && p.x >= mx && hx !== p.x &&
            this.pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

            if (this.locallyInside(p, hole) &&
                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && this.sectorContainsSector(m, p)))))) {
                m = p;
                tanMin = tan;
            }
        }

        p = p.next;
    } while (p !== stop);

    return m;
}

// whether sector in vertex m contains sector in vertex p in the same coordinates
private sectorContainsSector(m, p) {
    return this.area(m.prev, m, p.prev) < 0 && this.area(p.next, m, m.next) < 0;
}

// interlink polygon nodes in z-order
private indexCurve(start, minX, minY, invSize) {
    var p = start;
    do {
        if (p.z === null) p.z = this.zOrder(p.x, p.y, minX, minY, invSize);
        p.prevZ = p.prev;
        p.nextZ = p.next;
        p = p.next;
    } while (p !== start);

    p.prevZ.nextZ = null;
    p.prevZ = null;

    this.sortLinked(p);
}

// Simon Tatham's linked list merge sort algorithm
// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
private sortLinked(list) {
    var i, p, q, e, tail, numMerges, pSize, qSize,
        inSize = 1;

    do {
        p = list;
        list = null;
        tail = null;
        numMerges = 0;

        while (p) {
            numMerges++;
            q = p;
            pSize = 0;
            for (i = 0; i < inSize; i++) {
                pSize++;
                q = q.nextZ;
                if (!q) break;
            }
            qSize = inSize;

            while (pSize > 0 || (qSize > 0 && q)) {

                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                    e = p;
                    p = p.nextZ;
                    pSize--;
                } else {
                    e = q;
                    q = q.nextZ;
                    qSize--;
                }

                if (tail) tail.nextZ = e;
                else list = e;

                e.prevZ = tail;
                tail = e;
            }

            p = q;
        }

        tail.nextZ = null;
        inSize *= 2;

    } while (numMerges > 1);

    return list;
}

// z-order of a point given coords and inverse of the longer side of data bbox
private zOrder(x, y, minX, minY, invSize) {
    // coords are transformed into non-negative 15-bit integer range
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;

    x = (x | (x << 8)) & 0x00FF00FF;
    x = (x | (x << 4)) & 0x0F0F0F0F;
    x = (x | (x << 2)) & 0x33333333;
    x = (x | (x << 1)) & 0x55555555;

    y = (y | (y << 8)) & 0x00FF00FF;
    y = (y | (y << 4)) & 0x0F0F0F0F;
    y = (y | (y << 2)) & 0x33333333;
    y = (y | (y << 1)) & 0x55555555;

    return x | (y << 1);
}

// find the leftmost node of a polygon ring
private getLeftmost(start) {
    var p = start,
        leftmost = start;
    do {
        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
        p = p.next;
    } while (p !== start);

    return leftmost;
}

// check if a point lies within a convex triangle
private pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
    return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
           (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
           (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
}

// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
private isValidDiagonal(a, b) {
    return a.next.i !== b.i && a.prev.i !== b.i && !this.intersectsPolygon(a, b) && // dones't intersect other edges
           (this.locallyInside(a, b) && this.locallyInside(b, a) && this.middleInside(a, b) && // locally visible
            (this.area(a.prev, a, b.prev) || this.area(a, b.prev, b)) || // does not create opposite-facing sectors
            this.equals(a, b) && this.area(a.prev, a, a.next) > 0 && this.area(b.prev, b, b.next) > 0); // special zero-length case
}

// signed area of a triangle
private area(p, q, r) {
    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
}

// check if two points are equal
private equals(p1, p2) {
    return p1.x === p2.x && p1.y === p2.y;
}

// check if two segments intersect
private intersects(p1, q1, p2, q2) {
    var o1 = this.sign(this.area(p1, q1, p2));
    var o2 = this.sign(this.area(p1, q1, q2));
    var o3 = this.sign(this.area(p2, q2, p1));
    var o4 = this.sign(this.area(p2, q2, q1));

    if (o1 !== o2 && o3 !== o4) return true; // general case

    if (o1 === 0 && this.onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
    if (o2 === 0 && this.onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
    if (o3 === 0 && this.onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
    if (o4 === 0 && this.onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

    return false;
}

// for collinear points p, q, r, check if point q lies on segment pr
private onSegment(p, q, r) {
    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
}

private sign(num) {
    return num > 0 ? 1 : num < 0 ? -1 : 0;
}

// check if a polygon diagonal intersects any polygon segments
private intersectsPolygon(a, b) {
    var p = a;
    do {
        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
            this.intersects(p, p.next, a, b)) return true;
        p = p.next;
    } while (p !== a);

    return false;
}

// check if a polygon diagonal is locally inside the polygon
private locallyInside(a, b) {
    return this.area(a.prev, a, a.next) < 0 ?
    this.area(a, b, a.next) >= 0 && this.area(a, a.prev, b) >= 0 :
    this.area(a, b, a.prev) < 0 || this.area(a, a.next, b) < 0;
}

// check if the middle point of a polygon diagonal is inside the polygon
private middleInside(a, b) {
    var p = a,
        inside = false,
        px = (a.x + b.x) / 2,
        py = (a.y + b.y) / 2;
    do {
        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
            inside = !inside;
        p = p.next;
    } while (p !== a);

    return inside;
}

// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
// if one belongs to the outer ring and another to a hole, it merges it into a single ring
private splitPolygon(a, b) {
    var a2 = new Node(a.i, a.x, a.y),
        b2 = new Node(b.i, b.x, b.y),
        an = a.next,
        bp = b.prev;

    a.next = b;
    b.prev = a;

    a2.next = an;
    an.prev = a2;

    b2.next = a2;
    a2.prev = b2;

    bp.next = b2;
    b2.prev = bp;

    return b2;
}

// create a node and optionally link it with previous one (in a circular doubly linked list)
private insertNode(i, x, y, last) {
    var p = new Node(i, x, y);

    if (!last) {
        p.prev = p;
        p.next = p;

    } else {
        p.next = last.next;
        p.prev = last;
        last.next.prev = p;
        last.next = p;
    }
    return p;
}

private removeNode(p) {
    p.next.prev = p.prev;
    p.prev.next = p.next;

    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
}

// return a percentage difference between the polygon area and its triangulation area;
// used to verify correctness of triangulation
private deviation(data, holeIndices, dim, triangles) {
    var hasHoles = holeIndices && holeIndices.length;
    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

    var polygonArea = Math.abs(this.signedArea(data, 0, outerLen, dim));
    if (hasHoles) {
        for (var i = 0, len = holeIndices.length; i < len; i++) {
            var start = holeIndices[i] * dim;
            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            polygonArea -= Math.abs(this.signedArea(data, start, end, dim));
        }
    }

    var trianglesArea = 0;
    for (i = 0; i < triangles.length; i += 3) {
        var a = triangles[i] * dim;
        var b = triangles[i + 1] * dim;
        var c = triangles[i + 2] * dim;
        trianglesArea += Math.abs(
            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
    }

    return polygonArea === 0 && trianglesArea === 0 ? 0 :
        Math.abs((trianglesArea - polygonArea) / polygonArea);
};

private signedArea(data, start, end, dim) {
    var sum = 0;
    for (var i = start, j = end - dim; i < end; i += dim) {
        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
        j = i;
    }
    return sum;
}

// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
private flatten(data) {
    var dim = data[0][0].length,
        result = {vertices: [], holes: [], dimensions: dim},
        holeIndex = 0;

    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
        }
        if (i > 0) {
            holeIndex += data[i - 1].length;
            result.holes.push(holeIndex);
        }
    }
    return result;
};
}

class Node {
    i:number;
    x:number;
    y:number;
    z:any;
    prev:Node;
    next:Node;
    prevZ:Node;
    nextZ:Node;

    steiner:boolean;

    constructor(i, x, y) {
    // vertex index in coordinates array
    this.i = i;

    // vertex coordinates
    this.x = x;
    this.y = y;

    // previous and next vertex nodes in a polygon ring
    this.prev = null;
    this.next = null;

    // z-order curve value
    this.z = null;

    // previous and next nodes in z-order
    this.prevZ = null;
    this.nextZ = null;

    // indicates whether this is a steiner point
    this.steiner = false;
    }
}
    }
    


    module wijmo.chart.webgl {
    





/**
 * High performance rendering engine for a {@link FlexChart} control.
 * 
 * To enable WebGL rendering on a {@link FlexChart} control, 
 * set <b>renderEngine<b> property of {@link FlexChart} to
 * an instance of the {@link WebGLRenderEngine}. For example:
 *```typescript
 * import { FlexChart } from '@grapecity/wijmo.chart';
 * import { WebGLRenderEngine } from '@grapecity/wijmo.chart.webgl';
 * let flexChart = new FlexChart('#theGrid'); // create the chart
 * flexChart.renderEngine = new WebGLRenderEngine(); // set the render engine
 * ```
 */
export class WebGLRenderEngine extends wijmo.chart._SvgRenderEngine {
    private static svgns = 'http://www.w3.org/2000/svg';

    canvas: HTMLCanvasElement;
    foCanvas: SVGForeignObjectElement;

    private gl: any;

    private rdraw: _GLDrawRect;
    private edraw: _GLDrawEllipse;
    private pdraw: _GLDrawPoints;
    private ldraw: _GLDrawLines;
    private adraw: _GLDrawAreas;

    private primitives: Array<_GLDrawBase> = [];

    private isIE: boolean;
    useSvg: boolean;

    private clipRects: any = {};

    constructor(el?: HTMLElement) {
        super(el);
        this.init();
    }

    beginRender() {
        super.beginRender();

        if (this.isIE) {
            this.element.appendChild(this.canvas);
        } else {
            this.element.appendChild(this.foCanvas);
        }

        let gl = this.gl;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.enable(gl.BLEND);

        //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        this.primitives.forEach((draw) => draw.beginRender());
        this.clipRects = {};
    }

    setViewportSize(w: number, h: number) {
        super.setViewportSize(w, h);

        if (this.foCanvas) {
            this.foCanvas.setAttribute('width', w.toString());
            this.foCanvas.setAttribute('height', h.toString());
        }

        let gl = this.gl;
        gl.canvas.width = w;
        gl.canvas.height = h;

        //this.resize(gl.canvas);
    }

    endRender() {
        this.primitives.forEach((draw) => draw.endRender());
        super.endRender();

        if (this.isIE) {
            let img = document.createElementNS(WebGLRenderEngine.svgns, 'image');
            img.setAttribute('width', this.gl.canvas.width);
            img.setAttribute('height', this.gl.canvas.height);
            img.setAttribute('href', this.canvas.toDataURL());
            this.element.appendChild(img);
            if (this.canvas.parentNode == this.element) {
                this.element.removeChild(this.canvas);
            }
        }
    }

    drawEllipse(cx: number, cy: number, rx: number, ry: number, className?: string, style?: any): SVGElement {
        if (this.useSvg) {
            return super.drawEllipse(cx, cy, rx, ry, className, style);
        } else {
            this.edraw.drawEllipse(new wijmo.Rect(cx - rx, cy - ry, 2 * rx, 2 * ry), this.fill);
            return null;
        }
    }

    drawRect(x: number, y: number, w: number, h: number, className?: string, style?: any, clipPath?: string): SVGElement {
        if ((<any>this)._groupCls == 'wj-plot-area' || this.useSvg) {
            return super.drawRect(x, y, w, h, className, style, clipPath);
        } else {
            this.rdraw.drawRect(new wijmo.Rect(x, y, w, h), this.fill);
            //this.pdraw.drawPoint(new core.Point(x + 0.5 * w, y + 0.5 * h), this.fill);
            return null;
        }
    }

    drawLines(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string, num?: number): SVGElement {
        this.ldraw.drawLines(xs, ys, num, this.stroke, clipPath ? this.clipRects[clipPath] : null);
        return null;
    }

    drawPolygon(xs: number[], ys: number[], className?: string, style?: any, clipPath?: string): SVGElement {
        if (this.useSvg) {
            return super.drawPolygon(xs, ys, className, style, clipPath);
        } else {
            this.adraw.drawPolygon(xs, ys, this.fill, clipPath ? this.clipRects[clipPath] : null);
        }
        return null;
    }

    addClipRect(clipRect: wijmo.Rect, id: string) {
        super.addClipRect(clipRect, id);
        if (clipRect && id) {
            this.clipRects[id] = clipRect;
        }
    }

    private init() {
        this.canvas = document.createElement('canvas');

        this.gl = this.canvas.getContext('webgl', { preserveDrawingBuffer: true});

        if (!this.gl) {
            this.gl = this.canvas.getContext('experimental-webgl');
            this.isIE = true;
            this.canvas.setAttribute('style', 'visibility:hidden;position:absolute;top:-1000px;margin:0px;padding:0px;border:none');
        } else {
            this.canvas.setAttribute('style', 'margin:0px;padding:0px;border:none');
            let bodyCanvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
            bodyCanvas.setAttribute('style', 'margin:0px;padding:0px;border:none');
            this.foCanvas = document.createElementNS(WebGLRenderEngine.svgns, 'foreignObject') as SVGForeignObjectElement;
            bodyCanvas.appendChild(this.canvas);
            this.foCanvas.appendChild(bodyCanvas);
        }

        this.rdraw = new _GLDrawRect(this.gl);
        this.edraw = new _GLDrawEllipse(this.gl);
        //this.pdraw = new _GLDrawPoints(this.gl);
        this.ldraw = new _GLDrawLines(this.gl);
        this.adraw = new _GLDrawAreas(this.gl);

        this.primitives.push(this.rdraw, this.edraw, /*this.pdraw,*/ this.ldraw, this.adraw);
    }

    // resize(canvas) {
    //     var cssToRealPixels = /*window.devicePixelRatio ||*/ 1;

    //     var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    //     var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);

    //     if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    //         canvas.width = displayWidth;
    //         canvas.height = displayHeight;
    //     }
    // }
}

class _GLDrawBase {
    gl: any;
    shaderProgram: any;
    colorLocation: any;
    positionAttributeLocation: any;
    resolutionUniformLocation: any;
    positionBuffer: any;

    constructor(gl: any) {
        this.gl = gl;
    }

    init() {
        let gl = this.gl;

        this.shaderProgram = this.initShaderProgram(this.vsSource, this.fsSource);

        this.positionAttributeLocation = gl.getAttribLocation(this.shaderProgram, "a_position");
        this.resolutionUniformLocation = gl.getUniformLocation(this.shaderProgram, "u_resolution");

        this.colorLocation = gl.getUniformLocation(this.shaderProgram, "u_color");

        gl.useProgram(this.shaderProgram);
        this.positionBuffer = gl.createBuffer();
    }

    beginRender() {
        let gl = this.gl;

        gl.useProgram(this.shaderProgram);
        gl.uniform2f(this.resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    }

    endRender() {
        this.flush();
    }

    flush() {
    }

    initShaderProgram(vsSource, fsSource) {
        let gl = this.gl;
        const vertexShader = this.loadShader(gl.VERTEX_SHADER, vsSource);
        const fragmentShader = this.loadShader(gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
            return null;
        }

        return shaderProgram;
    }

    loadShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);

        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    get vsSource(): string {
        return this._vsSource;
    }

    private _vsSource = `
    attribute vec2 a_position;
    
    uniform vec2 u_resolution;
    
    void main() {
      vec2 zeroToOne = a_position / u_resolution;
      vec2 zeroToTwo = zeroToOne * 2.0;
      vec2 clipSpace = zeroToTwo - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    }
    `;

    get fsSource(): string {
        return this._fsSource;
    }

    private _fsSource = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
      gl_FragColor = u_color;
    }
    `;
}

class _GLDrawRect extends _GLDrawBase {
    BUFFER_SIZE = 10000;
    bufRects: Array<wijmo.Rect> = [];
    bufLen = 0;
    previousFill: string;
    buffer: Float32Array;

    constructor(gl: any) {
        super(gl);
        this.init();
    }

    private initBuffers() {
        if (!this.buffer) {
            let gl = this.gl;

            this.buffer = new Float32Array(12 * this.BUFFER_SIZE);
            this.bufRects = new Array(this.BUFFER_SIZE);

            gl.enableVertexAttribArray(this.positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            gl.bufferData(gl.ARRAY_BUFFER, this.buffer.length * 4, gl.DYNAMIC_DRAW);
        }
    }

    drawRect(r: wijmo.Rect, fill: string) {
        this.initBuffers();

        if (fill !== this.previousFill) {
            this.flush();
            this.previousFill = fill;
        }

        this.bufRects[this.bufLen++] = r;

        if (this.bufLen >= this.BUFFER_SIZE) {
            this.flush();
        }
    }

    flush() {
        if (this.bufLen == 0) {
            return;
        }

        let gl = this.gl;
        gl.useProgram(this.shaderProgram);

        let clr = new wijmo.Color(this.previousFill);
        gl.uniform4f(this.colorLocation, clr.r / 255, clr.g / 255, clr.b / 255, clr.a);

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        this.setData();

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.bufLen * 6);
        this.bufLen = 0;
    }

    setData() {
        let gl = this.gl;
        let len = this.bufLen;
        let data = this.buffer;// new Float32Array(12 * len);
        for (let i = 0; i < len; i++) {
            let rect = this.bufRects[i];
            let x1 = rect.left;
            let x2 = rect.right;
            let y1 = rect.top;
            let y2 = rect.bottom;
            let off = i * 12;
            data[off] = x1;
            data[off + 1] = y1;
            data[off + 2] = x2;
            data[off + 3] = y1;
            data[off + 4] = x1;
            data[off + 5] = y2;
            data[off + 6] = x1;
            data[off + 7] = y2;
            data[off + 8] = x2;
            data[off + 9] = y1;
            data[off + 10] = x2;
            data[off + 11] = y2;
        }
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data.subarray(0, 12 * len));
    }
}

class _GLDrawEllipse extends _GLDrawBase {
    NTRIANGLES = 12;
    BUFFER_SIZE = 10000;
    bufRects: Array<wijmo.Rect> = new Array(this.BUFFER_SIZE);
    bufLen = 0;
    previousFill: string;
    data: Float32Array;
    sin1 = new Float32Array(this.NTRIANGLES);
    sin2 = new Float32Array(this.NTRIANGLES);
    cos1 = new Float32Array(this.NTRIANGLES);
    cos2 = new Float32Array(this.NTRIANGLES);

    constructor(gl: any) {
        super(gl);
        this.data = new Float32Array(this.BUFFER_SIZE * this.NTRIANGLES * 6);

        let da = 2 * Math.PI / this.NTRIANGLES;
        for (let i = 0; i < this.NTRIANGLES; i++) {
            let a = da * i;
            this.sin1[i] = Math.sin(a);
            this.cos1[i] = Math.cos(a);
            this.sin2[i] = Math.sin(a + da);
            this.cos2[i] = Math.cos(a + da);
        }
        this.init();
        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.bufferData(gl.ARRAY_BUFFER, this.data.length * 4, gl.DYNAMIC_DRAW);
    }

    drawEllipse(r: wijmo.Rect, fill: string) {
        if (fill !== this.previousFill) {
            this.flush();
            this.previousFill = fill;
        }

        this.bufRects[this.bufLen++] = r;

        if (this.bufLen >= this.BUFFER_SIZE) {
            this.flush();
        }
    }

    flush() {
        if (this.bufLen == 0) {
            return;
        }

        let gl = this.gl;
        gl.useProgram(this.shaderProgram);

        let clr = new wijmo.Color(this.previousFill);
        gl.uniform4f(this.colorLocation, clr.r / 255, clr.g / 255, clr.b / 255, clr.a);// > 0 ? 1 : 0);

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        this.setData();

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, this.bufLen * this.NTRIANGLES * 3);
        this.bufLen = 0;
    }

    setData() {
        let gl = this.gl;
        let len = this.bufLen;
        let data = this.data;

        let off = 0;
        for (let i = 0; i < len; i++) {
            let rect = this.bufRects[i];
            let rx = 0.5 * rect.width;
            let ry = 0.5 * rect.height;
            let cx = rect.left + rx;
            let cy = rect.top + ry;
            for (let j = 0; j < this.NTRIANGLES; j++) {
                off = 6 * (i * this.NTRIANGLES + j);
                data[off] = cx;
                data[off + 1] = cy;
                data[off + 2] = cx + rx * this.sin1[j];
                data[off + 3] = cy + ry * this.cos1[j];
                data[off + 4] = cx + rx * this.sin2[j];
                data[off + 5] = cy + ry * this.cos2[j];
            }
        }
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, data.subarray(0, off + 6));
    }
}

class _GLDrawPoints extends _GLDrawBase {
    BUFFER_SIZE = 100000;
    buffer: Float32Array;
    bufferLen = 0;
    previousFill: string;

    constructor(gl: any) {
        super(gl);
        this.init();

    }

    private initBuffers() {
        if (!this.buffer) {
            let gl = this.gl;

            this.buffer = new Float32Array(this.BUFFER_SIZE);

            gl.enableVertexAttribArray(this.positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            gl.bufferData(gl.ARRAY_BUFFER, this.buffer.length * 4, gl.DYNAMIC_DRAW);
        }
    }

    drawPoint(pt: wijmo.Point, fill: string) {
        this.initBuffers();

        if (fill !== this.previousFill) {
            this.flush();
            this.previousFill = fill;
        }

        this.buffer[this.bufferLen++] = pt.x;
        this.buffer[this.bufferLen++] = pt.y;

        if (this.bufferLen >= this.BUFFER_SIZE) {
            this.flush();
        }
    }

    flush() {
        if (this.bufferLen == 0) {
            return;
        }

        let gl = this.gl;
        gl.useProgram(this.shaderProgram);

        let clr = new wijmo.Color(this.previousFill);
        gl.uniform4f(this.colorLocation, clr.r / 255, clr.g / 255, clr.b / 255, clr.a > 0 ? 1 : 0);

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.subarray(0, this.bufferLen));

        gl.drawArrays(gl.POINTS, 0, this.bufferLen / 2);
        this.bufferLen = 0;
    }

    get vsSource(): string {
        return this._vsSource1;
    }

    private _vsSource1 = `
    attribute vec2 a_position;
    uniform vec2 u_resolution;
    void main() {
      vec2 zeroToOne = a_position / u_resolution;
      vec2 zeroToTwo = zeroToOne * 2.0;
      vec2 clipSpace = zeroToTwo - 1.0;
      gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
      gl_PointSize = 5.0;
    }
    `;
}

class _GLDrawLines extends _GLDrawBase {
    // todo npoints > buffer size

    BUFFER_SIZE = 1000000;
    buffer: Float32Array;

    constructor(gl: any) {
        super(gl);
        this.init();
    }

    private initBuffers() {
        if (!this.buffer) {
            let gl = this.gl;
            this.buffer = new Float32Array(4 * this.BUFFER_SIZE);

            gl.enableVertexAttribArray(this.positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            gl.bufferData(gl.ARRAY_BUFFER, this.buffer.length * 4, gl.DYNAMIC_DRAW);
        }
    }

    drawLines(x: number[], y: number[], num: number, stroke: string, clipRect: wijmo.Rect = null) {
        this.initBuffers();

        let len = num ? num : x.length;

        let gl = this.gl;
        gl.useProgram(this.shaderProgram);

        if (clipRect) {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(clipRect.left, gl.canvas.height - clipRect.bottom, clipRect.width + 1, clipRect.height + 1);
        }

        let clr = new wijmo.Color(stroke);
        gl.uniform4f(this.colorLocation, clr.r / 255, clr.g / 255, clr.b / 255, clr.a > 0 ? 1 : 0);

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        for (let i = 0; i < len; i++) {
            this.buffer[2 * i] = x[i];
            this.buffer[2 * i + 1] = y[i];
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.subarray(0, len * 2));

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.LINE_STRIP, 0, len);

        if (clipRect) {
            gl.disable(gl.SCISSOR_TEST);
        }
    }
}

class _GLDrawAreas extends _GLDrawBase {
    // todo npoints > buffer size
    earcut = new _EarCut();
    BUFFER_SIZE = 1000000;
    buffer: Float32Array;

    constructor(gl: any) {
        super(gl);
        this.init();
    }

    private initBuffers() {
        if (!this.buffer) {
            let gl = this.gl;
            this.buffer = new Float32Array(4 * this.BUFFER_SIZE);

            gl.enableVertexAttribArray(this.positionAttributeLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
            gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            gl.bufferData(gl.ARRAY_BUFFER, this.buffer.length * 4, gl.DYNAMIC_DRAW);
        }
    }

    drawPolygon(x: number[], y: number[], fill: string, clipRect: wijmo.Rect = null) {
        this.initBuffers();
        let len = x.length;

        let data = [];
        for (let i = 0; i < len; i++) {
            data.push(x[i]);
            data.push(y[i]);
        }

        let triangles = this.earcut.earcut(data);

        let gl = this.gl;
        gl.useProgram(this.shaderProgram);

        if (clipRect) {
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(clipRect.left, gl.canvas.height - clipRect.bottom, clipRect.width, clipRect.height);
        }

        let clr = new wijmo.Color(fill);
        gl.uniform4f(this.colorLocation, clr.r / 255, clr.g / 255, clr.b / 255, clr.a > 0 ? 1 : 0);

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        let j = 0;
        for (let i = 0; i < triangles.length; i++) {
            this.buffer[j++] = data[2 * triangles[i]];
            this.buffer[j++] = data[2 * triangles[i] + 1];
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.buffer.subarray(0, j));

        gl.enableVertexAttribArray(this.positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(this.positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLES, 0, triangles.length);

        if (clipRect) {
            gl.disable(gl.SCISSOR_TEST);
        }
    }
}
    }
    


    module wijmo.chart.webgl {
    // Entry file. All real code files should be re-exported from here.


wijmo._registerModule('wijmo.chart.webgl', wijmo.chart.webgl);



    }
    