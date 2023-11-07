import {QUnit_Utils} from './QUnit_Utils.js';

QUnit.module('dynamic_cols_rows.html', function(hooks) {

    hooks.before(function (assert) {
        this.qunit_utils = new QUnit_Utils()
    })

    QUnit.test('QUnit_Utils', function (assert) {
        assert.equal(this.qunit_utils.ping(), 'pong')
        assert.equal(QUnit_Utils.prototype.constructor,QUnit_Utils, 'QUnit_Utils.prototype.constructor')
        assert.ok(this.qunit_utils instanceof QUnit_Utils         , "this.qunit_utils instanceof QUnit_Utils")
        const $div = this.qunit_utils.create_div()
        console.log($div)
    })
})