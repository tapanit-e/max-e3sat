(function () {

    'use strict';

    // instance is in dimacs format
    const Sat = function (instance) {

        this.instance = instance;
    
        this.solve();

    };

    Sat.prototype.solve = function() {

        let copy = JSON.parse(JSON.stringify(this.instance));

        this.literals = new Set();

        for (let i = 0; i < this.instance.length; i++)
            for (let j = 0; j < this.instance[i].length; j++)
                this.literals.add(Math.abs(this.instance[i][j]));

        
        this.a = new Set();

        for (let lit of this.literals) {

            let temp = null;

            let pos = lit;
            let neg = -lit;

            let f = this.SATClauses(pos);
            let s = this.SATClauses(neg);

            let t = this.SATClauses(pos);
            let fo = this.SATClauses2(neg);

            let eq = ((f + t - s) / (t - fo));

            if (eq <= 0) {

                temp = neg;

            } else if (eq >= 1) {

                temp = pos;

            } else {
                
                if (Math.random() > eq) {

                    temp = neg;

                } else {

                    temp = pos;

                }

            }

            this.a.add(temp);

            for (let i = 0; i < this.instance.length; i++) {

                for (let j = this.instance[i].length - 1; j >= 0; j--)
                    if (this.instance[i][j] === temp) {

                        this.instance[i].splice(j, 1);

                    }

            }

        }

        this.instance = copy;

        let sat = this.getSATClauses(this.a);

        console.log('r: ' + (this.instance.length - sat));

    };

    Sat.prototype.getSATClauses = function(a) {

        let count = 0;

        outer:
        for (let i = 0; i < this.instance.length; i++) 
            for (let j = 0; j < this.instance[i].length; j++) {

                if (a.has(this.instance[i][j])) {
                    count++;
                    continue outer;

                }

            }

        return count;

    };

    Sat.prototype.SATClauses = function(lit) {

        let sat = 0;
        let unsat = 0;

        for (let i = 0; i < this.instance.length; i++) {

            let set = new Set(this.instance[i]);

            if (set.has(lit))
                sat++;

        }

        for (let i = 0; i < this.instance.length; i++) {

            let set = new Set(this.instance);

            if (set.size === 1 && set.has(-lit))
                unsat++;

        }

        return sat + unsat;

    };

    Sat.prototype.SATClauses2 = function(lit) {

        let sat = 0;
        let non = 0;

        for (let i = 0; i < this.instance.length; i++) {

            let set = new Set(this.instance[i]);

            if (set.has(lit))
                sat++;

        }

        for (let i = 0; i < this.instance.length; i++) {

            let set = new Set(this.instance);

            if (set.size > 1 || ! set.has(-lit))
                non++;

        }

        return sat + non;

    };
   

    if (module && module.exports)
        module.exports = Sat;
    else
        window.Sat = Sat;

})();
