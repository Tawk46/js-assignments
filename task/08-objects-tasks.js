'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width,
    this.height = height,

    this.getArea = function() {
        return this.width * this.height;
    }    
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    throw new Error('Not implemented');
    
    let protoObj = new proto.constructor;
    let objFromJSON = JSON.parse(json);
    let resObj = Object.assign(protoObj, objFromJSON)

    return resObj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelectorBuilder {
    constructor() {}
    
    checkPropExistence(propName) {
        if(this[propName]) {
            throw "Element, id and pseudo-element should not occur more then one time inside the selector";    
        }
    }

    checkOrder(currElemLvl, prevElemLvl) {
        if (currElemLvl < prevElemLvl) {
            throw "Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element";    
        }
    }

    element(value) {
        this.checkPropExistence("_element");
        let newObj = new CssSelectorBuilder;
        Object.assign(newObj, this);
        newObj._element = value;

        Object.defineProperty(newObj, "lastElemLvl", { value: 1 });
        this.checkOrder(newObj.lastElemLvl, this.lastElemLvl);
        
        return newObj;
    }

    id(value) {
        this.checkPropExistence("_id");
        let newObj = new CssSelectorBuilder;
        Object.assign(newObj, this);
        newObj._id = '#' + value;

        Object.defineProperty(newObj, "lastElemLvl", { value: 2 });
        this.checkOrder(newObj.lastElemLvl, this.lastElemLvl);
        
        return newObj;
    }

    class(value) {
        let newObj = new CssSelectorBuilder;
        Object.assign(newObj, this);

        if (!newObj._class) {
            newObj._class = [];
        }

        newObj._class.push('.' + value);

        Object.defineProperty(newObj, "lastElemLvl", { value: 3 });
        this.checkOrder(newObj.lastElemLvl, this.lastElemLvl);
        
        return newObj;
    }

    attr(value) {
        let newObj = new CssSelectorBuilder;
        Object.assign(newObj, this);

        if (!newObj._attr) {
            newObj._attr = [];
        }

        newObj._attr.push('[' + value + ']');

        Object.defineProperty(newObj, "lastElemLvl", { value: 4 });
        this.checkOrder(newObj.lastElemLvl, this.lastElemLvl);
       
        return newObj;
    }

    pseudoClass(value) {
        let newObj = new CssSelectorBuilder;
        Object.assign(newObj, this);

        if (!newObj._pseudoClass) {
            newObj._pseudoClass = [];
        }

        newObj._pseudoClass.push(':' + value);

        Object.defineProperty(newObj, "lastElemLvl", { value: 5 });
        this.checkOrder(newObj.lastElemLvl, this.lastElemLvl);
        
        return newObj;
    }

    pseudoElement(value) {
        this.checkPropExistence("_pseudoElement");
        let newObj = new CssSelectorBuilder;
        Object.assign(newObj, this);
        newObj._pseudoElement = '::' + value;
        
        Object.defineProperty(newObj, "lastElemLvl", { value: 6 });
        this.checkOrder(newObj.lastElemLvl, this.lastElemLvl);
        
        return newObj;
    }

    combine(selector1, combinator, selector2) {
        const combined = new CssSelectorBuilder;
        combined._combinedStr = selector1.stringify() + ' ' + combinator + ' ' + selector2.stringify();
        
        return combined;
    }

    stringify() {
        let res = '';

        for (let prop in this) {
            if (prop == '_class' || prop == '_attr' || prop == '_pseudoClass') {
                res += this[prop].join('');
            } else {
                res += this[prop];
            }

            delete this[prop];
        }

        return res;
    }
}

const cssSelectorBuilder = new CssSelectorBuilder;


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};