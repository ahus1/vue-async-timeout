const loading = {
    template: "<span>Loading...</span>"
}

const error = {
    template: "<span>Can't load content.</span>",
    methods: {
        reload: function () {
            window.location.reload(true)
        }
    }
}

console.log(import('./mycomponent.js'))

new Vue({
    el: "#app",
    data() {
        const data = {
            timeoutsSet: 0,
            timeoutsTriggered: 0,
            timeoutsCleared: 0
        }

        const oldSetTimeout = window.setTimeout;

        window.setTimeout = function(func, delay) {
            let v = oldSetTimeout(function() {
                ++ data.timeoutsTriggered;
                console.log("timeout triggered: ", v)
                func();
            }, delay);
            console.log("timeout set: ", v)
            ++ data.timeoutsSet;
            return v
        };

        const oldClearTimeout = window.clearTimeout();

        window.clearTimeout = function(id) {
            oldClearTimeout(id);
            console.log("timeout cleared: ", v)
            ++ data.timeoutsCleared;
            return v
        };

        return data
    },
    components: {
        "my-async": () => ({
            // The component to load (should be a Promise)
            component: import('./mycomponent.js'),
            // A component to use while the async component is loading
            loading: loading,
            // A component to use if the load fails
            error: error,
            // Delay before showing the loading component. Default: 200ms.
            delay: 2000,
            // The error component will be displayed if a timeout is
            // provided and exceeded. Default: Infinity.
            timeout: 3000
        })
    }
})