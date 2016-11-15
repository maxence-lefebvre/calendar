'use strict';

class RequestPool {

    /**
     *
     * @param items array of items to iterate on
     * @param request async callback to call on each item
     * @param callback called when all requests are completed
     * @param maxNumberOfParallelRequests self explanatory
     */
    static run(items, request, callback, maxNumberOfParallelRequests = 5) {
        var activeConcurrentRequests = 0,
            currentIndex             = 0,
            pendingRequests          = items.length;

        if (pendingRequests === 0) {
            // nothing else to do... items array was empty
            callback && callback();
        }


        const done = () => {
            // we decrement the number of active requests
            activeConcurrentRequests--;
            if (--pendingRequests > 0) {
                // there are still requests awaiting in the queue
                return doRequest();
            }
            // all requests are completed
            return callback && callback();
        };


        function doRequest() {
            // we load up the pool
            while (activeConcurrentRequests < maxNumberOfParallelRequests) {
                request(items[currentIndex++], done);
                activeConcurrentRequests++;
            }
        }

        // we fire the first parallel requests
        doRequest();
    }
}

module.exports = RequestPool;