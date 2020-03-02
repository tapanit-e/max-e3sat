(function () {

    'use strict';

    // instance is in dimacs format
    const Sat = function (instance) {

        this.instance = instance;
    
        this.solve();

    };

    Sat.prototype.solve = function() {

        let a = new Set();
        let lits = new Set();

        for (let i = 0; i < this.instance.length; i++) {

            let c = this.instance[i];

            for (let j = 0; j < c.length; j++) {

                lits.add(Math.abs(c[j]));

            }

        }

        for (let lit of lits) {

            if (Math.random() > Math.random()) {

                a.add(lit);

            } else {

                a.add(-lit);

            }

        }

        let count = this.clauses(a);

        console.log('r: ' + (this.instance.length - count));

    };

    Sat.prototype.clauses = function(a) {

        let count = 0;

        outer:
        for (let i = 0; i < this.instance.length; i++) {

            let c = this.instance[i];

            for (let j = 0; j < c.length; j++) {

                if (a.has(c[j])) {

                    count++;
                    continue outer;

                }

            }

        }

        return count;

    };
   

    if (module && module.exports)
        module.exports = Sat;
    else
        window.Sat = Sat;

})();
