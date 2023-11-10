import QUnit_CSS  from '../../../../src/html_blocks/js/libraries/QUnit.js'
import Bootstrap  from '../../../../src/html_blocks/js/libraries/Bootstrap.js'

QUnit.module('Bootstrap', function(hooks) {

    hooks.before(async function (assert) {
        const result = await new QUnit_CSS().load()
        assert.ok(result)
    })

    QUnit.test('.only',  async function(assert) {
        let initialFontFamily = getComputedStyle(document.body).getPropertyValue('font-family');
        assert.ok(initialFontFamily, 'The body should have an initial font-family');
        const bootstrap = new Bootstrap();
        let isLoaded = await bootstrap.load();
        assert.ok(isLoaded, 'The Bootstrap CSS should be loaded');
        let updatedFontFamily = getComputedStyle(document.body).getPropertyValue('font-family');
        assert.ok(/sans-serif/.test(updatedFontFamily), 'The body font-family should be set to a sans-serif stack by Bootstrap');
        //console.log(initialFontFamily)
        //console.log(updatedFontFamily)

        //todo: fix text below which is not working because the bootstrap css is already loaded at the beginning of this file
        //assert.notEqual(initialFontFamily, updatedFontFamily, 'The font-family should change after loading Bootstrap');

        //todo fix Array.from(links).some query now that bootstrap.min.css is loaded dynamically
        // const bootstrap_url = 'http://localhost:51191/static/lib/bootstrap.min.css'
        // const links = document.head.getElementsByTagName('link');               // Find the link element in the head
        // console.log(links[1].href)
        // let loaded = Array.from(links).some(link =>
        //     link.rel === 'stylesheet' &&
        //     link.href === bootstrap_url
        // );
        // console.log(loaded)
        // assert.ok(loaded, 'The Bootstrap CSS should be loaded');                            // Check that the link element has the correct href
    })

    // QUnit.test('.load_sync', function(assert) {
    //     const done = assert.async();
    //     let initialFontFamily = getComputedStyle(document.body).getPropertyValue('font-family');
    //     assert.ok(initialFontFamily, 'The body should have an initial font-family');
    //
    //     const bootstrap = new Bootstrap();
    //     bootstrap.load((isLoaded) => {
    //         assert.ok(isLoaded, 'Bootstrap should be loaded');
    //         let updatedFontFamily = getComputedStyle(document.body).getPropertyValue('font-family');
    //         assert.ok(/sans-serif/.test(updatedFontFamily), 'The body font-family should be set to a sans-serif stack by Bootstrap');
    //         assert.notEqual(initialFontFamily, updatedFontFamily, 'The font-family should change after loading Bootstrap');
    //
    //         const bootstrap_url = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
    //         const links = document.head.getElementsByTagName('link');               // Find the link element in the head
    //         let loaded = Array.from(links).some(link =>
    //             link.rel === 'stylesheet' &&
    //             link.href === bootstrap_url
    //         );
    //         assert.ok(loaded, 'The Bootstrap CSS should be loaded');                            // Check that the link element has the correct href
    //         done();
    //     });

  //});

})
