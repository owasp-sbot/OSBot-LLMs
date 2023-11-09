export default class QUnit_CSS {

    async load() {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://code.jquery.com/qunit/qunit-2.20.0.css';
            link.onload = () => resolve(true);
            link.onerror = () => reject(new Error('Bootstrap CSS failed to load'));
            document.head.appendChild(link);
        });
    }
}

