export default class Bootstrap {

    async load() {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
            link.onload = () => resolve(true);
            link.onerror = () => reject(new Error('Bootstrap CSS failed to load'));
            document.head.appendChild(link);
        });
    }

    load_sync(callback) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
        link.onload = () => callback(true); // Call callback with true when loaded
        link.onerror = () => callback(false); // Call callback with false on error
        document.head.appendChild(link);
    }
}

