(function () {

    'use strict';

    // instance is in dimacs format
    const Sat = function (instance, alpha, div, s) {

        this.alpha = alpha;
        this.div = div;
        this.s = s;

        this.instance = instance;
        this.startTime = new Date().getTime() / 1000;

        this.fit();
    
    };

    Sat.prototype.fit = function() {

        let lits = new Set();

        for (let i = 0; i < this.instance.length; i++)
            for (let j = 0; j < this.instance[i].length; j++)
                lits.add(Math.abs(this.instance[i][j]));

        let ind = 0;
        let obj = {};

        for (let lit of lits)
            obj[ind++] = lit;

        let vectors = [];

        for (let i = 0; i < this.instance.length; i++) {

            let v = [];

            for (let j = 0; j < lits.size; j++) {

                v.push(0);

            }

            let s = new Set(this.instance[i]);

            for (let key in obj) {

                if (s.has(+key)) {

                    v[obj[key]] = 1;

                } else if (s.has(-key)) {

                    v[obj[key]] = -1;

                }

            }
            
            vectors.push(v);

        }

        let max = -Infinity;
        let p = new Perception(lits.size, this.alpha, this.div);
        let countBefore = 0;
           
        for (let j = 0; j < vectors.length; j++) {
           
            let dw = p.fit(vectors[j]);
                    
            if (p.correct(dw, vectors[j])) {
                     
                countBefore++;
           
            }
           
        }
           
        if (countBefore > max) {
           
            max = countBefore;
           
            console.log('initial: ' + (this.instance.length - max));
           
            if (max === this.instance.length)
  
                return;
           
        }
        
        while (1) {

            vectors = shuffle(vectors);

            for (let i = 0; i < vectors.length; i++) {

                let vec = vectors[i];
                let dw = p.fit(vec);
                
                p.train(dw, vec);


            }

            let count = 0;
           
            for (let j = 0; j < vectors.length; j++) {
           
                let dw = p.fit(vectors[j]);
                    
                if (p.correct(dw, vectors[j])) {
                     
                    count++;
           
                }
           
            }
           
            if (count > max) {
           
                max = count;
           
                console.log('o ' + (this.instance.length - max));
           
                if (max === this.instance.length)
                    return;
           
            }

            let endTime = new Date().getTime() / 1000;

            if (endTime - this.startTime > this.s)
                break;



        }

        console.log('r: ' + (this.instance.length - max));

    };

    const Perception = function(n, a, d) {

        this.w = [];
        this.a = a;
        this.d = d;

        for (let i = 0; i < n; i++) {

            this.w.push(getRandom(-1, 1));

        }

    };

    Perception.prototype.fit = function(x) {

        let dw = [];

        for (let i = 0; i < x.length; i++) {

            dw.push(x[i] * this.w[i]);

        }

        return dw;

    };

    Perception.prototype.train = function(x, vec) {

        let dw = [];
        let count = 0;

        for (let i = 0; i < x.length; i++)
            if (x[i] < 0)
                count++;

        count += 1;
        count = count / this.d;

        for (let i = 0; i < x.length; i++) {
            

            if (vec[i] > 0)
                dw.push((1 - x[i]) * this.a * count);
            else if (vec[i] < 0)
                dw.push((1 - x[i]) * -this.a * count);
            else
                dw.push(0); 

        }

        for (let i = 0; i < dw.length; i++)
            this.w[i] += dw[i];

    };

    Perception.prototype.correct = function(a) {

        let count = 0;
        let actual = 0;

        for (let i = 0; i < a.length; i++)
            if (a[i] !== 0)
                actual++;

        for (let i = 0; i < a.length; i++) {

            if (a[i] < 0)
                count++;

       }

       return count < actual ? true : false;

    };

    function getRandom(min, max) {
        
        return Math.random() * (max - min + 1) + min;
   
    };

    function shuffle(a) {
        
        let j, x, i;
        
        for (i = a.length - 1; i > 0; i--) {
        
            j = Math.floor(Math.random() * (i + 1));
        
            x = a[i];
        
            a[i] = a[j];
            a[j] = x;
        
        }
        
        return a;
    };
   

    if (module && module.exports)
        module.exports = Sat;
    else
        window.Sat = Sat;

})();
