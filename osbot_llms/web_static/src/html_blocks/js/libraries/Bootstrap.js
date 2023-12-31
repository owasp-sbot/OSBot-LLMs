export default class Bootstrap {

    async load() {
        return new Promise((resolve, reject) => {
            if (document.location.href.includes('OSBot-LLMs/osbot_llms')) {             // todo: find better way to support these variation between wallaby and pycharm webserver
                var virtual_path =  '../../../../lib/'
            } else {
                var virtual_path = '/static/lib/'
            }
            const link = document.createElement('link');
            link.rel     = 'stylesheet';
            link.href    = `${virtual_path}bootstrap.min.css`;
            link.onload  = () => resolve(true);
            link.onerror = () => reject(new Error('Bootstrap CSS failed to load'));
            document.head.appendChild(link);
        });
    }

    load_sync(callback) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/static/lib/bootstrap.min.css';
        link.onload = () => callback(true); // Call callback with true when loaded
        link.onerror = () => callback(false); // Call callback with false on error
        document.head.appendChild(link);
    }
}

