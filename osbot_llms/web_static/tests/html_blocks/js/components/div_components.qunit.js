import Div        from '../../../../src/html_blocks/js/Div.js'
import {div_box}  from '../../../../src/html_blocks/js/components/div_components.js';
import Bootstrap  from '../../../../src/html_blocks/js/libraries/Bootstrap.js'

QUnit.module('div components', function(hooks) {

    QUnit.only('test bootstrap', async (assert)=> {
        assert.expect(0)
        await new Bootstrap().load()

        const div = new Div({id: 'parent', class: 'container-fluid px-5'})
        const row_1 = div.add_div  ({class: 'row'})
        const col_1 = row_1.add_div({class: 'col-3 my-custom-class'})
        const col_2 = row_1.add_div({class: 'col-9 my-custom-class'})
        const row_2 = div.add_div  ({class: 'row'})
        const col_3 = row_1.add_div({class: 'col-12 my-custom-class'})

        div.dom_add_class('my-custom-class', { padding:'12px', backgroundColor: 'lightgreen', color: 'black', border: '2px solid blue'})
        col_1.add_text('...an left text....')
        col_2.add_text('...an right text....')
        col_3.add_text('...an bottom text....')
        div.set_styles({'z-index': 1000, position: 'absolute', top: '100px', color: 'red'})

        div.dom_add()


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