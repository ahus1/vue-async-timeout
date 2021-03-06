const loading = {
    template: "<span>Loading...</span>"
}

const error = {
    template: "<span>Can't load content.</span>",
}

new Vue({
    el: "#app",
    data() {
        const data = {
            timeoutsSet: 0,
            timeoutsTriggered: 0,
            timeoutsCleared: 0
        }

        // instrument timeouts to show what happens behind the scenes

        const oldSetTimeout = window.setTimeout;

        window.setTimeout = function (func, delay) {
            let v = oldSetTimeout(function () {
                ++data.timeoutsTriggered;
                console.log("timeout triggered: ", v)
                func();
            }, delay);
            console.log(`timeout set ${delay}ms`, v)
            ++data.timeoutsSet;
            return v
        };

        const oldClearTimeout = window.clearTimeout;

        window.clearTimeout = function (id) {
            oldClearTimeout(id);
            console.log("timeout cleared: ", id)
            ++data.timeoutsCleared;
        };

        return data
    },
    components: {
        "my-async": () => ({
            // The component to load (should be a Promise)
            // component: import('./mycomponent.js'),
            component: new Promise(function (resolve, reject) {
                setTimeout(function () {
                    // Pass the component definition to the resolve callback
                    resolve(
                        import('./mycomponent.js')
                    )
                }, 2000)
            }),
            // A component to use while the async component is loading
            loading: loading,
            // A component to use if the load fails
            error: error,
            // Delay before showing the loading component. Default: 200ms.
            delay: 1000,
            // The error component will be displayed if a timeout is
            // provided and exceeded. Default: Infinity.
            timeout: 3000
        })
    }
})