let fs = require('fs');
let sat = require('./sat.js');
let test1 = require('./w-approxi.js');
let test2 = require('./r-approxi.js');

let Parser = function() {

	var args = process.argv.slice(2);

	if (! args.length) {

		console.log('Usage:\nnode main.js [--iw] path/to/dimacs.cnf [path/to/other/dimacs.cnf ...]\n\t--iw ignores the first literal in dimacs clause as weight (has to be used with *.wcnf files)\n\tPass at least one dimacs file as a parameter');
		return;

	}

	let option = null;

	// params for perceptron-sat... could also be given as command line params...

	let a = 0.9;
	let d = 1000.0;
	let s = 500;

	if (args[0] === '--iw')
		option = args.shift();

	for (let arg = 0; arg < args.length; arg++) {

		let path = args[arg];
		let clauses = [];
		let data = fs.readFileSync(path, 'utf8');		

		console.log(path);
		
		data = data.split(' 0');

		for (let i = 0; i < data.length; i++) {

			let clause = [];
		
			if (data[i].indexOf('c') !== -1)
				continue;

			if (data[i].indexOf('p') !== -1)
				continue;

			if (data[i].trim() === '')
				continue;

			if (data[i].trim() === '%')
				continue;

			if (parseInt(data[i].trim()) === 0)
				continue;

			let temp = data[i].split(' ');

			if (option)
				temp.shift();

			for (let j = 0; j < temp.length; j++)
				clause.push(parseInt(temp[j].replace(/(\r\n\t|\n|\r\t)/gm, "")));

			clauses.push(clause);
		}	

		if (isNaN(clauses[clauses.length - 1][0]))
			clauses.pop();

		console.log('No clauses ' + clauses.length);

		let set = {};

		for (let i = 0; i < clauses.length; i++)
			for (let j = 0; j < clauses[i].length; j++)
				set[clauses[i][j]] = true;

		console.log('No literals ' + Object.keys(set).length);

		let startTime = new Date().getTime();

		let copy = JSON.parse(JSON.stringify(clauses));

		if (clauses.length <= 500)
			new test1(clauses);
		
		new sat(copy, a, d, s);
		new test2(copy);
		
		let endTime = new Date().getTime();
		let total = endTime - startTime;

		console.log('Time taken ' + total);

	}

};

module.exports = Parser;
