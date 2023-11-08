import Bootstrap  from '../../../../src/html_blocks/js/libraries/Bootstrap.js'

QUnit.module('Bootstrap', function() {

    QUnit.test('.load', function(assert) {
        const done = assert.async();
        let initialFontFamily = getComputedStyle(document.body).getPropertyValue('font-family');
        assert.ok(initialFontFamily, 'The body should have an initial font-family');

        const bootstrap = new Bootstrap();
        bootstrap.load((isLoaded) => {
            assert.ok(isLoaded, 'Bootstrap should be loaded');
            let updatedFontFamily = getComputedStyle(document.body).getPropertyValue('font-family');
            assert.ok(/sans-serif/.test(updatedFontFamily), 'The body font-family should be set to a sans-serif stack by Bootstrap');
            assert.notEqual(initialFontFamily, updatedFontFamily, 'The font-family should change after loading Bootstrap');

            const bootstrap_url = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css'
            const links = document.head.getElementsByTagName('link');               // Find the link element in the head
            let loaded = Array.from(links).some(link =>
                link.rel === 'stylesheet' &&
                link.href === bootstrap_url
            );
            assert.ok(loaded, 'The Bootstrap CSS should be loaded');                            // Check that the link element has the correct href
            done();
        });

  });

})
