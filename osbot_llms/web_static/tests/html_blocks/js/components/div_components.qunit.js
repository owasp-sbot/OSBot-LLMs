import {div_box} from '../../../../src/html_blocks/js/components/div_components.js';



QUnit.module('Bootstrap', function(hooks) {

    QUnit.test('test jquery load', (assert)=>{
        //var done = assert.async()
        assert.expect(0)
        //console.log($)
        window.div_box = div_box
    })

    QUnit.test('div_box', (assert)=>{
        assert.ok (typeof div_box === 'function')
        const div = div_box()
        assert.equal(div.dom().style.border,'5px solid blue')
        assert.ok(true, 'first assert')
        assert.equal(div.dom_remove(),true )
        assert.equal(div.dom_remove(),false)
    })

});


// import('https://code.jquery.com/jquery-3.6.0.min.js')
        //     .then(jQuery => {
        //         console.log($)
        //         console.log('jQuery dynamically loaded within module script block', jQuery);
        //         done()
        //     })
        //     .catch(error => {
        //         console.error('Error loading jQuery', error);
        //     });