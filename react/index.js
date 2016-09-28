/**
 * Created by smedina on 9/28/16.
 */

"use strict";

var eventEmitter = new EventEmitter();

var Calculadora = React.createClass({
    displayName: "Calculadora",
    render: function render() {
        return React.createElement(
            "main",
            { className: "react-calculator" },
            React.createElement(CampoInput, null),
            React.createElement(MemoriaTotal, null),
            React.createElement(BotonSetNumeros, null),
            React.createElement(BotonSetFunciones, null),
            React.createElement(BotonSetEcuaciones, null)
        );
    }
});

var Boton = React.createClass({
    displayName: "Boton",
    _handleClick: function _handleClick() {
        var text = this.props.text,
            cb = this.props.clickHandler;

        if (cb) {
            cb.call(null, text);
        }
    },
    render: function render() {
        return React.createElement(
            "button",
            { className: this.props.klass, onClick: this._handleClick },
            React.createElement(
                "span",
                { className: "title" },
                this.props.text
            )
        );
    }
});

var ContenidoEditable = React.createClass({
    displayName: "ContenidoEditable",
    _handleClick: function _handleClick() {
        var cb = this.props.clickHandler;

        if (cb) {
            cb.call(this);
        }
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "editable-field", contentEditable: this.props.initEdit, spellcheck: this.props.spellCheck, onClick: this._handleClick },
            this.props.text
        );
    }
});

var CampoInput = React.createClass({
    displayName: "CampoInput",
    _updateField: function _updateField(newStr) {
        newStr = newStr.split ? newStr.split(' ').reverse().join(' ') : newStr;
        return this.setState({ text: newStr });
    },
    getInitialState: function getInitialState() {
        this.props.text = this.props.text || '0';

        return { text: this.props.text };
    },
    componentWillMount: function componentWillMount() {
        eventEmitter.addListener('numberCruncher', this._updateField);
    },
    render: function render() {
        return React.createElement(ContenidoEditable, { text: this.state.text, initEdit: "false", spellcheck: "false", clickHandler: this._clickBait });
    }
});

var MemoriaTotal = React.createClass({
    displayName: "MemoriaTotal",
    _toggleMemories: function _toggleMemories() {
        this.setState({ show: !this.state.show });
    },
    _recallMemory: function _recallMemory(memory) {
        almacenamiento.nuevoInput = memory;
        eventEmitter.emitEvent('toggle-memories');
    },
    getInitialState: function getInitialState() {
        return { show: false };
    },
    componentWillMount: function componentWillMount() {
        eventEmitter.addListener('toggle-memories', this._toggleMemories);
    },
    render: function render() {
        var _this = this;

        var classNames = "memory-bank " + (this.state.show ? 'visible' : '');

        return React.createElement(
            "section",
            { className: classNames },
            React.createElement(Boton, { text: "+", clickHandler: this._toggleMemories, klass: "toggle-close" }),
            almacenamiento.curMemories.map(function (mem) {
                return React.createElement(Boton, { klass: "block memory transparent", text: mem, clickHandler: _this._recallMemory });
            })
        );
    }
});

var BotonSetFunciones = React.createClass({
    displayName: "BotonSetFunciones",
    mostrarMemoria: function _showMemoryBank() {
        eventEmitter.emitEvent('toggle-memories');
    },
    limpiar: function _clear() {
        almacenamiento.nuevoInput = 0;
    },
    contenidoLimpio: function _contentClear() {
        var curInput = String(almacenamiento.curInput),
            lessOne = curInput.substring(0, curInput.length - 1);

        return almacenamiento.nuevoInput = lessOne === '' ? 0 : lessOne;
    },
    render: function render() {
        return React.createElement(
            "section",
            { className: "button-set--functions" },
            React.createElement(Boton, { text: "Memoria", clickHandler: this.mostrarMemoria }),
            React.createElement(Boton, { text: "Limpiar", clickHandler: this.limpiar }),
            React.createElement(Boton, { text: "←", clickHandler: this.contenidoLimpio })
        );
    }
});

var BotonSetEcuaciones = React.createClass({
    displayName: "BotonSetEcuaciones",
    ecuacion: function _eq(type) {
        almacenamiento.nuevoInput = almacenamiento.curInput + " " + type + " ";
    },
    igual: function _equate() {
        almacenamiento.nuevoInput = eval(almacenamiento.curInput);
    },
    render: function render() {
        return React.createElement(
            "section",
            { className: "button-set--equations" },
            React.createElement(Boton, { text: "+", clickHandler: this.ecuacion }),
            React.createElement(Boton, { text: "-", clickHandler: this.ecuacion }),
            React.createElement(Boton, { text: "*", clickHandler: this.ecuacion }),
            React.createElement(Boton, { text: "/", clickHandler: this.ecuacion }),
            React.createElement(Boton, { text: "%", clickHandler: this.ecuacion }),
            React.createElement(Boton, { text: "=", clickHandler: this.igual })
        );
    }
});

var BotonSetNumeros = React.createClass({
    displayName: "BotonSetNumeros",
    numero: function _number(num) {
        if (!almacenamiento.curInput) {
            return almacenamiento.nuevoInput = num;
        }

        return almacenamiento.nuevoInput = "" + almacenamiento.curInput + num;
    },
    render: function render() {
        return React.createElement(
            "section",
            { className: "button-set--numbers" },
            React.createElement(Boton, { text: "1", clickHandler: this.numero }),
            React.createElement(Boton, { text: "2", clickHandler: this.numero }),
            React.createElement(Boton, { text: "3", clickHandler: this.numero }),
            React.createElement(Boton, { text: "4", clickHandler: this.numero }),
            React.createElement(Boton, { text: "5", clickHandler: this.numero }),
            React.createElement(Boton, { text: "6", clickHandler: this.numero }),
            React.createElement(Boton, { text: "7", clickHandler: this.numero }),
            React.createElement(Boton, { text: "8", clickHandler: this.numero }),
            React.createElement(Boton, { text: "9", clickHandler: this.numero }),
            React.createElement(Boton, { text: "0", clickHandler: this.numero })
        );
    }
});

var almacenamiento = {
    input: 0,
    memory: [],
    get curInput() {
        return this.input;
    },

    get curMemories() {
        return this.memory.filter(function (m) {
            return m !== undefined;
        });
    },

    set commitMemory(input) {
        this.memory.push(input);
    },

    set nuevoInput(str) {
        var curInput = str,
            oldInput = this.curInput;

        if (this.curMemories.indexOf(oldInput) === -1) {
            this.commitMemory = oldInput;
        }

        this.input = curInput;
        eventEmitter.emitEvent('numberCruncher', [this.curInput]);
    }
};

React.render(React.createElement(Calculadora, null), document.querySelector('body'));